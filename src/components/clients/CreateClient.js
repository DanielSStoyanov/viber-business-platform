import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email address'),
  tags: Yup.array().of(Yup.string()),
});

const CreateClient = ({ open, onClose, onSave, availableTags, customFields = [] }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      tags: [],
      ...Object.fromEntries(customFields.map(field => [field.key, ''])),
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Client</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                placeholder="+1234567890"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={availableTags}
                value={formik.values.tags}
                onChange={(_, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color={option === 'VIP' ? 'primary' : 'default'}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Select tags" />
                )}
              />
            </Grid>
            {customFields.map(field => (
              <Grid item xs={12} key={field.key}>
                {field.type === 'select' ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.name}</InputLabel>
                    <Select
                      name={field.key}
                      value={formik.values[field.key]}
                      label={field.name}
                      onChange={formik.handleChange}
                    >
                      {field.options.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    name={field.key}
                    label={field.name}
                    type={field.type}
                    value={formik.values[field.key]}
                    onChange={formik.handleChange}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Client
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClient; 