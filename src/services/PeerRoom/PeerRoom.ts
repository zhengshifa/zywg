import { joinRoom, Room, BaseRoomConfig } from 'trystero'
import { TorrentRoomConfig } from 'trystero/torrent'

import { sleep } from 'utils'

export enum PeerHookType {
  NEW_PEER = 'NEW_PEER',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SCREEN = 'SCREEN',
  FILE_SHARE = 'FILE_SHARE',
}

export enum PeerStreamType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SCREEN = 'SCREEN',
}

const streamQueueAddDelay = 1000

export class PeerRoom {
  private room: Room

  private roomConfig: TorrentRoomConfig & BaseRoomConfig

  private peerJoinHandlers: Map<
    PeerHookType,
    Parameters<Room['onPeerJoin']>[0]
  > = new Map()

  private peerLeaveHandlers: Map<
    PeerHookType,
    Parameters<Room['onPeerLeave']>[0]
  > = new Map()

  private peerStreamHandlers: Map<
    PeerStreamType,
    Parameters<Room['onPeerStream']>[0]
  > = new Map()

  private streamQueue: (() => Promise<any>)[] = []

  private isProcessingPendingStreams = false

  constructor(config: TorrentRoomConfig & BaseRoomConfig, roomId: string) {
    this.roomConfig = config
    this.room = joinRoom(this.roomConfig, roomId)

    this.room.onPeerJoin((...args) => {
      for (const [, peerJoinHandler] of this.peerJoinHandlers) {
        peerJoinHandler(...args)
      }
    })

    this.room.onPeerLeave((...args) => {
      for (const [, peerLeaveHandler] of this.peerLeaveHandlers) {
        peerLeaveHandler(...args)
      }
    })

    this.room.onPeerStream((...args) => {
      for (const [, peerStreamHandler] of this.peerStreamHandlers) {
        peerStreamHandler(...args)
      }
    })
  }

  flush = () => {
    this.onPeerJoinFlush()
    this.onPeerLeaveFlush()
    this.onPeerStreamFlush()
  }

  leaveRoom = () => {
    this.room.leave()
    this.flush()
  }

  onPeerJoin = (
    peerHookType: PeerHookType,
    fn: Parameters<Room['onPeerJoin']>[0]
  ) => {
    this.peerJoinHandlers.set(peerHookType, fn)
  }

  onPeerJoinFlush = () => {
    this.peerJoinHandlers = new Map()
  }

  onPeerLeave = (
    peerHookType: PeerHookType,
    fn: Parameters<Room['onPeerLeave']>[0]
  ) => {
    this.peerLeaveHandlers.set(peerHookType, fn)
  }

  onPeerLeaveFlush = () => {
    this.peerLeaveHandlers = new Map()
  }

  onPeerStream = (
    peerStreamType: PeerStreamType,
    fn: Parameters<Room['onPeerStream']>[0]
  ) => {
    this.peerStreamHandlers.set(peerStreamType, fn)
  }

  onPeerStreamFlush = () => {
    this.peerStreamHandlers = new Map()
  }

  getPeers: Room['getPeers'] = () => {
    return this.room.getPeers()
  }

  makeAction = <T>(namespace: string) => {
    return this.room.makeAction<T>(namespace)
  }

  addStream = (...args: Parameters<Room['addStream']>) => {
    // New streams need to be added as a delayed queue to prevent race
    // conditions on the receiver's end where streams and their metadata get
    // mixed up.
    this.streamQueue.push(
      () => Promise.all(this.room.addStream(...args)),
      () => sleep(streamQueueAddDelay)
    )

    this.processPendingStreams()
  }

  private processPendingStreams = async () => {
    if (this.isProcessingPendingStreams) return

    this.isProcessingPendingStreams = true

    while (this.streamQueue.length > 0) {
      await this.streamQueue.shift()?.()
    }

    this.isProcessingPendingStreams = false
  }

  removeStream: Room['removeStream'] = (stream, targetPeers) => {
    return this.room.removeStream(stream, targetPeers)
  }
}
