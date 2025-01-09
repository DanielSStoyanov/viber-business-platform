import { useState, useCallback } from 'react';

export class TTLManager {
  static MIN_TTL = 30; // 30 seconds
  static MAX_TTL = 1209600; // 14 days in seconds
  static DEFAULT_TTL = 86400; // 24 hours

  static validateTTL(ttl) {
    const ttlInSeconds = this.convertToSeconds(ttl);
    return ttlInSeconds >= this.MIN_TTL && ttlInSeconds <= this.MAX_TTL;
  }

  static convertToSeconds(ttl) {
    if (typeof ttl === 'string') {
      // Parse duration strings like '1h', '30m', '45s'
      const value = parseInt(ttl);
      const unit = ttl.slice(-1).toLowerCase();
      
      switch (unit) {
        case 'h': return value * 3600;
        case 'm': return value * 60;
        case 's': return value;
        default: return parseInt(ttl);
      }
    }
    return ttl;
  }

  static calculateExpiryTime(ttl) {
    const ttlInSeconds = this.convertToSeconds(ttl);
    return new Date(Date.now() + (ttlInSeconds * 1000));
  }

  static getTTLRemaining(message) {
    const expiryTime = new Date(message.expiryTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expiryTime - now) / 1000));
  }

  static getRecommendedTTL(messageType) {
    switch (messageType) {
      case 'transactional':
        return 3600; // 1 hour
      case 'promotional':
        return 86400; // 24 hours
      case 'session':
        return 1800; // 30 minutes
      default:
        return this.DEFAULT_TTL;
    }
  }
}

// TTL Hook
export function useTTL() {
  const [ttl, setTTL] = useState(TTLManager.DEFAULT_TTL);
  const [expiryTime, setExpiryTime] = useState(null);

  const updateTTL = useCallback((newTTL) => {
    if (TTLManager.validateTTL(newTTL)) {
      setTTL(newTTL);
      setExpiryTime(TTLManager.calculateExpiryTime(newTTL));
    } else {
      throw new Error('Invalid TTL value');
    }
  }, []);

  return {
    ttl,
    expiryTime,
    updateTTL,
    isValid: TTLManager.validateTTL(ttl),
    remaining: expiryTime ? TTLManager.getTTLRemaining({ expiryTime }) : null
  };
} 