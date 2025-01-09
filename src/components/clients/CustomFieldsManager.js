import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';

const FIELD_TYPES = ['text', 'number', 'date', 'select'];

const CustomFieldsManager = ({ open, onClose, customFields, onUpdateFields }) => {
  const [newField, setNewField] = useState({ name: '', type: 'text', options: '' });
  const [error, setError] = useState('');

  const handleAddField = () => {
    if (!newField.name.trim()) {
      setError('Field name is required');
      return;
    }

    const fieldKey = newField.name.toLowerCase().replace(/\s+/g, '_');
    
    if (customFields.some(field => field.key === fieldKey)) {
      setError('Field name already exists');
      return;
    }

    const fieldToAdd = {
      key: fieldKey,
      name: newField.name.trim(),
      type: newField.type,
      options: newField.type === 'select' ? 
        newField.options.split(',').map(opt => opt.trim()).filter(Boolean) : 
        [],
    };

    onUpdateFields([...customFields, fieldToAdd]);
    setNewField({ name: '', type: 'text', options: '' });
    setError('');
  };

  const handleDeleteField = (fieldKey) => {
    onUpdateFields(customFields.filter(field => field.key !== fieldKey));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Custom Fields</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Add custom fields to store additional client information
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              placeholder="Field name"
              error={Boolean(error)}
              helperText={error}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                label="Type"
              >
                {FIELD_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newField.type === 'select' && (
              <TextField
                size="small"
                value={newField.options}
                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                placeholder="Options (comma-separated)"
              />
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddField}
            >
              Add
            </Button>
          </Box>
        </Box>
        <List>
          {customFields.map((field) => (
            <ListItem
              key={field.key}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteField(field.key)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={field.name}
                secondary={`Type: ${field.type}${
                  field.type === 'select' ? `, Options: ${field.options.join(', ')}` : ''
                }`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomFieldsManager; 