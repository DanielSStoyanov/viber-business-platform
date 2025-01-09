import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Template name is required'),
  messageType: Yup.string().required('Message type is required'),
  content: Yup.string().required('Content is required'),
  caption: Yup.string().when('messageType', {
    is: (type) => ['image', 'video', 'file'].includes(type),
    then: () => Yup.string().max(30, 'Caption must be less than 30 characters'),
    otherwise: () => Yup.string().nullable(),
  }),
});

const AVAILABLE_PLACEHOLDERS = ['name', 'phone', 'email', 'tags'];

const EditTemplate = ({ open, onClose, onSave, template }) => {
  const formik = useFormik({
    initialValues: {
      name: template?.name || '',
      messageType: template?.messageType || 'text',
      content: template?.content || '',
      caption: template?.caption || '',
      file: template?.file || null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave({ ...template, ...values });
      formik.resetForm();
      onClose();
    },
  });

  const insertPlaceholder = (placeholder) => {
    const currentContent = formik.values.content;
    formik.setFieldValue('content', `${currentContent}<${placeholder}>`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Template</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Template Name"
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
                  label="Message Type"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {['image', 'video', 'file'].includes(formik.values.messageType) && (
              <>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                  >
                    Upload {formik.values.messageType}
                    <input
                      type="file"
                      hidden
                      accept={
                        formik.values.messageType === 'image' ? 'image/*' :
                        formik.values.messageType === 'video' ? 'video/*' :
                        '*'
                      }
                      onChange={(event) => {
                        formik.setFieldValue('file', event.currentTarget.files[0]);
                      }}
                    />
                  </Button>
                  {formik.values.file && (
                    <Typography variant="caption">
                      Selected file: {formik.values.file.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="caption"
                    label="Caption"
                    value={formik.values.caption}
                    onChange={formik.handleChange}
                    error={formik.touched.caption && Boolean(formik.errors.caption)}
                    helperText={formik.touched.caption && formik.errors.caption}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Available Placeholders
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
                  <Chip
                    key={placeholder}
                    label={`<${placeholder}>`}
                    onClick={() => insertPlaceholder(placeholder)}
                    color="primary"
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="content"
                label="Template Content"
                value={formik.values.content}
                onChange={formik.handleChange}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTemplate; 