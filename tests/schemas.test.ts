import { describe, it, expect } from 'vitest';
import { QUESTION_SCHEMAS } from '@/lib/schemas/questions';
import { generateRequestSchema } from '@/lib/schemas/validation';
import { DOC_TYPES } from '@/types/document';

describe('QUESTION_SCHEMAS', () => {
  it('has exactly 18 keys', () => {
    const keys = Object.keys(QUESTION_SCHEMAS);
    expect(keys).toHaveLength(18);
  });

  it('contains all doc types from DOC_TYPES', () => {
    const allDocTypes = [...DOC_TYPES.freelancer, ...DOC_TYPES.startup, ...DOC_TYPES.creator];
    const schemaKeys = Object.keys(QUESTION_SCHEMAS);
    allDocTypes.forEach((type) => {
      expect(schemaKeys).toContain(type);
    });
  });

  it('each question object has required fields', () => {
    Object.values(QUESTION_SCHEMAS).forEach((questions) => {
      expect(Array.isArray(questions)).toBe(true);
      questions.forEach((q) => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('label');
        expect(q).toHaveProperty('type');
        expect(q).toHaveProperty('required');
        expect(typeof q.required).toBe('boolean');
      });
    });
  });
});

describe('generateRequestSchema', () => {
  it('rejects missing documentId', () => {
    const result = generateRequestSchema.safeParse({
      docType: 'service-agreement',
      jurisdiction: 'NG',
      answers: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid jurisdiction', () => {
    const result = generateRequestSchema.safeParse({
      documentId: '550e8400-e29b-41d4-a716-446655440000',
      docType: 'service-agreement',
      jurisdiction: 'US',
      answers: {},
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid request', () => {
    const result = generateRequestSchema.safeParse({
      documentId: '550e8400-e29b-41d4-a716-446655440000',
      docType: 'service-agreement',
      jurisdiction: 'NG',
      answers: { provider_name: 'John' },
    });
    expect(result.success).toBe(true);
  });
});