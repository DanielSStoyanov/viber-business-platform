import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { CampaignTypes } from '../../../utils/campaignTypes';

export default function CampaignDetails({ data, onUpdate }) {
  const handleChange = (field) => (event) => {
    onUpdate({ [field]: event.target.value });
  };

  const selectedType = CampaignTypes[data.type];

  return (
    <Box>
      <TextField
        fullWidth
        label="Campaign Name"
        value={data.name}
        onChange={handleChange('name')}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Campaign Type</InputLabel>
        <Select
          value={data.type}
          label="Campaign Type"
          onChange={handleChange('type')}
        >
          {Object.entries(CampaignTypes).map(([key, type]) => (
            <MenuItem key={key} value={key}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Campaign Description"
        value={data.description}
        onChange={handleChange('description')}
        sx={{ mb: 3 }}
      />

      {selectedType && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedType.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {Object.entries(selectedType.features).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Example Use Cases:
            </Typography>
            <ul>
              {selectedType.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 