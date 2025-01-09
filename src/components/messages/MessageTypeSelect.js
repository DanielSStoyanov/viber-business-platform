import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { MessageTypes } from '../../utils/messageTypes';

export function MessageTypeSelect({ value, onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>Message Type</InputLabel>
      <Select
        value={value}
        label="Message Type"
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.entries(MessageTypes).map(([key, type]) => (
          <MenuItem key={key} value={key}>
            {type.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
} 