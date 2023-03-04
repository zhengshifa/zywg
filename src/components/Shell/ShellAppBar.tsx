import { styled } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Fab from '@mui/material/Fab'
import StepIcon from '@mui/material/StepIcon'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import Zoom from '@mui/material/Zoom'

import ExpandMore from '@mui/icons-material/ExpandMore'
import Fullscreen from '@mui/icons-material/Fullscreen'
import FullscreenExit from '@mui/icons-material/FullscreenExit'
import Link from '@mui/icons-material/Link'
import Menu from '@mui/icons-material/Menu'
import QrCode2 from '@mui/icons-material/QrCode2'
import RoomPreferences from '@mui/icons-material/RoomPreferences'

import { drawerWidth } from './Drawer'
import { peerListWidth } from './PeerList'

interface AppBarProps extends MuiAppBarProps {
  isDrawerOpen?: boolean
  isPeerListOpen?: boolean
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop =>
    prop !== 'isDrawerOpen' && prop !== 'isPeerListOpen',
})<AppBarProps>(({ theme, isDrawerOpen, isPeerListOpen }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isDrawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  }),
  ...(isPeerListOpen && {
    width: `calc(100% - ${peerListWidth}px)`,
    marginRight: `${peerListWidth}px`,
  }),
  ...((isDrawerOpen || isPeerListOpen) && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(isDrawerOpen &&
    isPeerListOpen && {
      width: `calc(100% - ${drawerWidth}px - ${peerListWidth}px)`,
    }),
}))

interface ShellAppBarProps {
  doShowPeers: boolean
  onDrawerOpen: () => void
  onLinkButtonClick: () => Promise<void>
  isDrawerOpen: boolean
  isPeerListOpen: boolean
  numberOfPeers: number
  title: string
  onPeerListClick: () => void
  onRoomControlsClick: () => void
  setIsQRCodeDialogOpen: (isOpen: boolean) => void
  showAppBar: boolean
  isFullscreen: boolean
  setIsFullscreen: (isFullscreen: boolean) => void
}

export const ShellAppBar = ({
  doShowPeers,
  onDrawerOpen,
  onLinkButtonClick,
  isDrawerOpen,
  isPeerListOpen,
  setIsQRCodeDialogOpen,
  numberOfPeers,
  title,
  onPeerListClick,
  onRoomControlsClick,
  showAppBar,
  isFullscreen,
  setIsFullscreen,
}: ShellAppBarProps) => {
  const handleQRCodeClick = () => setIsQRCodeDialogOpen(true)
  const onClickFullscreen = () => setIsFullscreen(!isFullscreen)
  return (
    <>
      <Slide appear={false} in={showAppBar} mountOnEnter unmountOnExit>
        <AppBar
          position="fixed"
          isDrawerOpen={isDrawerOpen}
          isPeerListOpen={isPeerListOpen}
        >
          <Toolbar
            variant="regular"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="Open menu"
              sx={{ mr: 2, ...(isDrawerOpen && { display: 'none' }) }}
              onClick={onDrawerOpen}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ marginRight: 'auto' }}
            >
              {title}
            </Typography>
            <Tooltip title="Copy current URL">
              <IconButton
                size="large"
                color="inherit"
                aria-label="Copy current URL"
                onClick={onLinkButtonClick}
              >
                <Link />
              </IconButton>
            </Tooltip>
            {doShowPeers ? (
              <>
                <Tooltip title="Show QR Code">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="Show QR Code"
                    onClick={handleQRCodeClick}
                  >
                    <QrCode2 />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Show Room Controls">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="show room controls"
                    onClick={onRoomControlsClick}
                  >
                    <RoomPreferences />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="fullscreen"
                    onClick={onClickFullscreen}
                  >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Click to show peer list">
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="Peer list"
                    onClick={onPeerListClick}
                  >
                    <StepIcon icon={numberOfPeers} />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </Toolbar>
        </AppBar>
      </Slide>
      <Zoom
        style={{ position: 'absolute', left: '16px', top: '16px' }}
        in={!showAppBar}
        unmountOnExit
      >
        <Tooltip title="Show room controls">
          <Fab
            size="small"
            aria-label="show room controls"
            color="primary"
            onClick={onRoomControlsClick}
          >
            <ExpandMore />
          </Fab>
        </Tooltip>
      </Zoom>
    </>
  )
}
