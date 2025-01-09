import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

const TemplatePreview = ({ open, onClose, template, previewData }) => {
  if (!template) {
    return null;
  }

  const replacePlaceholders = (content, data) => {
    if (!content) return '';
    return content.replace(/<([^>]+)>/g, (match, placeholder) => {
      return data[placeholder] || match;
    });
  };

  const renderContent = () => {
    const renderedContent = replacePlaceholders(template.content, previewData);

    switch (template.messageType) {
      case 'image':
        return (
          <Card>
            {template.file && (
              <CardMedia
                component="img"
                height="200"
                image={typeof template.file === 'object' ? URL.createObjectURL(template.file) : template.file}
                alt={template.name}
              />
            )}
            <CardContent>
              <Typography variant="body1">{renderedContent}</Typography>
              {template.caption && (
                <Typography variant="caption" color="textSecondary">
                  {template.caption}
                </Typography>
              )}
            </CardContent>
          </Card>
        );

      case 'video':
        return (
          <Card>
            {template.file && (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <video
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  controls
                >
                  <source src={typeof template.file === 'object' ? URL.createObjectURL(template.file) : template.file} />
                </video>
              </Box>
            )}
            <CardContent>
              <Typography variant="body1">{renderedContent}</Typography>
              {template.caption && (
                <Typography variant="caption" color="textSecondary">
                  {template.caption}
                </Typography>
              )}
            </CardContent>
          </Card>
        );

      case 'file':
        return (
          <Card>
            <CardContent>
              <Typography variant="body1">{renderedContent}</Typography>
              {template.file && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Attached file: {typeof template.file === 'object' ? template.file.name : template.file}
                  </Typography>
                </Box>
              )}
              {template.caption && (
                <Typography variant="caption" color="textSecondary">
                  {template.caption}
                </Typography>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <Typography variant="body1" whiteSpace="pre-wrap">
            {renderedContent}
          </Typography>
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Template Preview</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Preview with sample data
          </Typography>
        </Box>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplatePreview; 