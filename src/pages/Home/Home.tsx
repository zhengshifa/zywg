import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiLink from '@mui/material/Link'
import GitHubIcon from '@mui/icons-material/GitHub'
import Cached from '@mui/icons-material/Cached'
import Tooltip from '@mui/material/Tooltip'
import { v4 as uuid } from 'uuid'

import { routes } from 'config/routes'
import { ShellContext } from 'contexts/ShellContext'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { ReactComponent as Logo } from 'img/logo.svg'

interface HomeProps {
  userId: string
}

export function Home({ userId }: HomeProps) {
  const { setTitle } = useContext(ShellContext)
  const [roomName, setRoomName] = useState(uuid())
  const navigate = useNavigate()

  useEffect(() => {
    setTitle('Chitchatter')
  }, [setTitle])

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setRoomName(value)
  }

  const handleFormSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleJoinPublicRoomClick = () => {
    navigate(`/public/${roomName}`)
  }

  const handleJoinPrivateRoomClick = () => {
    navigate(`/private/${roomName}`)
  }

  const isRoomNameValid = roomName.length > 0

  return (
    <Box className="Home">
      <main className="mt-6 px-4 max-w-3xl text-center mx-auto">
        <Link to={routes.ABOUT}>
          <Logo className="px-1 pb-4 mx-auto max-w-md" />
        </Link>
        <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto">
          <Typography sx={{ mb: 2 }}>
            Your user name:{' '}
            <PeerNameDisplay paragraph={false} sx={{ fontWeight: 'bold' }}>
              {userId}
            </PeerNameDisplay>
          </Typography>
          <FormControl fullWidth>
            <Tooltip title="Default room names are randomly generated client-side">
              <TextField
                label="Room name"
                variant="outlined"
                value={roomName}
                onChange={handleRoomNameChange}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Regenerate room id"
                      onClick={() => setRoomName(uuid())}
                      size="small"
                    >
                      <Cached />
                    </IconButton>
                  ),
                  sx: { fontSize: { xs: '0.9rem', sm: '1rem' } },
                }}
                size="medium"
              />
            </Tooltip>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={handleJoinPublicRoomClick}
              sx={{
                marginTop: 2,
              }}
              disabled={!isRoomNameValid}
            >
              Join public room
            </Button>
            <Button
              variant="contained"
              onClick={handleJoinPrivateRoomClick}
              sx={{
                marginTop: 2,
                marginLeft: 2,
              }}
              disabled={!isRoomNameValid}
            >
              Join private room
            </Button>
          </Box>
        </form>
      </main>
      <Divider sx={{ my: 2 }} />
      <Box className="max-w-3xl text-center mx-auto px-4">
        <Typography variant="body1">
          This is a communication tool that is free, open source, and designed
          for simplicity and security. All communication between you and your
          online peers is encrypted. There is no trace of your conversation once
          you leave.
        </Typography>
      </Box>
      <Tooltip title="View project source code and documentation">
        <MuiLink
          href="https://github.com/jeremyckahn/chitchatter"
          target="_blank"
          sx={{ display: 'block', textAlign: 'center', color: '#fff' }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Open menu"
            sx={{ mx: 'auto' }}
          >
            <GitHubIcon sx={{ fontSize: '2em' }} />
          </IconButton>
        </MuiLink>
      </Tooltip>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        Licensed under{' '}
        <MuiLink
          href="https://github.com/jeremyckahn/chitchatter/blob/develop/LICENSE"
          target="_blank"
        >
          GPL v2
        </MuiLink>
        . Please{' '}
        <MuiLink
          href="https://github.com/jeremyckahn/chitchatter/blob/develop/README.md"
          target="_blank"
        >
          read the docs
        </MuiLink>
        .
      </Typography>
    </Box>
  )
}
