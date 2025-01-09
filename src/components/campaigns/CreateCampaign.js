import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box
} from '@mui/material';
import CampaignBasicInfo from './steps/CampaignBasicInfo';
import AudienceSelection from './steps/AudienceSelection';
import TemplateSelection from './steps/TemplateSelection';

const steps = ['Basic Info', 'Select Audience', 'Choose Template'];

export default function CreateCampaign({ open, onClose, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: '',
    audience: {
      type: 'all', // 'all', 'tags', 'individual'
      tags: [],
      selectedClients: [],
    },
    template: null,
    variables: {}
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepUpdate = (data) => {
    setCampaignData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleSubmit = () => {
    onSave(campaignData);
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CampaignBasicInfo 
            data={campaignData} 
            onUpdate={handleStepUpdate} 
          />
        );
      case 1:
        return (
          <AudienceSelection 
            data={campaignData} 
            onUpdate={handleStepUpdate}
          />
        );
      case 2:
        return (
          <TemplateSelection 
            data={campaignData} 
            campaignType={campaignData.type}
            onUpdate={handleStepUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Campaign</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
          >
            Create Campaign
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!campaignData.name || !campaignData.type}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 