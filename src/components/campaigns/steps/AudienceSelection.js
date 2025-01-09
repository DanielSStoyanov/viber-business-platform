import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
  Stack,
  TextField,
  CircularProgress
} from '@mui/material';
import { useClients } from '../../../utils/clientsManager';

export default function AudienceSelection({ data, onUpdate }) {
  const { clients, tags, loading } = useClients();

  const handleTypeChange = (event) => {
    onUpdate({
      audience: {
        ...data.audience,
        type: event.target.value,
        tags: [],
        selectedClients: []
      }
    });
  };

  const handleTagSelect = (tag) => {
    const newTags = data.audience.tags.includes(tag)
      ? data.audience.tags.filter(t => t !== tag)
      : [...data.audience.tags, tag];

    onUpdate({
      audience: {
        ...data.audience,
        tags: newTags
      }
    });
  };

  const handleClientSelect = (clientId) => {
    const newSelected = data.audience.selectedClients.includes(clientId)
      ? data.audience.selectedClients.filter(id => id !== clientId)
      : [...data.audience.selectedClients, clientId];

    onUpdate({
      audience: {
        ...data.audience,
        selectedClients: newSelected
      }
    });
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Audience Type</InputLabel>
          <Select
            value={data.audience.type}
            onChange={handleTypeChange}
            label="Audience Type"
          >
            <MenuItem value="all">All Clients</MenuItem>
            <MenuItem value="tags">Filter by Tags</MenuItem>
            <MenuItem value="individual">Select Individual Clients</MenuItem>
          </Select>
        </FormControl>
      )}

      {data.audience.type === 'tags' && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Tags
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagSelect(tag)}
                color={data.audience.tags.includes(tag) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {data.audience.type === 'individual' && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Clients
          </Typography>
          <TextField
            fullWidth
            placeholder="Search clients..."
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {clients.map((client) => (
              <Chip
                key={client.id}
                label={`${client.name} (${client.phoneNumber})`}
                onClick={() => handleClientSelect(client.id)}
                color={data.audience.selectedClients.includes(client.id) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Audience Summary
        </Typography>
        <Typography>
          {data.audience.type === 'all' && 'All clients will receive this campaign'}
          {data.audience.type === 'tags' && `Selected ${data.audience.tags.length} tags`}
          {data.audience.type === 'individual' && `Selected ${data.audience.selectedClients.length} clients`}
        </Typography>
      </Paper>
    </Box>
  );
} 