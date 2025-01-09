export const MessageTypes = {
  // Text Messages
  TEXT_ONLY: {
    code: 206,
    type: 'transactional',
    label: 'Text Only',
    validation: {
      maxLength: 1000,
      allowMarkdown: true,
      allowEmojis: true
    }
  },
  
  // Image Messages
  IMAGE_ONLY: {
    code: 207,
    type: 'promotional',
    label: 'Image Only',
    validation: {
      formats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
      maxSize: 200 * 1024 * 1024, // 200MB
      recommendedSize: '800x800'
    }
  },
  
  // Rich Media Messages
  TEXT_IMAGE_BUTTON: {
    code: 208,
    type: 'promotional',
    label: 'Text + Image + Button',
    validation: {
      text: {
        maxLength: 1000,
        required: true
      },
      image: {
        formats: ['.jpg', '.jpeg', '.png'],
        maxSize: 200 * 1024 * 1024
      },
      button: {
        captionMaxLength: 30,
        requiresAction: true
      }
    }
  },

  // Video Messages
  VIDEO: {
    code: 233,
    type: 'promotional',
    label: 'Video + Text + Action Button',
    validation: {
      formats: ['.mp4', '.m4v', '.mov'],
      maxSize: 200 * 1024 * 1024,
      maxDuration: 600, // seconds
      requiresThumbnail: true
    }
  },

  // File Messages
  FILE: {
    code: 220,
    type: 'transactional',
    label: 'File Transfer',
    validation: {
      formats: [
        // Documents
        '.doc', '.docx', '.rtf', '.dot', '.dotx', '.odt', '.odf', '.fodt', '.txt', '.info',
        // PDFs
        '.pdf', '.xps', '.pdax', '.eps',
        // Spreadsheets
        '.xls', '.xlsx', '.ods', '.fods', '.csv', '.xlsm', '.xltx'
      ],
      maxSize: 200 * 1024 * 1024,
      fileNameMaxLength: 25
    }
  }
};

export class MessageTypeValidator {
  static validateMessage(message, type) {
    const typeConfig = MessageTypes[type];
    if (!typeConfig) throw new Error(`Unsupported message type: ${type}`);

    const errors = [];

    // Text validation
    if (message.text && typeConfig.validation.maxLength) {
      if (message.text.length > typeConfig.validation.maxLength) {
        errors.push(`Text exceeds maximum length of ${typeConfig.validation.maxLength} characters`);
      }
    }

    // File validation
    if (message.file) {
      if (!typeConfig.validation.formats.some(format => 
        message.file.name.toLowerCase().endsWith(format.toLowerCase()))) {
        errors.push('Unsupported file format');
      }

      if (message.file.size > typeConfig.validation.maxSize) {
        errors.push(`File size exceeds maximum of ${typeConfig.validation.maxSize / (1024 * 1024)}MB`);
      }
    }

    // Button validation
    if (message.button && typeConfig.validation.button) {
      if (message.button.caption.length > typeConfig.validation.button.captionMaxLength) {
        errors.push(`Button caption exceeds maximum length of ${typeConfig.validation.button.captionMaxLength} characters`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 