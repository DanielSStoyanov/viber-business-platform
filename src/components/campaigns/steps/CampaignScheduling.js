import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { CampaignTypes } from '../../../utils/campaignTypes';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' }
];

export default function CampaignScheduling({ data, onUpdate }) {
  const [scheduleType, setScheduleType] = useState('immediate');
  const [recurring, setRecurring] = useState(false);
  const [deliveryWindow, setDeliveryWindow] = useState(false);

  const campaignType = CampaignTypes[data.type];

  const handleScheduleTypeChange = (event) => {
    const type = event.target.value;
    setScheduleType(type);
    onUpdate({
      schedule: {
        ...data.schedule,
        type,
        startDate: type === 'immediate' ? new Date() : data.schedule?.startDate
      }
    });
  };

  const handleDateChange = (field) => (date) => {
    onUpdate({
      schedule: {
        ...data.schedule,
        [field]: date
      }
    });
  };

  const handleRecurringChange = (event) => {
    setRecurring(event.target.checked);
    if (!event.target.checked) {
      onUpdate({
        schedule: {
          ...data.schedule,
          frequency: null,
          interval: null,
          endDate: null
        }
      });
    }
  };

  const handleDeliveryWindowChange = (event) => {
    setDeliveryWindow(event.target.checked);
    if (!event.target.checked) {
      onUpdate({
        schedule: {
          ...data.schedule,
          deliveryWindow: null
        }
      });
    }
  };

  const handleFrequencyChange = (event) => {
    onUpdate({
      schedule: {
        ...data.schedule,
        frequency: event.target.value
      }
    });
  };

  const handleTimezoneChange = (event) => {
    onUpdate({
      schedule: {
        ...data.schedule,
        timezone: event.target.value
      }
    });
  };

  const handleWindowTimeChange = (field) => (event) => {
    onUpdate({
      schedule: {
        ...data.schedule,
        deliveryWindow: {
          ...data.schedule?.deliveryWindow,
          [field]: event.target.value
        }
      }
    });
  };

  const getScheduleSummary = () => {
    if (!data.schedule) return 'No schedule set';

    const parts = [];
    if (data.schedule.type === 'immediate') {
      parts.push('Sends immediately');
    } else {
      parts.push(`Starts: ${new Date(data.schedule.startDate).toLocaleString()}`);
      if (recurring && data.schedule.endDate) {
        parts.push(`Ends: ${new Date(data.schedule.endDate).toLocaleString()}`);
      }
    }

    if (recurring && data.schedule.frequency) {
      parts.push(`Repeats: ${data.schedule.frequency}`);
    }

    if (deliveryWindow && data.schedule.deliveryWindow) {
      parts.push(`Delivery window: ${data.schedule.deliveryWindow.start} - ${data.schedule.deliveryWindow.end}`);
    }

    return parts.join(' | ');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Schedule Type</InputLabel>
          <Select
            value={scheduleType}
            onChange={handleScheduleTypeChange}
            label="Schedule Type"
          >
            <MenuItem value="immediate">Send Immediately</MenuItem>
            <MenuItem value="scheduled">Schedule for Later</MenuItem>
          </Select>
        </FormControl>

        {scheduleType === 'scheduled' && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={data.schedule?.startDate || null}
                  onChange={handleDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDateTime={new Date()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={data.schedule?.timezone || 'UTC'}
                    onChange={handleTimezoneChange}
                    label="Timezone"
                  >
                    {TIMEZONE_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Paper sx={{ p: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={recurring}
                    onChange={handleRecurringChange}
                  />
                }
                label="Recurring Schedule"
              />

              {recurring && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={data.schedule?.frequency || ''}
                          onChange={handleFrequencyChange}
                          label="Frequency"
                        >
                          {FREQUENCY_OPTIONS.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DateTimePicker
                        label="End Date & Time"
                        value={data.schedule?.endDate || null}
                        onChange={handleDateChange('endDate')}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDateTime={data.schedule?.startDate || new Date()}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={deliveryWindow}
                    onChange={handleDeliveryWindowChange}
                  />
                }
                label="Set Delivery Window"
              />

              {deliveryWindow && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="time"
                        label="Start Time"
                        value={data.schedule?.deliveryWindow?.start || '09:00'}
                        onChange={handleWindowTimeChange('start')}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="time"
                        label="End Time"
                        value={data.schedule?.deliveryWindow?.end || '17:00'}
                        onChange={handleWindowTimeChange('end')}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </>
        )}

        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Schedule Summary
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {getScheduleSummary().split(' | ').map((part, index) => (
              <Chip key={index} label={part} variant="outlined" size="small" />
            ))}
          </Stack>
        </Paper>

        {campaignType.features.requiresUserResponse && (
          <Alert severity="info">
            This campaign type requires user response. Messages will be sent according to session rules.
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
} 