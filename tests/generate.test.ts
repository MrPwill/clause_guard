import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '@/lib/ai/prompts/system';
import { formatAnswersForPrompt } from '@/lib/ai/prompts/formatter';

describe('AI Prompt System', () => {
  describe('buildSystemPrompt', () => {
    it('includes Nigeria and NDPR for NG jurisdiction', () => {
      const prompt = buildSystemPrompt('NG', 'service-agreement');
      expect(prompt).toContain('Nigeria');
      expect(prompt).toContain('NDPR');
      expect(prompt).toContain('CAMA');
    });

    it('includes South Africa and POPIA for ZA jurisdiction', () => {
      const prompt = buildSystemPrompt('ZA', 'privacy-policy');
      expect(prompt).toContain('South Africa');
      expect(prompt).toContain('POPIA');
    });

    it('includes Kenya for KE jurisdiction', () => {
      const prompt = buildSystemPrompt('KE', 'employment-contract');
      expect(prompt).toContain('Kenya');
      expect(prompt).toContain('Data Protection Act 2019');
    });

    it('replaces hyphens in docType', () => {
      const prompt = buildSystemPrompt('GH', 'service-agreement');
      expect(prompt).toContain('service agreement');
    });
  });

  describe('formatAnswersForPrompt', () => {
    it('correctly handles string values', () => {
      const answers = { full_name: 'John Doe', city: 'Lagos' };
      const formatted = formatAnswersForPrompt(answers);
      expect(formatted).toContain('full name: John Doe');
      expect(formatted).toContain('city: Lagos');
    });

    it('correctly handles string array values', () => {
      const answers = { platforms: ['TikTok', 'Instagram'], duration: '3 months' };
      const formatted = formatAnswersForPrompt(answers);
      expect(formatted).toContain('platforms: TikTok, Instagram');
      expect(formatted).toContain('duration: 3 months');
    });
  });
});
