'use client';

import React from 'react';
import {
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

interface LeftDrawerProps {
  className?: string;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({ className }) => {
  const [open, setOpen] = React.useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Colors for drawer based on theme
  const isDark = theme === 'dark';
  const drawerStyles = {
    paper: {
      backgroundColor: isDark ? '#121212' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    },
    listItem: {
      '&:hover': {
        backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
      },
    },
  };

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        bgcolor: drawerStyles.paper.backgroundColor,
        color: drawerStyles.paper.color,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {['Home', 'Menus'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={drawerStyles.listItem}
              onClick={() => navigate(`/${text.toLowerCase()}`)}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Profile', 'Settings', 'Help'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton sx={drawerStyles.listItem}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className={className}>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon className={isDark ? 'text-white' : 'text-black'} />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: drawerStyles.paper,
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default LeftDrawer;
