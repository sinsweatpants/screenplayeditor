export type Suggestion = { text: string; confidence: number };

// Browser-safe placeholder implementation. Replace with an API call when backend is available.
export async function getArabicWordSuggestions(input: string): Promise<Suggestion[]> {
  const token = (input ?? '').trim().split(/\s+/).pop() ?? '';
  if (!token) return [];
  return [{ text: token, confidence: 0.9 }];
}
