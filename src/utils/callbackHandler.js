import { useMemo, useEffect, useCallback } from 'react';

export class CallbackHandler {
  constructor() {
    this.callbacks = new Map();
  }

  registerCallback(type, handler) {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, new Set());
    }
    this.callbacks.get(type).add(handler);
  }

  unregisterCallback(type, handler) {
    if (this.callbacks.has(type)) {
      this.callbacks.get(type).delete(handler);
    }
  }

  handleCallback(data) {
    const { message } = data;

    // Determine callback type
    let type = 'unknown';
    if (data.message_status !== undefined) {
      type = 'status';
    } else if (message?.text) {
      type = 'user_reply';
    } else if (message?.media) {
      type = 'user_media';
    }

    // Notify registered handlers
    const handlers = this.callbacks.get(type) || new Set();
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in callback handler: ${error}`);
      }
    });
  }
}

// Callback Hook
export function useCallbacks() {
  const callbackHandler = useMemo(() => new CallbackHandler(), []);

  const registerHandler = useCallback((type, handler) => {
    callbackHandler.registerCallback(type, handler);
    return () => callbackHandler.unregisterCallback(type, handler);
  }, [callbackHandler]);

  useEffect(() => {
    // Set up WebSocket or polling mechanism for callbacks
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callbackHandler.handleCallback(data);
    };

    return () => ws.close();
  }, [callbackHandler]);

  return {
    registerHandler
  };
} 