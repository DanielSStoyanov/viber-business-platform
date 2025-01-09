import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import Papa from 'papaparse'; // You'll need to install papaparse: npm install papaparse

const ImportExportClients = ({ open, onClose, onImport, clients }) => {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImporting(true);
      setError(null);
      setSuccess(false);

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const validatedClients = results.data
              .filter(row => row.name && row.phone) // Filter out incomplete rows
              .map(row => ({
                name: row.name.trim(),
                phone: row.phone.trim(),
                email: row.email?.trim() || '',
                tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
                businessName: row.businessName?.trim() || '',
              }));

            if (validatedClients.length === 0) {
              throw new Error('No valid clients found in the CSV file');
            }

            onImport(validatedClients);
            setSuccess(true);
          } catch (err) {
            setError(err.message);
          } finally {
            setImporting(false);
          }
        },
        error: (error) => {
          setError('Error parsing CSV file: ' + error.message);
          setImporting(false);
        }
      });
    }
  };

  const handleExport = () => {
    const csv = Papa.unparse(clients.map(client => ({
      name: client.name,
      phone: Array.isArray(client.phoneNumbers) ? client.phoneNumbers.join(';') : client.phone,
      email: client.email || '',
      tags: client.tags?.join(',') || '',
      businessName: client.businessName || '',
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import/Export Clients</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Import Clients
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Upload a CSV file with the following columns: name, phone, email (optional),
            tags (optional, comma-separated), businessName (optional)
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={importing}
          >
            Upload CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileUpload}
            />
          </Button>
          {importing && <LinearProgress sx={{ mt: 2 }} />}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Clients imported successfully!
            </Alert>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Export Clients
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Download all clients as a CSV file
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportExportClients; 