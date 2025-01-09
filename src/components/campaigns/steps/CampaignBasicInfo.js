import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';
import { CampaignTypes } from '../../../utils/campaignTypes';

export default function CampaignBasicInfo({ data, onUpdate }) {
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
          onChange={handleChange('type')}
          label="Campaign Type"
        >
          <MenuItem value="TRANSACTIONAL">
            <Box>
              <Typography variant="subtitle1">Transactional</Typography>
              <Typography variant="caption" color="text.secondary">
                For service updates and notifications
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="PROMOTIONAL">
            <Box>
              <Typography variant="subtitle1">Promotional</Typography>
              <Typography variant="caption" color="text.secondary">
                For marketing and promotional content
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem value="SESSION">
            <Box>
              <Typography variant="subtitle1">Session</Typography>
              <Typography variant="caption" color="text.secondary">
                For interactive conversations
              </Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {selectedType && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {selectedType.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Features:
            </Typography>
            <ul>
              {Object.entries(selectedType.features).map(([key, value]) => (
                <li key={key}>
                  <Typography variant="body2">
                    <strong>{key}:</strong> {value.toString()}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Example Use Cases:
            </Typography>
            <ul>
              {selectedType.examples.map((example, index) => (
                <li key={index}>
                  <Typography variant="body2">{example}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 