import { z } from 'zod';

export const generateRequestSchema = z.object({
  documentId:   z.string().uuid(),
  docType:      z.string().min(1),
  jurisdiction: z.enum(['NG', 'KE', 'GH', 'ZA']),
  answers:      z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export const signRequestSchema = z.object({
  documentId: z.string().uuid(),
  signature:  z.string().min(1),
});

export const createDocumentSchema = z.object({
  track:        z.enum(['freelancer', 'startup', 'creator']),
  docType:      z.string().min(1),
  jurisdiction: z.enum(['NG', 'KE', 'GH', 'ZA']),
  title:        z.string().min(1),
});