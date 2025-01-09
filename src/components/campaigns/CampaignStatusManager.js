import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const STATUS_COLORS = {
  draft: 'default',
  scheduled: 'info',
  active: 'success',
  paused: 'warning',
  completed: 'primary',
  failed: 'error',
};

const CampaignStatusManager = ({ open, onClose, campaign, onUpdateStatus }) => {
  if (!campaign) {
    return null;
  }

  const handleStatusChange = (newStatus) => {
    onUpdateStatus({
      ...campaign,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    });
  };

  const getAvailableActions = () => {
    switch (campaign.status) {
      case 'draft':
        return ['start', 'schedule'];
      case 'scheduled':
        return ['start', 'cancel'];
      case 'active':
        return ['pause', 'stop'];
      case 'paused':
        return ['resume', 'stop'];
      default:
        return [];
    }
  };

  const renderActionButton = (action) => {
    switch (action) {
      case 'start':
        return (
          <Button
            startIcon={<StartIcon />}
            onClick={() => handleStatusChange('active')}
            color="success"
          >
            Start Now
          </Button>
        );
      case 'pause':
        return (
          <Button
            startIcon={<StopIcon />}
            onClick={() => handleStatusChange('paused')}
            color="warning"
          >
            Pause
          </Button>
        );
      case 'resume':
        return (
          <Button
            startIcon={<StartIcon />}
            onClick={() => handleStatusChange('active')}
            color="success"
          >
            Resume
          </Button>
        );
      case 'stop':
        return (
          <Button
            startIcon={<CancelIcon />}
            onClick={() => handleStatusChange('completed')}
            color="error"
          >
            Stop Campaign
          </Button>
        );
      case 'schedule':
        return (
          <Button
            startIcon={<ScheduleIcon />}
            onClick={() => handleStatusChange('scheduled')}
            color="info"
          >
            Schedule
          </Button>
        );
      case 'cancel':
        return (
          <Button
            startIcon={<CancelIcon />}
            onClick={() => handleStatusChange('draft')}
            color="error"
          >
            Cancel Schedule
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Campaign Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {campaign.name}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={campaign.status.toUpperCase()}
              color={STATUS_COLORS[campaign.status]}
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color="textSecondary">
              Last updated: {new Date(campaign.lastUpdated || Date.now()).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={campaign.progress || 0}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="textSecondary">
              {campaign.sentMessages || 0} of {campaign.totalRecipients || 0} messages sent (
              {campaign.deliveryRate || 0}% delivery rate)
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Available Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {getAvailableActions().map((action) => (
              <Box key={action}>{renderActionButton(action)}</Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignStatusManager; 