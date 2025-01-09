import { MessageTypes } from './messageTypes';
import { TemplateTypes } from './templateTypes';
import { FileManager } from './fileManager';

export class MessageValidator {
  static async validateMessage(message, options = {}) {
    const errors = [];
    const warnings = [];

    // Get message type configuration
    const typeConfig = MessageTypes[message.type];
    if (!typeConfig) {
      errors.push(`Invalid message type: ${message.type}`);
      return { isValid: false, errors, warnings };
    }

    // Content validation based on message type
    if (message.text) {
      this.validateTextContent(message.text, typeConfig, errors);
    }

    // File validation
    if (message.file) {
      await this.validateFile(message.file, typeConfig, errors);
    }

    // Button validation
    if (message.button) {
      this.validateButton(message.button, typeConfig, errors);
    }

    // Template validation
    if (message.template) {
      this.validateTemplateUsage(message.template, message.variables, errors);
    }

    // TTL validation
    if (message.ttl) {
      this.validateTTL(message.ttl, errors);
    }

    // Session validation
    if (options.sessionValidation) {
      this.validateSessionConstraints(options.sessionValidation, errors);
    }

    // Recipient validation
    if (message.recipient) {
      this.validateRecipient(message.recipient, errors);
    }

    // Cost optimization warnings
    this.checkCostOptimization(message, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateTextContent(text, typeConfig, errors) {
    if (text.length > typeConfig.validation.maxLength) {
      errors.push(`Text exceeds maximum length of ${typeConfig.validation.maxLength} characters`);
    }

    if (typeConfig.validation.allowMarkdown) {
      // Validate markdown syntax
      const markdownErrors = this.validateMarkdown(text);
      errors.push(...markdownErrors);
    }

    if (!typeConfig.validation.allowEmojis && /[\u{1F300}-\u{1F9FF}]/u.test(text)) {
      errors.push('Emojis are not allowed in this message type');
    }
  }

  static async validateFile(file, typeConfig, errors) {
    if (!typeConfig.validation.formats) {
      errors.push('Files are not allowed in this message type');
      return;
    }

    const fileValidation = await FileManager.validateFile(file, typeConfig.validation);
    if (!fileValidation.isValid) {
      errors.push(...fileValidation.errors);
    }
  }

  static validateButton(button, typeConfig, errors) {
    if (!typeConfig.validation.button) {
      errors.push('Buttons are not allowed in this message type');
      return;
    }

    if (!button.caption || button.caption.length > typeConfig.validation.button.captionMaxLength) {
      errors.push(`Button caption must be between 1 and ${typeConfig.validation.button.captionMaxLength} characters`);
    }

    if (typeConfig.validation.button.requiresAction && !button.action) {
      errors.push('Button action is required');
    }
  }

  static validateTemplateUsage(template, variables, errors) {
    const templateConfig = TemplateTypes[template.type];
    if (!templateConfig) {
      errors.push('Invalid template type');
      return;
    }

    // Check if all required variables are provided
    const requiredVars = template.variables || [];
    const missingVars = requiredVars.filter(v => !variables || !variables[v]);
    if (missingVars.length > 0) {
      errors.push(`Missing required variables: ${missingVars.join(', ')}`);
    }
  }

  static validateTTL(ttl, errors) {
    const minTTL = 30; // 30 seconds
    const maxTTL = 14 * 24 * 60 * 60; // 14 days in seconds

    if (ttl < minTTL || ttl > maxTTL) {
      errors.push(`TTL must be between ${minTTL} seconds and ${maxTTL} seconds`);
    }
  }

  static validateSessionConstraints(sessionValidation, errors) {
    if (!sessionValidation.valid) {
      errors.push(`Session constraint: ${sessionValidation.reason}`);
    }
  }

  static validateRecipient(recipient, errors) {
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(recipient.replace(/[\s-]/g, ''))) {
      errors.push('Invalid phone number format');
    }
  }

  static validateMarkdown(text) {
    const errors = [];
    // Add markdown validation rules as needed
    return errors;
  }

  static checkCostOptimization(message, warnings) {
    // Add cost optimization checks
    if (message.type === 'TEXT_IMAGE_BUTTON' && !message.button) {
      warnings.push('Adding a button could improve conversion rates');
    }

    if (message.text && message.text.length > 500) {
      warnings.push('Long messages may have lower engagement rates');
    }
  }
} 