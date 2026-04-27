import { describe, it, expect, beforeEach } from 'vitest';
import { useWizardStore } from '../stores/wizardStore';

describe('wizardStore', () => {
  beforeEach(() => {
    const { reset } = useWizardStore.getState();
    reset();
  });

  it('should initialize with default values', () => {
    const state = useWizardStore.getState();
    expect(state.track).toBeNull();
    expect(state.docType).toBeNull();
    expect(state.jurisdiction).toBeNull();
    expect(state.answers).toEqual({});
    expect(state.currentStep).toBe(0);
  });

  it('should update track and docType', () => {
    const { setTrack, setDocType } = useWizardStore.getState();
    
    setTrack('freelancer');
    expect(useWizardStore.getState().track).toBe('freelancer');
    
    setDocType('service-agreement');
    expect(useWizardStore.getState().docType).toBe('service-agreement');
  });

  it('should update answers correctly', () => {
    const { setAnswer } = useWizardStore.getState();
    
    setAnswer('provider_name', 'John Doe');
    expect(useWizardStore.getState().answers['provider_name']).toBe('John Doe');
    
    setAnswer('platforms', ['Instagram', 'TikTok']);
    expect(useWizardStore.getState().answers['platforms']).toEqual(['Instagram', 'TikTok']);
  });

  it('should update jurisdiction and sync step progress', () => {
    const { setJurisdiction, setStep } = useWizardStore.getState();
    
    setJurisdiction('NG');
    expect(useWizardStore.getState().jurisdiction).toBe('NG');
    
    setStep(2);
    expect(useWizardStore.getState().currentStep).toBe(2);
  });

  it('should reset state correctly', () => {
    const { setTrack, reset } = useWizardStore.getState();
    setTrack('startup');
    reset();
    expect(useWizardStore.getState().track).toBeNull();
  });
});
