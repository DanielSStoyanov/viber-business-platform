import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  TextFields,
  Image,
  VideoLibrary,
  AttachFile,
  Chat
} from '@mui/icons-material';

// Viber-specific message type codes
const TYPE_CONFIG = {
  206: {
    label: 'Text Only',
    icon: TextFields,
    description: 'Text message'
  },
  207: {
    label: 'Image',
    icon: Image,
    description: 'Image message'
  },
  208: {
    label: 'Rich Media',
    icon: Image,
    description: 'Text + Image + Button'
  },
  231: {
    label: 'Video',
    icon: VideoLibrary,
    description: 'Video message with text'
  },
  220: {
    label: 'File',
    icon: AttachFile,
    description: 'File transfer'
  },
  306: {
    label: 'Session',
    icon: Chat,
    description: 'Interactive session message'
  },
  307: {
    label: 'Session Reply',
    icon: Chat,
    description: 'Session response message'
  }
};

export function MessageTypeIndicator({ type }) {
  const config = TYPE_CONFIG[type] || {
    label: 'Unknown',
    icon: TextFields,
    description: 'Unknown message type'
  };

  const TypeIcon = config.icon;

  return (
    <Tooltip title={config.description}>
      <Chip
        icon={<TypeIcon fontSize="small" />}
        label={config.label}
        variant="outlined"
        size="small"
      />
    </Tooltip>
  );
} 