import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

export function TemplateSection({ templates, activeTemplate, onTemplateSelect, variables, onVariablesChange }) {
  const handleVariableChange = (index, value) => {
    const newVariables = [...variables];
    newVariables[index] = value;
    onVariablesChange(newVariables);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Template</InputLabel>
        <Select
          value={activeTemplate?.id || ''}
          label="Select Template"
          onChange={(e) => onTemplateSelect(templates.find(t => t.id === e.target.value))}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {templates.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {activeTemplate && activeTemplate.variables?.map((variable, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Variable: ${variable}`}
          value={variables[index] || ''}
          onChange={(e) => handleVariableChange(index, e.target.value)}
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
} 