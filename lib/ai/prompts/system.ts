import { JURISDICTION_META } from '@/lib/schemas/jurisdiction';
import type { Jurisdiction, DocType } from '@/types/document';

export function buildSystemPrompt(jurisdiction: Jurisdiction, docType: DocType): string {
  const meta = JURISDICTION_META[jurisdiction];
  return `You are a legal document drafting assistant specialising in ${meta.fullName} law.

Generate a complete, professional legal document of type: ${docType.replace(/-/g, ' ')}.

JURISDICTION: ${jurisdiction} — ${meta.fullName}
GOVERNING LAW: ${meta.governingLaw}
DATA LAW: ${meta.dataLaw}
COMPANY LAW: ${meta.companyLaw}

RULES:
- Use plain English throughout. No Latin phrases unless legally required.
- Structure: Title → Parties → Background/Recitals → Numbered Clauses → Signature Block
- Clause numbers must be sequential (1, 1.1, 1.2, 2, 2.1...)
- Include a governing law clause referencing ${meta.governingLaw}
- Use exact values from user answers — no placeholders like [INSERT NAME]
- Output clean Markdown: ## for sections, **bold** for defined terms, numbered lists for clauses
- End with a SIGNATURE BLOCK for both parties
- No commentary, preamble, or post-amble — document text only`;
}
