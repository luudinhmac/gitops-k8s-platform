'use client';

import { useMemo } from 'react';
import { SeoInput, SeoAnalysis, SeoCheck } from '../types';
import { analyzeKeywords } from '../analyzers/keyword-analysis';
import { analyzeMetadata } from '../analyzers/metadata-analysis';
import { analyzeContent } from '../analyzers/content-analysis';

export function useSeoAnalyzer(input: SeoInput): SeoAnalysis {
  return useMemo(() => {
    const keywordChecks = analyzeKeywords(input);
    const metadataChecks = analyzeMetadata(input);
    const contentChecks = analyzeContent(input);

    const allChecks = [...keywordChecks, ...metadataChecks, ...contentChecks];
    
    // Calculate total score (max base score is sum of all max scores, normalized to 100)
    const currentScore = allChecks.reduce((acc, check) => acc + check.score, 0);
    const maxScore = 100; // Simplified for now, each category has weighted max
    
    // Readability stats
    const cleanContent = input.content.replace(/<[^>]*>/g, ' ');
    const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 wpm

    return {
      score: Math.min(Math.round(currentScore), 100),
      checks: allChecks,
      readability: {
        score: 75, // Placeholder for actual readability scoring
        wordCount,
        readingTime
      }
    };
  }, [input]);
}
