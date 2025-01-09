export const CampaignTypes = {
  TRANSACTIONAL: {
    code: 301,
    label: 'Transactional',
    description: 'For essential business communications',
    messageCodes: [106, 206, 301],
    features: {
      priority: 'high',
      defaultTTL: 3600, // 1 hour
      maxTTL: 86400, // 24 hours
      pricing: 'premium',
      allowedRegions: ['Russia', 'Ukraine', 'Belarus'],
      requiresOptIn: false
    },
    examples: [
      'Order confirmations',
      'Account updates',
      'Payment receipts'
    ]
  },
  PROMOTIONAL: {
    code: 207,
    label: 'Promotional',
    description: 'For marketing and promotional content',
    messageCodes: [207, 208, 209],
    features: {
      priority: 'normal',
      defaultTTL: 86400, // 24 hours
      maxTTL: 604800, // 7 days
      pricing: 'standard',
      requiresOptIn: true
    },
    examples: [
      'Marketing campaigns',
      'Sales announcements',
      'New product launches'
    ]
  },
  SESSION: {
    code: 306,
    label: 'Session',
    description: 'For interactive conversations',
    messageCodes: [306, 307],
    features: {
      priority: 'normal',
      sessionDuration: 86400, // 24 hours
      maxMessages: 60,
      maxConsecutive: 10,
      pricing: 'session-based',
      requiresUserResponse: true
    },
    examples: [
      'Customer support',
      'Interactive surveys',
      'Guided workflows'
    ]
  }
};

export class CampaignValidator {
  static validateCampaign(campaign) {
    const errors = [];
    const warnings = [];
    const type = CampaignTypes[campaign.type];

    if (!type) {
      errors.push('Invalid campaign type');
      return { isValid: false, errors, warnings };
    }

    // Validate schedule
    if (campaign.schedule) {
      const scheduleErrors = this.validateSchedule(campaign.schedule);
      errors.push(...scheduleErrors);
    }

    // Validate audience
    if (!campaign.audience || campaign.audience.length === 0) {
      errors.push('Campaign must have at least one recipient');
    }

    // Type-specific validation
    switch (campaign.type) {
      case 'TRANSACTIONAL':
        if (!campaign.businessId) {
          errors.push('Transactional campaigns require a business ID');
        }
        break;
      case 'PROMOTIONAL':
        if (!campaign.optInVerification) {
          warnings.push('Consider verifying opt-in status for promotional messages');
        }
        break;
      case 'SESSION':
        if (campaign.messages.length > type.features.maxMessages) {
          errors.push(`Session campaigns cannot exceed ${type.features.maxMessages} messages`);
        }
        break;
      default:
        errors.push('Invalid campaign type');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateSchedule(schedule) {
    const errors = [];
    const now = new Date();

    if (schedule.startDate && new Date(schedule.startDate) < now) {
      errors.push('Start date cannot be in the past');
    }

    if (schedule.endDate && new Date(schedule.endDate) < new Date(schedule.startDate)) {
      errors.push('End date must be after start date');
    }

    if (schedule.recurring) {
      if (!schedule.frequency) {
        errors.push('Recurring campaigns must specify frequency');
      }
      if (!schedule.endDate) {
        errors.push('Recurring campaigns must have an end date');
      }
    }

    return errors;
  }
} 