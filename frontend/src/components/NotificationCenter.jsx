// Notification Center Component - TURN 3 OPTIONAL
import React, { useState } from 'react';
import { Box, Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Button, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearIcon from '@mui/icons-material/Clear';
import useWebSocket from '../hooks/useWebSocket';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, clearNotifications, connected } = useWebSocket();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      {/* Notification Bell */}
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Connection Status */}
      <Chip 
        icon={<span style={{ color: connected ? 'green' : 'red' }}>●</span>}
        label={connected ? 'Live' : 'Offline'}
        size="small"
        sx={{ ml: 1 }}
      />

      {/* Notification Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {notifications.length > 0 && (
              <Button startIcon={<ClearIcon />} onClick={clearNotifications} size="small">
                Clear All
              </Button>
            )}
          </Box>

          {notifications.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: 'center', color: '#999' }}>
              No notifications
            </Typography>
          ) : (
            <List>
              {notifications.map((notif, idx) => (
                <ListItem key={idx} sx={{ borderBottom: '1px solid #eee' }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={notif.type} size="small" />
                        <span>{notif.message}</span>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default NotificationCenter;
