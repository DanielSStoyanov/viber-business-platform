import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Typography,
  Stack
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { MessageStatus } from './MessageStatus';
import { MessageTypeIndicator } from './MessageTypeIndicator';
import { MessageDetailsPanel } from './MessageDetailsPanel';

export function MessageList({ messages }) {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    messageType: 'All',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedMessages(messages.map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      }
      return [...prev, messageId];
    });
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setDetailsOpen(true);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search messages"
          value={filters.search}
          onChange={handleFilterChange('search')}
          sx={{ minWidth: 300 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={handleFilterChange('status')}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="0">Delivered</MenuItem>
            <MenuItem value="1">Seen</MenuItem>
            <MenuItem value="2">Expired</MenuItem>
            <MenuItem value="8">Blocked</MenuItem>
            <MenuItem value="9">Auto Reply</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Message Type</InputLabel>
          <Select
            value={filters.messageType}
            label="Message Type"
            onChange={handleFilterChange('messageType')}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="206">Text Only</MenuItem>
            <MenuItem value="207">Image Only</MenuItem>
            <MenuItem value="208">Text + Image + Button</MenuItem>
            <MenuItem value="231">Video + Text</MenuItem>
            <MenuItem value="220">File Transfer</MenuItem>
            <MenuItem value="306">Session Message</MenuItem>
            <MenuItem value="307">Session Reply</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            type="date"
            label="Start"
            value={filters.dateRange.start}
            onChange={(e) => handleFilterChange('dateRange.start')(e)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End"
            value={filters.dateRange.end}
            onChange={(e) => handleFilterChange('dateRange.end')(e)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedMessages.length === messages.length}
                  indeterminate={selectedMessages.length > 0 && selectedMessages.length < messages.length}
                />
              </TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow 
                key={message.id}
                selected={selectedMessages.includes(message.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    onChange={() => handleSelectMessage(message.id)}
                  />
                </TableCell>
                <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                <TableCell>{message.recipient}</TableCell>
                <TableCell>
                  <MessageTypeIndicator type={message.type.code} />
                </TableCell>
                <TableCell>
                  <Box sx={{ 
                    maxWidth: 200, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' 
                  }}>
                    {message.content}
                  </Box>
                </TableCell>
                <TableCell>
                  <MessageStatus 
                    status={message.status.current}
                    history={message.status.history}
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewDetails(message)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedMessages.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {selectedMessages.length} row{selectedMessages.length > 1 ? 's' : ''} selected
          </Typography>
        </Box>
      )}

      {selectedMessage && (
        <MessageDetailsPanel
          message={selectedMessage}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedMessage(null);
          }}
        />
      )}
    </Box>
  );
} 