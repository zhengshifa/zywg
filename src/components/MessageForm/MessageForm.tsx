import {
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Fab from '@mui/material/Fab'
import ArrowUpward from '@mui/icons-material/ArrowUpward'

import { messageCharacterSizeLimit } from 'config/messaging'

interface MessageFormProps {
  onMessageSubmit: (message: string) => void
  isMessageSending: boolean
}

export const MessageForm = ({
  onMessageSubmit,
  isMessageSending,
}: MessageFormProps) => {
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [textMessage, setTextMessage] = useState('')

  useEffect(() => {
    const { current: textField } = textFieldRef
    if (!textField) return

    textField.focus()
  }, [textFieldRef])

  const canMessageBeSent = () => {
    return (
      textMessage.trim().length > 0 &&
      textMessage.length < messageCharacterSizeLimit &&
      !isMessageSending
    )
  }

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setTextMessage(value)
  }

  const submitMessage = () => {
    onMessageSubmit(textMessage)
    setTextMessage('')
  }

  const handleMessageKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, shiftKey } = event

    if (key === 'Enter' && shiftKey === false) {
      event.preventDefault()

      if (!canMessageBeSent()) return

      submitMessage()
    }
  }

  const handleMessageSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitMessage()
  }

  return (
    <form onSubmit={handleMessageSubmit} className="p-4">
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <TextField
            variant="outlined"
            value={textMessage}
            onChange={handleMessageChange}
            onKeyPress={handleMessageKeyPress}
            size="medium"
            placeholder="Your message"
            inputRef={textFieldRef}
            multiline
          />
        </FormControl>
        <Fab
          sx={{
            flexShrink: 0,
            // The !important is needed to override a Stack style
            marginTop: 'auto!important',
          }}
          aria-label="Send"
          type="submit"
          disabled={!canMessageBeSent()}
          color="primary"
        >
          <ArrowUpward />
        </Fab>
      </Stack>
    </form>
  )
}
