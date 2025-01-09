import React from 'react';
import {
  Box,
  Chip,
  LinearProgress,
  Typography,
  Tooltip
} from '@mui/material';
import { Forum } from '@mui/icons-material';

export function SessionIndicator({ session }) {
  if (!session) return null;

  const timeRemaining = Math.max(0, session.timeRemaining);
  const progress = (session.messageCount / 60) * 100; // 60 is max messages per session

  return (
    <Box>
      <Tooltip
        title={
          <div>
            <div>Session ID: {session.id}</div>
            <div>Messages: {session.messageCount}/60</div>
            <div>Time Remaining: {Math.round(timeRemaining / 60)} minutes</div>
          </div>
        }
      >
        <Chip
          icon={<Forum fontSize="small" />}
          label={`Session ${session.messageCount}/60`}
          color={session.timeRemaining > 0 ? 'primary' : 'error'}
          size="small"
        />
      </Tooltip>
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          color={progress > 80 ? 'error' : 'primary'}
        />
        <Typography variant="caption" color="text.secondary">
          {Math.round(timeRemaining / 60)}m remaining
        </Typography>
      </Box>
    </Box>
  );
} 