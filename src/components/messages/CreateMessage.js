import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import { useTemplateSystem } from '../../utils/templateTypes';
import { useFileUpload } from '../../utils/fileManager';
import { useSession } from '../../utils/sessionManager';
import { useTTL } from '../../utils/ttlManager';
import { useAutoReply } from '../../utils/autoReplyManager';
import { useCallbacks } from '../../utils/callbackHandler';
import { MessageValidator } from '../../utils/messageValidator';
import { MessageTypeSelect } from './MessageTypeSelect';
import { TemplateSection } from './TemplateSection';
import { FileUploader } from '../shared/FileUploader';
import { RecipientSelector } from './RecipientSelector';

export default function CreateMessage({ open, onClose, initialType = 'TEXT_ONLY', onSend }) {
  const [messageType, setMessageType] = useState(initialType);
  const [text, setText] = useState('');
  const [button, setButton] = useState({ caption: '', action: '' });
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [recipients, setRecipients] = useState({ mode: 'single', recipients: [] });
  const [customReply] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  // Initialize all the hooks
  const { file, thumbnail, validation: fileValidation, handleFileSelect } = useFileUpload();
  const { ttl, updateTTL } = useTTL();
  const { 
    templates, 
    activeTemplate, 
    setActiveTemplate, 
    variables, 
    setVariables, 
    applyTemplate 
  } = useTemplateSystem();
  const { validateSession, recordMessage } = useSession(recipients.recipients[0]);
  const { autoReplyEnabled, toggleAutoReply } = useAutoReply(recipients.recipients[0]);
  const { registerHandler } = useCallbacks();

  // Validate message on changes
  useEffect(() => {
    const validateMessage = async () => {
      if (!isValidating) {
        setIsValidating(true);
        try {
          const sessionValidation = validateSession();
          const message = {
            type: messageType,
            text: activeTemplate ? applyTemplate(activeTemplate.id, variables) : text,
            file,
            button,
            ttl,
            recipient: recipients.recipients[0],
            template: activeTemplate,
            variables
          };

          const validation = await MessageValidator.validateMessage(message, {
            sessionValidation
          });

          setError(validation.errors[0] || null);
          setWarnings(validation.warnings);
        } finally {
          setIsValidating(false);
        }
      }
    };

    validateMessage();
  }, [messageType, text, file, button, ttl, activeTemplate, variables, recipients.recipients[0], isValidating, validateSession, applyTemplate]);

  // Register callback for message status updates
  useEffect(() => {
    return registerHandler('status', (data) => {
      console.log('Message status update:', data);
    });
  }, [registerHandler]);

  const handleRecipientsChange = (recipientData) => {
    setRecipients(recipientData);
  };

  const handleSend = async () => {
    try {
      setError(null);
      setWarnings([]);

      if (recipients.recipients.length === 0) {
        throw new Error('Please select at least one recipient');
      }

      // Prepare message data
      const message = {
        text: activeTemplate ? applyTemplate(activeTemplate.id, variables) : text,
        file,
        thumbnail,
        button,
        ttl,
        messageType,
        recipients: recipients.recipients,
        autoReply: autoReplyEnabled ? {
          enabled: true,
          customReply: customReply
        } : undefined,
        template: activeTemplate,
        variables
      };

      // Final validation before sending
      const validation = await MessageValidator.validateMessage(message, {
        sessionValidation: validateSession()
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Send message
      await onSend(message);
      recordMessage();
      onClose();
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Message</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {warnings.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {warnings.map((warning, index) => (
              <Chip
                key={index}
                label={warning}
                color="warning"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        <RecipientSelector onChange={handleRecipientsChange} />

        <Box sx={{ mb: 3 }}>
          <MessageTypeSelect value={messageType} onChange={setMessageType} />
        </Box>

        {messageType.includes('TEXT') && (
          <>
            <TemplateSection
              templates={templates}
              activeTemplate={activeTemplate}
              onTemplateSelect={setActiveTemplate}
              variables={variables}
              onVariablesChange={setVariables}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message Content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={Boolean(activeTemplate)}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {['IMAGE', 'VIDEO', 'FILE'].includes(messageType) && (
          <FileUploader
            type={messageType}
            onFileSelect={handleFileSelect}
            validation={fileValidation}
            thumbnail={thumbnail}
          />
        )}

        {messageType.includes('BUTTON') && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Button Caption"
              value={button.caption}
              onChange={(e) => setButton({ ...button, caption: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Button Action"
              value={button.action}
              onChange={(e) => setButton({ ...button, action: e.target.value })}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Message TTL (Time To Live)
          </Typography>
          <TextField
            type="number"
            label="TTL (seconds)"
            value={ttl}
            onChange={(e) => updateTTL(parseInt(e.target.value))}
            fullWidth
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={autoReplyEnabled}
              onChange={(e) => toggleAutoReply(e.target.checked)}
            />
          }
          label="Enable Auto Reply"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          color="primary"
          disabled={Boolean(error) || isValidating}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
} 