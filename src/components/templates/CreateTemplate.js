import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Template name is required'),
  type: Yup.string().required('Template type is required'),
  targetType: Yup.string().required('Target type is required'),
  selectedClients: Yup.array().when('targetType', {
    is: 'specific',
    then: () => Yup.array().min(1, 'Select at least one client'),
    otherwise: () => Yup.array()
  }),
  clientGroup: Yup.string().when('targetType', {
    is: 'group',
    then: () => Yup.string().required('Select a client group'),
    otherwise: () => Yup.string()
  }),
  numberList: Yup.array().when('targetType', {
    is: 'custom',
    then: () => Yup.array().min(1, 'Add at least one number'),
    otherwise: () => Yup.array()
  }),
  messageTemplate: Yup.string().required('Message template is required'),
  scheduledDate: Yup.date().nullable().min(new Date(), 'Schedule date must be in the future')
}, [['selectedClients', 'targetType'], ['clientGroup', 'targetType'], ['numberList', 'targetType']]);

const PLACEHOLDERS = [
  { key: '<name>', description: 'Customer Name' },
  { key: '<policy_number>', description: 'Policy Number' },
  { key: '<date>', description: 'Date' },
  { key: '<amount>', description: 'Amount' },
];

const CreateTemplate = ({ open, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      messageType: 'text',
      content: '',
      caption: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const templateData = {
          ...values,
          file: file,
          createdAt: new Date().toISOString(),
        };
        onSave(templateData);
        formik.resetForm();
        setFile(null);
        setPreviewUrl(null);
        onClose();
      } catch (error) {
        console.error('Error saving template:', error);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertPlaceholder = (placeholder) => {
    const currentContent = formik.values.content;
    const cursorPosition = document.getElementById('content').selectionStart;
    const newContent =
      currentContent.slice(0, cursorPosition) +
      placeholder +
      currentContent.slice(cursorPosition);
    formik.setFieldValue('content', newContent);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Template</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Message Type</InputLabel>
                <Select
                  name="messageType"
                  value={formik.values.messageType}
                  onChange={formik.handleChange}
                  label="Message Type"
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formik.values.messageType === 'text' && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Placeholders:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {PLACEHOLDERS.map((placeholder) => (
                        <Chip
                          key={placeholder.key}
                          label={placeholder.key}
                          onClick={() => insertPlaceholder(placeholder.key)}
                          variant="outlined"
                          size="small"
                          title={placeholder.description}
                        />
                      ))}
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Template Content"
                    name="content"
                    id="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    error={formik.touched.content && Boolean(formik.errors.content)}
                    helperText={formik.touched.content && formik.errors.content}
                  />
                </Grid>
              </>
            )}

            {formik.values.messageType !== 'text' && (
              <>
                <Grid item xs={12}>
                  <Button variant="contained" component="label">
                    Upload {formik.values.messageType}
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept={
                        formik.values.messageType === 'image'
                          ? 'image/*'
                          : formik.values.messageType === 'video'
                          ? 'video/*'
                          : '*'
                      }
                    />
                  </Button>
                  {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {file.name}
                    </Typography>
                  )}
                  {previewUrl && formik.values.messageType === 'image' && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Caption"
                    name="caption"
                    value={formik.values.caption}
                    onChange={formik.handleChange}
                    error={formik.touched.caption && Boolean(formik.errors.caption)}
                    helperText={formik.touched.caption && formik.errors.caption}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Template
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTemplate; 