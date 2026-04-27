export function formatAnswersForPrompt(answers: Record<string, string | string[]>): string {
  const lines = Object.entries(answers).map(([key, value]) => {
    const label = key.replace(/_/g, ' ');
    const val   = Array.isArray(value) ? value.join(', ') : value;
    return `${label}: ${val}`;
  });
  return `Generate the document using these details:\n\n${lines.join('\n')}`;
}
