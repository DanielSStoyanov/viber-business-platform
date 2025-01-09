import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography
} from '@mui/material';
import CampaignDetails from './steps/CampaignDetails';
import AudienceSelection from './steps/AudienceSelection';
import MessageConfiguration from './steps/MessageConfiguration';
import CampaignScheduling from './steps/CampaignScheduling';
import ReviewAndLaunch from './steps/ReviewAndLaunch';
import { CampaignValidator } from '../../utils/campaignTypes';

const steps = [
  'Campaign Details',
  'Select Audience',
  'Configure Message',
  'Set Schedule',
  'Review & Launch'
];

export default function CreateCampaignWizard({ onClose, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: '',
    description: '',
    audience: [],
    messages: [],
    schedule: null,
    status: 'draft'
  });
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  const handleNext = () => {
    const validation = CampaignValidator.validateCampaign(campaignData);
    setErrors(validation.errors);
    setWarnings(validation.warnings);

    if (validation.isValid) {
      setActiveStep((prev) => prev + 1);
    }
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

  const handleFinish = async () => {
    const validation = CampaignValidator.validateCampaign(campaignData);
    if (validation.isValid) {
      try {
        await onSave(campaignData);
        onClose();
      } catch (error) {
        setErrors([error.message]);
      }
    } else {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CampaignDetails data={campaignData} onUpdate={handleStepUpdate} />;
      case 1:
        return <AudienceSelection data={campaignData} onUpdate={handleStepUpdate} />;
      case 2:
        return <MessageConfiguration data={campaignData} onUpdate={handleStepUpdate} />;
      case 3:
        return <CampaignScheduling data={campaignData} onUpdate={handleStepUpdate} />;
      case 4:
        return <ReviewAndLaunch data={campaignData} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 2 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Launch Campaign' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 