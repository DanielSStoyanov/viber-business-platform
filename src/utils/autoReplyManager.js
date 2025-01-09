import { useState, useCallback, useMemo } from 'react';

export class AutoReplyManager {
  static MAX_REPLY_LENGTH = 1000;

  constructor() {
    this.customReply = null;
    this.isEnabled = false;
  }

  setCustomReply(reply) {
    if (reply.length > this.MAX_REPLY_LENGTH) {
      throw new Error(`Auto reply exceeds maximum length of ${this.MAX_REPLY_LENGTH} characters`);
    }
    this.customReply = reply;
  }

  getDefaultReply(businessName) {
    return `${businessName} does not currently receive messages. Go to chat info for more contact information.`;
  }

  enableAutoReply(enabled = true) {
    this.isEnabled = enabled;
  }

  getAutoReply(businessName) {
    if (!this.isEnabled) return null;
    return this.customReply || this.getDefaultReply(businessName);
  }
}

// Auto Reply Hook
export function useAutoReply(businessName) {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [customReply, setCustomReply] = useState('');
  const [error, setError] = useState(null);

  const autoReplyManager = useMemo(() => new AutoReplyManager(), []);

  const updateCustomReply = useCallback((reply) => {
    try {
      autoReplyManager.setCustomReply(reply);
      setCustomReply(reply);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }, [autoReplyManager]);

  const toggleAutoReply = useCallback((enabled) => {
    autoReplyManager.enableAutoReply(enabled);
    setAutoReplyEnabled(enabled);
  }, [autoReplyManager]);

  return {
    autoReplyEnabled,
    customReply,
    error,
    currentReply: autoReplyManager.getAutoReply(businessName),
    updateCustomReply,
    toggleAutoReply
  };
} 