import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Typography,
  Button
} from '@mui/material';
import { useClients } from '../../utils/clientsManager'; // You'll need to create this hook

export function RecipientSelector({ onChange }) {
  const [mode, setMode] = useState('single');
  const [singleNumber, setSingleNumber] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [multipleNumbers, setMultipleNumbers] = useState('');
  const { clients, tags } = useClients();

  const handleModeChange = (event) => {
    setMode(event.target.value);
    // Reset recipients when changing mode
    onChange({ mode: event.target.value, recipients: [] });
  };

  const handleSingleNumberChange = (event) => {
    const number = event.target.value;
    setSingleNumber(number);
    onChange({ mode: 'single', recipients: [number] });
  };

  const handleClientsChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedClients(selectedIds);
    const selectedNumbers = selectedIds.map(id => 
      clients.find(c => c.id === id)?.phoneNumber
    ).filter(Boolean);
    onChange({ mode: 'clients', recipients: selectedNumbers });
  };

  const handleMultipleNumbersChange = (event) => {
    const text = event.target.value;
    setMultipleNumbers(text);
    // Split by commas, newlines, or spaces and clean up
    const numbers = text.split(/[\s,]+/)
      .map(n => n.trim())
      .filter(n => n.match(/^\+?[1-9]\d{1,14}$/));
    onChange({ mode: 'multiple', recipients: numbers });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Recipient Mode</InputLabel>
        <Select value={mode} onChange={handleModeChange} label="Recipient Mode">
          <MenuItem value="single">Single Number</MenuItem>
          <MenuItem value="clients">Select from Clients</MenuItem>
          <MenuItem value="multiple">Multiple Numbers</MenuItem>
        </Select>
      </FormControl>

      {mode === 'single' && (
        <TextField
          fullWidth
          label="Phone Number"
          value={singleNumber}
          onChange={handleSingleNumberChange}
          placeholder="+1234567890"
          helperText="Enter phone number with country code"
        />
      )}

      {mode === 'clients' && (
        <Box>
          <FormControl fullWidth>
            <InputLabel>Select Clients</InputLabel>
            <Select
              multiple
              value={selectedClients}
              onChange={handleClientsChange}
              renderValue={(selected) => (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selected.map((id) => (
                    <Chip
                      key={id}
                      label={clients.find(c => c.id === id)?.name}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name} ({client.phoneNumber})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {tags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Select by Tag
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const clientsWithTag = clients
                        .filter(c => c.tags?.includes(tag))
                        .map(c => c.id);
                      setSelectedClients(clientsWithTag);
                      handleClientsChange({ target: { value: clientsWithTag } });
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {mode === 'multiple' && (
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Phone Numbers"
          value={multipleNumbers}
          onChange={handleMultipleNumbersChange}
          placeholder="Enter multiple phone numbers (separated by commas, spaces, or newlines)"
          helperText="Format: +1234567890, +0987654321"
        />
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        All numbers should include country code
      </Typography>
    </Box>
  );
} 