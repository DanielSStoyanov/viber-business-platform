import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import CreateTemplate from './CreateTemplate';
import EditTemplate from './EditTemplate';
import TemplatePreview from './TemplatePreview';
import { loadFromStorage, saveToStorage, initialMockData } from '../../utils/storage';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewData] = useState({
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    tags: ['VIP', 'Active'],
  });

  useEffect(() => {
    const savedTemplates = loadFromStorage('templates', initialMockData.templates);
    setTemplates(savedTemplates);
  }, []);

  useEffect(() => {
    if (templates.length > 0) {
      saveToStorage('templates', templates);
    }
  }, [templates]);

  const handleSaveTemplate = (templateData) => {
    const newTemplate = {
      ...templateData,
      id: templates.length + 1,
      createdAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleEditTemplate = (templateData) => {
    setTemplates(templates.map(template => 
      template.id === templateData.id ? templateData : template
    ));
    setEditTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter((template) => template.id !== templateId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Message Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateTemplateOpen(true)}
        >
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {template.content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Type: {template.messageType}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Preview Template">
                  <IconButton onClick={() => setPreviewTemplate(template)}>
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Template">
                  <IconButton onClick={() => setEditTemplate(template)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Template">
                  <IconButton onClick={() => handleDeleteTemplate(template.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateTemplate
        open={createTemplateOpen}
        onClose={() => setCreateTemplateOpen(false)}
        onSave={handleSaveTemplate}
      />

      <EditTemplate
        open={Boolean(editTemplate)}
        onClose={() => setEditTemplate(null)}
        onSave={handleEditTemplate}
        template={editTemplate}
      />

      <TemplatePreview
        open={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        previewData={previewData}
      />
    </Box>
  );
};

export default Templates; 