import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import CreateCampaign from './CreateCampaign';
import CampaignStatusManager from './CampaignStatusManager';
import { loadFromStorage, saveToStorage, initialMockData } from '../../utils/storage';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [availableTags, setAvailableTags] = useState(['VIP', 'Active', 'New', 'Premium']);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const savedCampaigns = loadFromStorage('campaigns', initialMockData.campaigns);
    const savedClients = loadFromStorage('clients', initialMockData.clients);
    const savedTags = loadFromStorage('availableTags', initialMockData.availableTags);
    
    setAvailableTags(savedTags);
    setClients(savedClients);
    setCampaigns(savedCampaigns);
    
    // Ensure data is saved to localStorage
    saveToStorage('campaigns', savedCampaigns);
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) {  // Only save if we have data
      saveToStorage('campaigns', campaigns);
    }
  }, [campaigns]);

  const handleCreateCampaign = (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: campaigns.length + 1,
      status: 'draft',
      progress: 0,
      sentMessages: 0,
      deliveryRate: 0,
      targetDisplay: formatTargetDisplay(campaignData),
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const formatTargetDisplay = (campaign) => {
    switch (campaign.targetType) {
      case 'specific':
        return `${campaign.selectedClients.length} specific clients`;
      case 'group':
        return `Group: ${campaign.clientGroup}`;
      case 'custom':
        return `${campaign.numberList.length} custom numbers`;
      default:
        return 'Unknown target';
    }
  };

  const handleDeleteCampaign = (campaignId) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId));
  };

  const handleToggleCampaign = (campaign) => {
    if (!campaign) return;
    
    // Add any missing properties
    const updatedCampaign = {
      ...campaign,
      lastUpdated: campaign.lastUpdated || new Date().toISOString(),
      progress: campaign.progress || 0,
      sentMessages: campaign.sentMessages || 0,
      totalRecipients: campaign.totalRecipients || 0,
      deliveryRate: campaign.deliveryRate || 0,
    };
    
    setSelectedCampaign(updatedCampaign);
  };

  const handleUpdateCampaignStatus = (updatedCampaign) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === updatedCampaign.id ? updatedCampaign : c
      )
    );
    setSelectedCampaign(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      scheduled: 'info',
      completed: 'default',
      draft: 'warning',
      paused: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateCampaignOpen(true)}
        >
          Create Campaign
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search campaigns"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredCampaigns.map((campaign) => (
          <Grid item xs={12} sm={6} md={4} key={campaign.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {campaign.name}
                  </Typography>
                  <Chip
                    label={campaign.status}
                    color={getStatusColor(campaign.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Type: {campaign.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Target: {campaign.targetDisplay}
                </Typography>
                {campaign.status === 'scheduled' && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Scheduled: {new Date(campaign.scheduledDate).toLocaleDateString()}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{campaign.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={campaign.progress}
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Recipients
                      </Typography>
                      <Typography variant="body2">{campaign.totalRecipients}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Delivery Rate
                      </Typography>
                      <Typography variant="body2">{campaign.deliveryRate}%</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit Campaign">
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Manage Status">
                  <IconButton
                    size="small"
                    onClick={() => handleToggleCampaign(campaign)}
                  >
                    {campaign.status === 'active' ? <StopIcon /> : <StartIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Schedule Campaign">
                  <IconButton size="small">
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Campaign">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateCampaign
        open={createCampaignOpen}
        onClose={() => setCreateCampaignOpen(false)}
        onSave={handleCreateCampaign}
        clients={clients}
        availableTags={availableTags}
      />

      <CampaignStatusManager
        open={Boolean(selectedCampaign)}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
        onUpdateStatus={handleUpdateCampaignStatus}
      />
    </Box>
  );
};

export default Campaigns; 