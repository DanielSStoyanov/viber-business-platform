import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider
} from '@mui/material';
import { CampaignTypes } from '../../../utils/campaignTypes';
import { useTemplateSystem } from '../../../utils/templateTypes';
import { FileUploader } from '../../shared/FileUploader';

export default function MessageConfiguration({ data, onUpdate }) {
  const [messageType, setMessageType] = useState('TEXT_ONLY');
  const [useTemplate, setUseTemplate] = useState(false);
  const { templates, applyTemplate } = useTemplateSystem();
  const [preview, setPreview] = useState(false);

  const campaignType = CampaignTypes[data.type];
  const allowedMessageTypes = campaignType?.messageCodes || [];

  const handleMessageTypeChange = (event) => {
    setMessageType(event.target.value);
    onUpdate({
      messageType: event.target.value,
      content: { ...data.content, type: event.target.value }
    });
  };

  const handleContentChange = (field) => (event) => {
    onUpdate({
      content: {
        ...data.content,
        [field]: event.target.value
      }
    });
  };

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    if (selectedTemplate) {
      onUpdate({
        content: {
          ...data.content,
          templateId,
          text: selectedTemplate.text,
          variables: {}
        }
      });
    }
  };

  const handleTTLChange = (event) => {
    const ttl = parseInt(event.target.value);
    onUpdate({
      ttl: isNaN(ttl) ? campaignType.features.defaultTTL : ttl
    });
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Message Type</InputLabel>
        <Select value={messageType} onChange={handleMessageTypeChange} label="Message Type">
          {allowedMessageTypes.map((code) => (
            <MenuItem key={code} value={code}>
              {code === 206 && 'Text Only'}
              {code === 207 && 'Image Only'}
              {code === 208 && 'Text + Image + Button'}
              {code === 209 && 'Rich Media'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={useTemplate}
            onChange={(e) => setUseTemplate(e.target.checked)}
          />
        }
        label="Use Template"
        sx={{ mb: 2 }}
      />

      {useTemplate ? (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Template</InputLabel>
          <Select
            value={data.content?.templateId || ''}
            onChange={handleTemplateChange}
            label="Select Template"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {templates
              .filter(t => t.type === data.type)
              .map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Message Content"
          value={data.content?.text || ''}
          onChange={handleContentChange('text')}
          sx={{ mb: 3 }}
        />
      )}

      {messageType.toString().includes('207') && (
        <FileUploader
          type="IMAGE"
          onFileSelect={(file) => onUpdate({ content: { ...data.content, file } })}
          validation={{ isValid: true, errors: [] }}
          sx={{ mb: 3 }}
        />
      )}

      {messageType.toString().includes('208') && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Button Text"
            value={data.content?.button?.text || ''}
            onChange={handleContentChange('button.text')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Button URL"
            value={data.content?.button?.url || ''}
            onChange={handleContentChange('button.url')}
          />
        </Box>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Message TTL (Time To Live)
        </Typography>
        <TextField
          type="number"
          fullWidth
          label="TTL in seconds"
          value={data.ttl || campaignType.features.defaultTTL}
          onChange={handleTTLChange}
          helperText={`Default: ${campaignType.features.defaultTTL} seconds, Max: ${campaignType.features.maxTTL} seconds`}
        />
      </Paper>

      <Button
        variant="outlined"
        onClick={togglePreview}
        sx={{ mb: 2 }}
      >
        {preview ? 'Hide Preview' : 'Show Preview'}
      </Button>

      {preview && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
          <Typography variant="subtitle2" gutterBottom>
            Message Preview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            {useTemplate && data.content?.templateId
              ? applyTemplate(data.content.templateId, data.content.variables)
              : data.content?.text}
          </Typography>
          {data.content?.file && (
            <Box sx={{ mt: 2 }}>
              <img
                src={URL.createObjectURL(data.content.file)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Box>
          )}
          {data.content?.button && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled
            >
              {data.content.button.text}
            </Button>
          )}
        </Paper>
      )}

      {campaignType.features.requiresOptIn && (
        <Alert severity="info" sx={{ mt: 2 }}>
          This campaign type requires user opt-in. Make sure your audience has consented to receive these messages.
        </Alert>
      )}
    </Box>
  );
} 