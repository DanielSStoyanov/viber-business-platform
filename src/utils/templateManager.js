import { useState, useCallback } from 'react';

export class TemplateManager {
  static MAX_TEMPLATE_LENGTH = 950;
  static SUPPORTED_COUNTRIES = ['Russia', 'Ukraine', 'Belarus'];
  
  static validateTemplate(template) {
    const errors = [];

    // Length validation
    if (template.text.length > this.MAX_TEMPLATE_LENGTH) {
      errors.push(`Template exceeds maximum length of ${this.MAX_TEMPLATE_LENGTH} characters`);
    }

    // Start/End validation
    if (template.text.startsWith('/') || template.text.endsWith('/')) {
      errors.push('Template cannot start or end with "/"');
    }

    // Newline validation
    if (template.text.includes('\n')) {
      errors.push('Template cannot contain newlines');
    }

    // Regex validation
    const regexValidation = this.validateRegexSyntax(template.text);
    if (!regexValidation.isValid) {
      errors.push(...regexValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRegexSyntax(text) {
    const errors = [];
    
    // Check for invalid regex flags
    if (/\/[a-z]*$/.test(text)) {
      errors.push('Template cannot contain regex flags');
    }

    // Check for valid variable patterns
    const validPatterns = ['\\d+', '\\w+', '\\S+'];
    const variablePattern = /\\[dws]\+/g;
    const matches = text.match(variablePattern) || [];
    
    matches.forEach(match => {
      if (!validPatterns.includes(match)) {
        errors.push(`Invalid variable pattern: ${match}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static applyTemplate(template, variables) {
    let result = template.text;
    const variablePattern = /\\[dws]\+/g;
    const matches = template.text.match(variablePattern) || [];
    
    matches.forEach((match, index) => {
      if (variables[index] !== undefined) {
        result = result.replace(match, variables[index]);
      }
    });

    return result;
  }
}

// Template Hook
export function useTemplate() {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [variables, setVariables] = useState([]);

  const validateAndSaveTemplate = useCallback(async (template) => {
    const validation = TemplateManager.validateTemplate(template);
    if (validation.isValid) {
      setTemplates(prev => [...prev, template]);
      return true;
    }
    return false;
  }, []);

  const applyTemplateWithVariables = useCallback(() => {
    if (activeTemplate) {
      return TemplateManager.applyTemplate(activeTemplate, variables);
    }
    return '';
  }, [activeTemplate, variables]);

  return {
    templates,
    activeTemplate,
    variables,
    setActiveTemplate,
    setVariables,
    validateAndSaveTemplate,
    applyTemplateWithVariables
  };
} 