import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { useTemplateSystem } from '../../../utils/templateTypes';

export default function TemplateSelection({ data, campaignType, onUpdate }) {
  const { templates } = useTemplateSystem();

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    onUpdate({
      template: selectedTemplate,
      variables: selectedTemplate ? 
        selectedTemplate.variables.reduce((acc, v) => ({ ...acc, [v]: '' }), {}) 
        : {}
    });
  };

  const handleVariableChange = (variable) => (event) => {
    onUpdate({
      variables: {
        ...data.variables,
        [variable]: event.target.value
      }
    });
  };

  const availableTemplates = templates.filter(t => t.type === campaignType);

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Template</InputLabel>
        <Select
          value={data.template?.id || ''}
          onChange={handleTemplateChange}
          label="Select Template"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {availableTemplates.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {data.template && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Template Variables
          </Typography>
          {Object.keys(data.variables).map((variable) => (
            <TextField
              key={variable}
              fullWidth
              label={variable}
              value={data.variables[variable]}
              onChange={handleVariableChange(variable)}
              sx={{ mb: 2 }}
            />
          ))}
        </Paper>
      )}
    </Box>
  );
} 