import { useCallback, useMemo } from 'react';

export const SessionConfig = {
  DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_MESSAGES: 60,
  MAX_CONSECUTIVE: 10,
  RESET_ON_USER_REPLY: true
};

export class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.messageCounters = new Map();
  }

  startSession(userId) {
    const session = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      consecutiveMessages: 0,
      userReplies: 0,
      status: 'active'
    };

    this.sessions.set(userId, session);
    return session;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validateSession(userId) {
    const session = this.sessions.get(userId);
    if (!session) return { valid: false, reason: 'No active session' };

    const elapsed = Date.now() - session.startTime;
    if (elapsed > SessionConfig.DURATION) {
      return { valid: false, reason: 'Session expired' };
    }

    if (session.messageCount >= SessionConfig.MAX_MESSAGES) {
      return { valid: false, reason: 'Message limit reached' };
    }

    if (session.consecutiveMessages >= SessionConfig.MAX_CONSECUTIVE) {
      return { valid: false, reason: 'Consecutive message limit reached' };
    }

    return { valid: true };
  }

  recordMessage(userId) {
    const session = this.sessions.get(userId);
    if (!session) return false;

    session.messageCount++;
    session.consecutiveMessages++;
    session.lastActivity = Date.now();

    // Update daily counter
    const today = new Date().toISOString().split('T')[0];
    const counter = this.messageCounters.get(today) || 0;
    this.messageCounters.set(today, counter + 1);

    return true;
  }

  recordUserReply(userId) {
    const session = this.sessions.get(userId);
    if (!session) return false;

    session.userReplies++;
    session.consecutiveMessages = 0;
    session.lastActivity = Date.now();

    if (SessionConfig.RESET_ON_USER_REPLY) {
      session.messageCount = 0;
    }

    return true;
  }

  getSessionStats(userId) {
    const session = this.sessions.get(userId);
    if (!session) return null;

    return {
      duration: Date.now() - session.startTime,
      messageCount: session.messageCount,
      consecutiveMessages: session.consecutiveMessages,
      userReplies: session.userReplies,
      remainingMessages: SessionConfig.MAX_MESSAGES - session.messageCount,
      remainingConsecutive: SessionConfig.MAX_CONSECUTIVE - session.consecutiveMessages
    };
  }

  getDailyStats(date = new Date()) {
    const day = date.toISOString().split('T')[0];
    return this.messageCounters.get(day) || 0;
  }
}

// Enhanced Session Hook
export function useSession(userId) {
  const sessionManager = useMemo(() => new SessionManager(), []);

  const ensureSession = useCallback(() => {
    let session = sessionManager.sessions.get(userId);
    if (!session) {
      session = sessionManager.startSession(userId);
    }
    return session;
  }, [userId, sessionManager]);

  return {
    startSession: () => sessionManager.startSession(userId),
    validateSession: useCallback(() => sessionManager.validateSession(userId), [userId, sessionManager]),
    recordMessage: () => sessionManager.recordMessage(userId),
    recordUserReply: () => sessionManager.recordUserReply(userId),
    getSessionStats: () => sessionManager.getSessionStats(userId),
    getDailyStats: (date) => sessionManager.getDailyStats(date),
    ensureSession
  };
} 