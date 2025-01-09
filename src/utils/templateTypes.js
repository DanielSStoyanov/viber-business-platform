import { useState, useCallback, useEffect } from 'react';

export const TemplateTypes = {
  TRANSACTIONAL: {
    code: 301,
    label: 'Transactional',
    description: 'For service updates and notifications',
    validation: {
      maxLength: 950,
      requiresApproval: true,
      allowedCountries: ['Russia', 'Ukraine', 'Belarus']
    }
  },
  SESSION: {
    code: 303,
    label: 'Session',
    description: 'For active chat sessions',
    validation: {
      maxLength: 1000,
      requiresApproval: false
    }
  },
  CONVERSION: {
    code: 304,
    label: 'Conversion',
    description: 'For marketing and promotional messages',
    validation: {
      maxLength: 1000,
      requiresApproval: true,
      requiresOptIn: true
    }
  }
};

export class TemplateValidator {
  static validateTemplate(template, type) {
    const errors = [];
    const typeConfig = TemplateTypes[type];

    if (!typeConfig) {
      throw new Error(`Invalid template type: ${type}`);
    }

    // Length validation
    if (template.text.length > typeConfig.validation.maxLength) {
      errors.push(`Template exceeds maximum length of ${typeConfig.validation.maxLength} characters`);
    }

    // Variable pattern validation
    const variablePattern = /\{\{[\w\d_]+\}\}/g;
    const variables = template.text.match(variablePattern) || [];
    
    if (variables.length > 10) {
      errors.push('Template cannot have more than 10 variables');
    }

    // Check for invalid characters
    if (/[<>]/.test(template.text)) {
      errors.push('Template cannot contain HTML-like tags');
    }

    // Country-specific validation
    if (typeConfig.validation.allowedCountries && 
        !typeConfig.validation.allowedCountries.includes(template.country)) {
      errors.push(`Template type ${type} is not available in ${template.country}`);
    }

    // Check for required fields
    if (!template.name || template.name.length < 3) {
      errors.push('Template name must be at least 3 characters long');
    }

    if (!template.category) {
      errors.push('Template category is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      variables: variables.map(v => v.replace(/[{}]/g, ''))
    };
  }

  static extractVariables(text) {
    const variablePattern = /\{\{[\w\d_]+\}\}/g;
    return (text.match(variablePattern) || [])
      .map(v => v.replace(/[{}]/g, ''));
  }

  static applyVariables(template, variables) {
    let result = template.text;
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, value);
    });
    return result;
  }
}

// Template Hook
export function useTemplateSystem() {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize with some default templates
  useEffect(() => {
    try {
      // You can replace this with an API call to fetch templates
      const defaultTemplates = [
        {
          id: 'template_1',
          name: 'Welcome Template',
          type: 'transactional',
          text: 'Welcome {{name}} to our service!',
          variables: ['name'],
          category: 'Welcome',
          country: 'Global'
        },
        {
          id: 'template_2',
          name: 'Reminder Template',
          type: 'reminder',
          text: 'Hello {{name}}, this is a reminder for {{event}}',
          variables: ['name', 'event'],
          category: 'Reminder',
          country: 'Global'
        }
      ];
      setTemplates(defaultTemplates);
    } catch (err) {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (template, type) => {
    try {
      setError(null);
      const validation = TemplateValidator.validateTemplate(template, type);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const newTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        type,
        variables: validation.variables,
        createdAt: new Date().toISOString(),
        status: TemplateTypes[type].validation.requiresApproval ? 'pending' : 'active'
      };

      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;

    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const applyTemplate = useCallback((templateId, variables) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    return TemplateValidator.applyVariables(template, variables);
  }, [templates]);

  return {
    templates,
    activeTemplate,
    variables,
    error,
    loading,
    setActiveTemplate,
    setVariables,
    createTemplate,
    applyTemplate,
    getTemplatesByType: useCallback((type) => 
      templates.filter(t => t.type === type), [templates])
  };
} 