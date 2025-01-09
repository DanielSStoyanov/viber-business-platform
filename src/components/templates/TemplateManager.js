import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Typography,
  Chip
} from '@mui/material';
import { useTemplateSystem } from '../../utils/templateTypes';
import { TemplateTypes } from '../../utils/templateTypes';

export default function TemplateManager({ open, onClose }) {
  const [templateData, setTemplateData] = useState({
    name: '',
    type: '',
    category: '',
    text: '',
    country: ''
  });
  const [error, setError] = useState(null);
  
  const { createTemplate, error: systemError } = useTemplateSystem();

  const handleCreate = async () => {
    try {
      setError(null);
      await createTemplate(templateData, templateData.type);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (field) => (event) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const variables = templateData.text ? 
    templateData.text.match(/\{\{[\w\d_]+\}\}/g)?.map(v => v.replace(/[{}]/g, '')) || [] 
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Message Template</DialogTitle>
      <DialogContent>
        {(error || systemError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || systemError}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Template Name"
            value={templateData.name}
            onChange={handleChange('name')}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Template Type</InputLabel>
            <Select
              value={templateData.type}
              label="Template Type"
              onChange={handleChange('type')}
            >
              {Object.entries(TemplateTypes).map(([key, type]) => (
                <MenuItem key={key} value={key}>
                  {type.label} - {type.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Category"
            value={templateData.category}
            onChange={handleChange('category')}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Country"
            value={templateData.country}
            onChange={handleChange('country')}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Template Text"
            value={templateData.text}
            onChange={handleChange('text')}
            helperText="Use {{variable_name}} for variables"
          />
        </Box>

        {variables.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detected Variables:
            </Typography>
            {variables.map((variable, index) => (
              <Chip
                key={index}
                label={variable}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Create Template
        </Button>
      </DialogActions>
    </Dialog>
  );
} 