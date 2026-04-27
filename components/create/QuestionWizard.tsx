'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Wand2, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWizardStore } from '@/stores/wizardStore';
import { QUESTION_SCHEMAS, DOC_TYPE_META } from '@/lib/schemas/questions';
import { JURISDICTION_META } from '@/lib/schemas/jurisdiction';
import { type DocType, type Jurisdiction, type Question } from '@/types/document';
import { toast } from 'sonner';

interface QuestionWizardProps {
  docType: DocType;
  documentId: string;
}

export function QuestionWizard({ docType, documentId }: QuestionWizardProps) {
  const router = useRouter();
  const { 
    answers, 
    setAnswer, 
    jurisdiction, 
    setJurisdiction,
    reset 
  } = useWizardStore();

  const questions = QUESTION_SCHEMAS[docType];
  const meta = DOC_TYPE_META[docType];
  
  // Steps: 0 (Jurisdiction), 1..N (Questions), N+1 (Summary)
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = questions.length + 2; // +1 for Jurisdiction, +1 for Summary
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save progress to Supabase
  const saveProgress = async (updatedAnswers = answers) => {
    try {
      await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: updatedAnswers }),
      });
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !jurisdiction) {
      toast.error('Please select a jurisdiction');
      return;
    }

    if (currentStep > 0 && currentStep <= questions.length) {
      const question = questions[currentStep - 1];
      if (question.required && !answers[question.id]) {
        toast.error(`${question.label} is required`);
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Final save before moving to generation
      await saveProgress();
      router.push(`/documents/${documentId}/generating`);
    } catch (error) {
      toast.error('Failed to start generation. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderJurisdictionStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">Select Jurisdiction</h2>
        <p className="text-gray-500">Which country's laws should govern this document?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.entries(JURISDICTION_META) as [Jurisdiction, any][]).map(([key, j]) => (
          <div
            key={key}
            onClick={() => {
              setJurisdiction(key);
              setAnswer('jurisdiction', key); // Sync with answers for prompt
            }}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all
              ${jurisdiction === key 
                ? 'border-brand-blue bg-brand-blue/5' 
                : 'border-gray-100 hover:border-gray-200'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{j.flag}</span>
              <div>
                <p className="font-bold text-brand-dark">{j.fullName}</p>
                <p className="text-xs text-gray-500 uppercase">{j.currency}</p>
              </div>
              {jurisdiction === key && (
                <div className="ml-auto w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionStep = () => {
    const question = questions[currentStep - 1];
    const value = answers[question.id] || '';

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Question {currentStep} of {questions.length}
          </Label>
          <h2 className="text-2xl font-bold text-brand-dark">{question.label}</h2>
          {question.helpText && <p className="text-gray-500 text-sm">{question.helpText}</p>}
        </div>

        <div className="space-y-4">
          {question.type === 'text' && (
            <Input
              value={value as string}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="text-lg py-6"
            />
          )}

          {question.type === 'textarea' && (
            <Textarea
              value={value as string}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="min-h-[150px] text-lg"
            />
          )}

          {question.type === 'number' && (
            <Input
              type="number"
              value={value as string}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="text-lg py-6"
            />
          )}

          {question.type === 'date' && (
            <Input
              type="date"
              value={value as string}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              className="text-lg py-6"
            />
          )}

          {question.type === 'select' && (
            <Select
              value={value as string}
              onValueChange={(val) => {
                if (val) setAnswer(question.id, val);
              }}
            >
              <SelectTrigger className="w-full text-lg py-6">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {question.type === 'checkbox-group' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((opt) => {
                const currentValues = Array.isArray(value) ? value : [];
                const isChecked = currentValues.includes(opt);
                
                return (
                  <div
                    key={opt}
                    className={`
                      flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors
                      ${isChecked ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:bg-gray-50'}
                    `}
                    onClick={() => {
                      const newValues = isChecked
                        ? currentValues.filter((v) => v !== opt)
                        : [...currentValues, opt];
                      setAnswer(question.id, newValues);
                    }}
                  >
                    <Checkbox checked={isChecked} />
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummaryStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">Review Your Details</h2>
        <p className="text-gray-500">Check your answers before we generate your {meta.label}.</p>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-500 uppercase">Jurisdiction</span>
          <span className="font-bold text-brand-dark">
            {jurisdiction ? JURISDICTION_META[jurisdiction].flag + ' ' + JURISDICTION_META[jurisdiction].fullName : 'Not selected'}
          </span>
        </div>
        
        {questions.map((q) => (
          <div key={q.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <span className="text-sm font-medium text-gray-500">{q.label}</span>
            <span className="font-semibold text-brand-dark text-right">
              {Array.isArray(answers[q.id]) 
                ? (answers[q.id] as string[]).join(', ') 
                : (answers[q.id] || '—')}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-brand-yellow/10 p-4 rounded-lg border border-brand-yellow/20">
        <p className="text-sm text-brand-dark flex gap-2">
          <span>⚠️</span>
          <span>
            By clicking generate, you acknowledge that ClauseGuard provides AI-generated informational documents 
            and is not a law firm.
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <div className="min-h-[400px]">
        {currentStep === 0 && renderJurisdictionStep()}
        {currentStep > 0 && currentStep <= questions.length && renderQuestionStep()}
        {currentStep === totalSteps - 1 && renderSummaryStep()}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
          className="text-gray-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-blue hover:bg-brand-blue/90 px-8 py-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Document
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-brand-dark hover:bg-brand-dark/90 px-8 py-6 text-lg"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
