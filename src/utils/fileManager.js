import { useState, useCallback } from 'react';

export class FileManager {
  static SUPPORTED_FORMATS = {
    IMAGE: {
      extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
      maxSize: 200 * 1024 * 1024 // 200MB
    },
    VIDEO: {
      extensions: ['.mp4', '.m4v', '.mov', '.3gp'],
      mimeTypes: ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/3gpp'],
      maxSize: 200 * 1024 * 1024, // 200MB
      maxDuration: 600 // 10 minutes
    },
    DOCUMENT: {
      extensions: [
        '.doc', '.docx', '.pdf', '.xls', '.xlsx', '.txt',
        '.rtf', '.odt', '.ods', '.csv'
      ],
      maxSize: 200 * 1024 * 1024 // 200MB
    }
  };

  static async validateFile(file, type) {
    const format = this.SUPPORTED_FORMATS[type];
    if (!format) throw new Error(`Unsupported file type: ${type}`);

    const errors = [];

    // Size validation
    if (file.size > format.maxSize) {
      errors.push(`File size exceeds maximum of ${format.maxSize / (1024 * 1024)}MB`);
    }

    // Format validation
    const extension = this.getFileExtension(file.name);
    if (!format.extensions.includes(extension.toLowerCase())) {
      errors.push(`Unsupported file format. Supported formats: ${format.extensions.join(', ')}`);
    }

    // Additional video validation
    if (type === 'VIDEO') {
      const duration = await this.getVideoDuration(file);
      if (duration > format.maxDuration) {
        errors.push(`Video duration exceeds maximum of ${format.maxDuration} seconds`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  static async getVideoDuration(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = function() {
        reject(new Error('Error loading video file'));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  static async generateThumbnail(file) {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);
        video.currentTime = 1; // Get thumbnail from 1 second mark

        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
          URL.revokeObjectURL(video.src);
        };

        video.onerror = () => reject("Error generating video thumbnail");
      }
    });
  }
}

export function useFileUpload() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [validation, setValidation] = useState({ isValid: false, errors: [] });
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile, type) => {
    try {
      const validationResult = await FileManager.validateFile(selectedFile, type);
      setValidation(validationResult);

      if (validationResult.isValid) {
        setFile(selectedFile);
        if (['IMAGE', 'VIDEO'].includes(type)) {
          const thumb = await FileManager.generateThumbnail(selectedFile);
          setThumbnail(thumb);
        }
      }
    } catch (error) {
      setValidation({ isValid: false, errors: [error.message] });
    }
  }, []);

  return {
    file,
    thumbnail,
    validation,
    uploading,
    handleFileSelect,
    reset: () => {
      setFile(null);
      setThumbnail(null);
      setValidation({ isValid: false, errors: [] });
      setUploading(false);
    }
  };
} 