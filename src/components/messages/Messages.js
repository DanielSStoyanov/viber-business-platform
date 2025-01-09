import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Visibility as VisibilityIcon,
  CheckCircle as DeliveredIcon,
  RemoveRedEye as SeenIcon,
  Error as ErrorIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import MessageDetails from './MessageDetails';
import CreateMessage from './CreateMessage';

const statusIcons = {
  delivered: <DeliveredIcon color="success" />,
  seen: <SeenIcon color="primary" />,
  error: <ErrorIcon color="error" />,
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: [null, null],
    messageType: 'all',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [createMessageOpen, setCreateMessageOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulated data for development
  useEffect(() => {
    const mockData = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      recipient: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      messageType: ['text', 'image', 'video', 'file'][Math.floor(Math.random() * 4)],
      content: `Sample message content ${index + 1}`,
      status: ['delivered', 'seen', 'error'][Math.floor(Math.random() * 3)],
      trackingData: `tracking_${index + 1}`,
    }));
    setMessages(mockData);
    setLoading(false);
  }, []);

  const handleSendMessage = (messageData) => {
    // In a real app, you would send this to your API
    setMessages([messageData, ...messages]);
  };

  const columns = [
    {
      field: 'timestamp',
      headerName: 'Date & Time',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { field: 'recipient', headerName: 'Recipient', width: 150 },
    { field: 'messageType', headerName: 'Type', width: 100 },
    {
      field: 'content',
      headerName: 'Content',
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value.substring(0, 50)}...</span>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {statusIcons[params.value]}
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => setSelectedMessage(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.recipient.includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      filters.status === 'all' || message.status === filters.status;
    
    const matchesType =
      filters.messageType === 'all' || message.messageType === filters.messageType;
    
    const matchesDate =
      !filters.dateRange[0] ||
      !filters.dateRange[1] ||
      (new Date(message.timestamp) >= filters.dateRange[0] &&
        new Date(message.timestamp) <= filters.dateRange[1]);

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Messages</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateMessageOpen(true)}
        >
          Create Message
        </Button>
      </Box>

      {/* Filters Paper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="seen">Seen</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Message Type</InputLabel>
              <Select
                value={filters.messageType}
                label="Message Type"
                onChange={(e) =>
                  setFilters({ ...filters, messageType: e.target.value })
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="file">File</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                value={filters.dateRange}
                onChange={(newValue) =>
                  setFilters({ ...filters, dateRange: newValue })
                }
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      {/* Messages Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredMessages}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* Message Details Dialog */}
      <Dialog
        open={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMessage && <MessageDetails message={selectedMessage} />}
      </Dialog>

      {/* Create Message Dialog */}
      <CreateMessage
        open={createMessageOpen}
        onClose={() => setCreateMessageOpen(false)}
        onSend={handleSendMessage}
      />
    </Box>
  );
};

export default Messages; 