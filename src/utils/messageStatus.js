import { useState, useEffect, useMemo, useCallback } from 'react';

export const DeliveryStatus = {
  PENDING: {
    code: -1,
    label: 'Pending',
    description: 'Message is queued for delivery'
  },
  DELIVERED: {
    code: 0,
    label: 'Delivered',
    description: 'Message successfully delivered to recipient'
  },
  SEEN: {
    code: 1,
    label: 'Seen',
    description: 'Message was seen by recipient'
  },
  EXPIRED: {
    code: 2,
    label: 'Expired',
    description: 'Message exceeded TTL without delivery'
  },
  BLOCKED: {
    code: 8,
    label: 'Blocked',
    description: 'Message blocked by recipient'
  }
};

export class MessageTracker {
  constructor() {
    this.messageStatuses = new Map();
    this.statusListeners = new Map();
  }

  trackMessage(messageId, initialStatus = DeliveryStatus.PENDING.code) {
    this.messageStatuses.set(messageId, {
      status: initialStatus,
      timestamp: Date.now(),
      history: [{
        status: initialStatus,
        timestamp: Date.now()
      }]
    });
  }

  updateStatus(messageId, newStatus) {
    const messageData = this.messageStatuses.get(messageId);
    if (messageData) {
      messageData.status = newStatus;
      messageData.history.push({
        status: newStatus,
        timestamp: Date.now()
      });
      
      // Notify listeners
      const listeners = this.statusListeners.get(messageId) || [];
      listeners.forEach(listener => listener(messageData));
    }
  }

  getMessageStatus(messageId) {
    return this.messageStatuses.get(messageId);
  }

  addStatusListener(messageId, listener) {
    if (!this.statusListeners.has(messageId)) {
      this.statusListeners.set(messageId, new Set());
    }
    this.statusListeners.get(messageId).add(listener);
  }

  removeStatusListener(messageId, listener) {
    const listeners = this.statusListeners.get(messageId);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  isTerminalStatus(status) {
    return [
      DeliveryStatus.SEEN.code,
      DeliveryStatus.EXPIRED.code,
      DeliveryStatus.BLOCKED.code
    ].includes(status);
  }
}

// Enhanced Message Status Hook
export function useMessageStatus(messageId) {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const messageTracker = useMemo(() => new MessageTracker(), []);

  useEffect(() => {
    if (messageId) {
      const handleStatusUpdate = (messageData) => {
        setStatus(messageData.status);
        setHistory(messageData.history);
      };

      messageTracker.addStatusListener(messageId, handleStatusUpdate);
      return () => messageTracker.removeStatusListener(messageId, handleStatusUpdate);
    }
  }, [messageId, messageTracker]);

  const updateStatus = useCallback((newStatus) => {
    if (messageId) {
      messageTracker.updateStatus(messageId, newStatus);
    }
  }, [messageId, messageTracker]);

  return {
    status,
    history,
    updateStatus,
    isTerminal: status ? messageTracker.isTerminalStatus(status) : false,
    getStatusLabel: (code) => DeliveryStatus[Object.keys(DeliveryStatus).find(key => 
      DeliveryStatus[key].code === code
    )]?.label || 'Unknown'
  };
} 