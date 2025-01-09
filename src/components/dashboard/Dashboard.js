import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Description as TemplateIcon,
  People as ClientsIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CreateMessage from '../messages/CreateMessage';
import CreateTemplate from '../templates/CreateTemplate';

const MetricCard = ({ title, value, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      {subtitle && (
        <Typography color="textSecondary" sx={{ fontSize: 14 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [createMessageOpen, setCreateMessageOpen] = useState(false);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    todayMessages: 0,
    weeklyMessages: 0,
    deliveredMessages: 0,
    seenMessages: 0,
    totalClients: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Replace with actual API calls
    const fetchDashboardData = async () => {
      try {
        // Simulated data
        setMetrics({
          totalMessages: 1234,
          todayMessages: 56,
          weeklyMessages: 389,
          deliveredMessages: 1200,
          seenMessages: 980,
          totalClients: 450,
        });

        setChartData([
          { name: 'Mon', messages: 65 },
          { name: 'Tue', messages: 59 },
          { name: 'Wed', messages: 80 },
          { name: 'Thu', messages: 81 },
          { name: 'Fri', messages: 56 },
          { name: 'Sat', messages: 55 },
          { name: 'Sun', messages: 40 },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    { title: 'Create Message', icon: <AddIcon />, action: () => setCreateMessageOpen(true) },
    { title: 'Create Template', icon: <TemplateIcon />, action: () => setCreateTemplateOpen(true) },
    { title: 'Manage Clients', icon: <ClientsIcon />, path: '/clients' },
    { title: 'View Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
  ];

  const handleSendMessage = (messageData) => {
    // Handle message creation
    console.log('Message created:', messageData);
    setCreateMessageOpen(false);
    navigate('/messages'); // Navigate to messages after creation
  };

  const handleSaveTemplate = (templateData) => {
    // Handle template creation
    console.log('Template created:', templateData);
    setCreateTemplateOpen(false);
    navigate('/templates'); // Navigate to templates after creation
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2}>
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outlined"
              startIcon={action.icon}
              onClick={action.action || (() => navigate(action.path))}
              sx={{ py: 1 }}
            >
              {action.title}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Messages Sent"
            value={metrics.totalMessages}
            subtitle={`${metrics.todayMessages} today • ${metrics.weeklyMessages} this week`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Delivered Messages"
            value={metrics.deliveredMessages}
            subtitle={`${Math.round((metrics.deliveredMessages / metrics.totalMessages) * 100)}% delivery rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Seen Messages"
            value={metrics.seenMessages}
            subtitle={`${Math.round((metrics.seenMessages / metrics.deliveredMessages) * 100)}% read rate`}
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Message Sending Trends
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#7360F2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Create Message Dialog */}
      <CreateMessage
        open={createMessageOpen}
        onClose={() => setCreateMessageOpen(false)}
        onSend={handleSendMessage}
      />

      {/* Create Template Dialog */}
      <CreateTemplate
        open={createTemplateOpen}
        onClose={() => setCreateTemplateOpen(false)}
        onSave={handleSaveTemplate}
        clients={[]} // Pass your clients data here if needed
      />
    </Box>
  );
};

export default Dashboard; 