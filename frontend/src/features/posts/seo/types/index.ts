export interface SeoInput {
  title: string;
  slug: string;
  content: string;
  focusKeyword: string;
  metaDescription: string;
}

export type SeoResultType = 'success' | 'warning' | 'error';

export interface SeoCheck {
  id: string;
  label: string;
  type: SeoResultType;
  message: string;
  score: number;
}

export interface SeoAnalysis {
  score: number;
  checks: SeoCheck[];
  readability: {
    score: number;
    wordCount: number;
    readingTime: number;
  };
}

export interface SeoAnalyzer {
  analyze(input: SeoInput): SeoCheck[];
}
