import { PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Home from '@mui/icons-material/Home'
import SettingsApplications from '@mui/icons-material/SettingsRounded'
import QuestionMark from '@mui/icons-material/QuestionMark'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ReportIcon from '@mui/icons-material/Report'

import { routes } from 'config/routes'
import { SettingsContext } from 'contexts/SettingsContext'
import { PeerNameDisplay } from 'components/PeerNameDisplay'

import { DrawerHeader } from './DrawerHeader'

export const drawerWidth = 240

export interface DrawerProps extends PropsWithChildren {
  isDrawerOpen: boolean
  onAboutLinkClick: () => void
  onDisclaimerClick: () => void
  onDrawerClose: () => void
  onHomeLinkClick: () => void
  onSettingsLinkClick: () => void
  theme: Theme
  userPeerId: string
}

export const Drawer = ({
  isDrawerOpen,
  onAboutLinkClick,
  onDisclaimerClick,
  onDrawerClose,
  onHomeLinkClick,
  onSettingsLinkClick,
  theme,
  userPeerId,
}: DrawerProps) => {
  const settingsContext = useContext(SettingsContext)
  const colorMode = settingsContext.getUserSettings().colorMode

  const handleColorModeToggleClick = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light'
    settingsContext.updateUserSettings({ colorMode: newMode })
  }

  return (
    <MuiDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <DrawerHeader>
        <IconButton onClick={onDrawerClose} aria-label="Close menu">
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <ListItem disablePadding>
        <ListItemText
          sx={{
            padding: '1em 1.5em',
          }}
          primary={
            <Typography>
              Your user name:{' '}
              <PeerNameDisplay sx={{ fontWeight: 'bold' }}>
                {userPeerId}
              </PeerNameDisplay>
            </Typography>
          }
        />
      </ListItem>
      <Divider />
      <List role="navigation">
        <Link to={routes.ROOT} onClick={onHomeLinkClick}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to={routes.SETTINGS} onClick={onSettingsLinkClick}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsApplications />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to={routes.ABOUT} onClick={onAboutLinkClick}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <QuestionMark />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to={routes.DISCLAIMER} onClick={onDisclaimerClick}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Disclaimer" />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton onClick={handleColorModeToggleClick}>
            <ListItemIcon>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </ListItemIcon>
            <ListItemText primary="Change theme" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </MuiDrawer>
  )
}
