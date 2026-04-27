import { renderToBuffer } from '@react-pdf/renderer';
import { ClauseGuardPDF } from '@/lib/ai/pdf';
import { formatDate } from '@/lib/utils';

interface ExportToPDFOptions {
  title: string;
  jurisdiction: string;
  docType: string;
  content: string;
  signature?: string;
  signedAt?: string;
}

export async function exportToPDF(options: ExportToPDFOptions): Promise<Buffer> {
  const docTypeLabel = options.docType.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  const pdf = ClauseGuardPDF({
    title: options.title,
    jurisdiction: options.jurisdiction,
    docType: docTypeLabel,
    generatedDate: formatDate(new Date()),
    content: options.content,
    signatureBase64: options.signature ?? undefined,
    signedDate: options.signedAt ? formatDate(options.signedAt) : undefined,
  });

  const buffer = await renderToBuffer(pdf);
  return buffer;
}

export function getPDFFileName(docTitle: string): string {
  return `${docTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.pdf`;
}
