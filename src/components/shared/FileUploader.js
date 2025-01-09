import { Box, Button, Typography } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

export function FileUploader({ type, onFileSelect, validation, thumbnail }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file, type);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        fullWidth
        sx={{ mb: 1 }}
      >
        Upload {type.toLowerCase()}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept={type === 'IMAGE' ? 'image/*' : type === 'VIDEO' ? 'video/*' : undefined}
        />
      </Button>

      {validation.errors.map((error, index) => (
        <Typography key={index} color="error" variant="caption" display="block">
          {error}
        </Typography>
      ))}

      {thumbnail && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={thumbnail}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        </Box>
      )}
    </Box>
  );
} 