import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  IconButton,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImportExport as ImportExportIcon,
} from '@mui/icons-material';
import CreateClient from './CreateClient';
import ImportExportClients from './ImportExportClients';
import TagManager from './TagManager';
import EditClient from './EditClient';
import { loadFromStorage, saveToStorage, initialMockData } from '../../utils/storage';
import CustomFieldsManager from './CustomFieldsManager';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState(['VIP', 'Active', 'New', 'Premium']);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [editClient, setEditClient] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false);

  useEffect(() => {
    const savedClients = loadFromStorage('clients', initialMockData.clients);
    const savedTags = loadFromStorage('availableTags', initialMockData.availableTags);
    const savedCustomFields = loadFromStorage('customFields', []);
    
    setAvailableTags(savedTags);
    setClients(savedClients);
    setCustomFields(savedCustomFields);
    setLoading(false);
    
    saveToStorage('clients', savedClients);
    saveToStorage('availableTags', savedTags);
    saveToStorage('customFields', savedCustomFields);
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      saveToStorage('clients', clients);
    }
  }, [clients]);

  useEffect(() => {
    if (availableTags.length > 0) {
      saveToStorage('availableTags', availableTags);
    }
  }, [availableTags]);

  useEffect(() => {
    if (customFields.length > 0) {
      saveToStorage('customFields', customFields);
    }
  }, [customFields]);

  const customFieldColumns = customFields.map(field => ({
    field: field.key,
    headerName: field.name,
    width: 150,
    renderCell: (params) => {
      const value = params.value;
      if (field.type === 'date') {
        return new Date(value).toLocaleDateString();
      }
      return value;
    }
  }));

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                backgroundColor: tag === 'VIP' ? '#7360F2' : '#4CAF50',
                color: '#fff',
                height: '24px',
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'lastMessageDate',
      headerName: 'Last Message',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { field: 'totalMessages', headerName: 'Total Messages', width: 150 },
    ...customFieldColumns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Client">
            <IconButton 
              size="small"
              onClick={() => setEditClient(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Client">
            <IconButton
              size="small"
              onClick={() => handleDeleteClient(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleCreateClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: clients.length + 1,
      lastMessageDate: new Date().toISOString(),
      totalMessages: 0,
    };
    setClients([...clients, newClient]);
  };

  const handleDeleteClient = (clientId) => {
    setClients(clients.filter((client) => client.id !== clientId));
  };

  const handleImportClients = (importedClients) => {
    // In a real app, you would send this to your API
    setClients(prevClients => [...prevClients, ...importedClients]);
  };

  const handleUpdateTags = (newTags) => {
    setAvailableTags(newTags);
  };

  const handleAddTagToClients = (tagToAdd) => {
    const updatedClients = clients.map(client => {
      if (selectionModel.includes(client.id)) {
        return {
          ...client,
          tags: [...new Set([...client.tags, tagToAdd])] // Using Set to avoid duplicates
        };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const handleRemoveTagFromClients = (tagToRemove) => {
    const updatedClients = clients.map(client => {
      if (selectionModel.includes(client.id)) {
        return {
          ...client,
          tags: client.tags.filter(tag => tag !== tagToRemove)
        };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectionModel.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#7360F2',
                '&:hover': {
                  backgroundColor: '#5B4AD9',
                },
              }}
              onClick={() => setAddTagOpen(true)}
            >
              Add Tag to Selected ({selectionModel.length})
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => setTagManagerOpen(true)}
          >
            Manage Tags
          </Button>
          <Button
            variant="outlined"
            startIcon={<ImportExportIcon />}
            onClick={() => setImportExportOpen(true)}
          >
            Import/Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateClientOpen(true)}
          >
            Add Client
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCustomFieldsOpen(true)}
          >
            Manage Custom Fields
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search clients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredClients}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          loading={loading}
          onRowSelectionModelChange={(newSelectionModel) => {
            console.log('Selection changed:', newSelectionModel);
            setSelectionModel(newSelectionModel);
          }}
          rowSelectionModel={selectionModel}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Paper>

      <CreateClient
        open={createClientOpen}
        onClose={() => setCreateClientOpen(false)}
        onSave={handleCreateClient}
        availableTags={availableTags}
        customFields={customFields}
      />

      <ImportExportClients
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        onImport={handleImportClients}
        clients={clients}
      />

      <TagManager
        open={tagManagerOpen}
        onClose={() => setTagManagerOpen(false)}
        existingTags={availableTags}
        onUpdateTags={handleUpdateTags}
      />

      <Dialog
        open={addTagOpen}
        onClose={() => setAddTagOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Manage Tags for Selected Clients</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Available Tags (click to add):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {availableTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => {
                  handleAddTagToClients(tag);
                }}
                color="primary"
                variant="outlined"
                clickable
              />
            ))}
          </Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Current Tags (click to remove):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Array.from(new Set(
              selectionModel
                .map(id => clients.find(c => c.id === id)?.tags || [])
                .flat()
            )).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTagFromClients(tag)}
                color="primary"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTagOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <EditClient
        open={Boolean(editClient)}
        onClose={() => setEditClient(null)}
        client={editClient}
        onSave={(updatedClient) => {
          setClients(clients.map(c => 
            c.id === updatedClient.id ? updatedClient : c
          ));
          setEditClient(null);
        }}
        availableTags={availableTags}
        customFields={customFields}
      />

      <CustomFieldsManager
        open={customFieldsOpen}
        onClose={() => setCustomFieldsOpen(false)}
        customFields={customFields}
        onUpdateFields={setCustomFields}
      />
    </Box>
  );
};

export default Clients; 