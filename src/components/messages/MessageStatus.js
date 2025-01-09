import React from 'react';
import { Chip, Tooltip, Box } from '@mui/material';
import {
  CheckCircle,
  RemoveRedEye,
  AccessTime,
  Block,
  Reply,
  Error
} from '@mui/icons-material';

const STATUS_CONFIG = {
  0: {
    label: 'Delivered',
    color: 'success',
    icon: CheckCircle,
    description: 'Message was delivered to recipient'
  },
  1: {
    label: 'Seen',
    color: 'primary',
    icon: RemoveRedEye,
    description: 'Message was seen by recipient'
  },
  2: {
    label: 'Expired',
    color: 'warning',
    icon: AccessTime,
    description: 'Message TTL expired before delivery'
  },
  8: {
    label: 'Blocked',
    color: 'error',
    icon: Block,
    description: 'Message was blocked or recipient opted out'
  },
  9: {
    label: 'Auto Reply',
    color: 'info',
    icon: Reply,
    description: 'Custom automatic reply was sent'
  }
};

export function MessageStatus({ status, history }) {
  const currentStatus = STATUS_CONFIG[status] || {
    label: 'Unknown',
    color: 'default',
    icon: Error,
    description: 'Status unknown'
  };

  const StatusIcon = currentStatus.icon;

  return (
    <Box>
      <Tooltip 
        title={
          <div>
            <div>{currentStatus.description}</div>
            {history && history.length > 0 && (
              <div>
                <strong>Status History:</strong>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {history.map((h, i) => (
                    <li key={i}>
                      {STATUS_CONFIG[h.status]?.label} - {new Date(h.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        }
      >
        <Chip
          icon={<StatusIcon fontSize="small" />}
          label={currentStatus.label}
          color={currentStatus.color}
          size="small"
        />
      </Tooltip>
    </Box>
  );
} 