import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { MessageStatus } from './MessageStatus';
import { MessageTypeIndicator } from './MessageTypeIndicator';

export function MessageDetailsPanel({ message, open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Message Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Basic Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Message ID: {message.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sent: {new Date(message.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recipient: {message.recipient}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TTL: {message.ttl} seconds
                </Typography>
              </Box>
              <MessageTypeIndicator type={message.type.code} />
            </Paper>
          </Grid>

          {/* Status Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Status Information
              </Typography>
              <MessageStatus 
                status={message.status.current} 
                history={message.status.history}
              />
              {message.billing && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Cost: {message.billing.cost}
                  </Typography>
                  <Typography variant="body2">
                    Rate: {message.billing.rate}
                  </Typography>
                  <Chip 
                    label={message.billing.status}
                    size="small"
                    color="primary"
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Session Information */}
          {message.session && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Session Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      Session ID: {message.session.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      Messages: {message.session.messageCount}/60
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      Time Remaining: {Math.round(message.session.timeRemaining / 60)} minutes
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Tracking Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tracking Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Message Token: {message.tracking.messageToken}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Delivery Status: {message.tracking.deliveryStatus}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {message.tracking.callbacks.map((callback, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={callback.event}
                      secondary={new Date(callback.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
} 