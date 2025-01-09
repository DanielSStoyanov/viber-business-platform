import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
} from '@mui/material';

const MessageDetails = ({ message }) => {
  return (
    <>
      <DialogTitle>Message Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Recipient
            </Typography>
            <Typography variant="body1">{message.recipient}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Sent At
            </Typography>
            <Typography variant="body1">
              {new Date(message.timestamp).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                color={
                  message.status === 'delivered'
                    ? 'success'
                    : message.status === 'seen'
                    ? 'primary'
                    : 'error'
                }
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Message Type
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {message.messageType}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Tracking Data
            </Typography>
            <Typography variant="body1">{message.trackingData}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Content
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {message.content}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => window.print()} color="primary">
          Print
        </Button>
        <Button onClick={() => {}} color="primary">
          Download
        </Button>
        <Button onClick={() => {}} color="primary">
          Resend
        </Button>
      </DialogActions>
    </>
  );
};

export default MessageDetails; 