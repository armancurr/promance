import type { PromptAnalysis } from "../../types";
import { VAGUE_INDICATORS } from "../../types";

export class PromptAnalyzer {
  private static readonly MIN_LENGTH = 10;

  static analyze(prompt: string): PromptAnalysis {
    const normalizedPrompt = prompt.toLowerCase().trim();

    if (!prompt || prompt.length < this.MIN_LENGTH) {
      return this.createEmptyAnalysis();
    }

    const clarity = this.calculateClarity(normalizedPrompt);
    const specificity = this.calculateSpecificity(normalizedPrompt);
    const structure = this.calculateStructure(normalizedPrompt);
    const completeness = this.calculateCompleteness(normalizedPrompt);
    const isVague = this.detectVagueness(normalizedPrompt);
    const missingElements = this.identifyMissingElements(normalizedPrompt);
    const suggestions = this.generateSuggestions(normalizedPrompt, {
      clarity,
      specificity,
      structure,
      completeness,
    });

    const overallScore = (clarity + specificity + structure + completeness) / 4;

    return {
      clarity,
      specificity,
      structure,
      completeness,
      isVague,
      missingElements,
      suggestions,
      overallScore: Math.round(overallScore * 10) / 10,
    };
  }

  private static calculateClarity(prompt: string): number {
    let score = 5;

    const clarityIndicators = [
      "specific",
      "exactly",
      "precisely",
      "clearly",
      "detailed",
    ];

    const ambiguousTerms = ["thing", "stuff", "something", "somehow", "maybe"];

    clarityIndicators.forEach((indicator) => {
      if (prompt.includes(indicator)) score += 0.5;
    });

    ambiguousTerms.forEach((term) => {
      if (prompt.includes(term)) score -= 1;
    });

    if (prompt.length < 50) score -= 1;

    return Math.max(1, Math.min(10, score));
  }

  private static calculateSpecificity(prompt: string): number {
    let score = 5;

    const specificTerms = [
      "api",
      "database",
      "frontend",
      "backend",
      "react",
      "typescript",
    ];

    specificTerms.forEach((term) => {
      if (prompt.includes(term)) score += 0.5;
    });

    const hasNumbers = /\d+/.test(prompt);
    if (hasNumbers) score += 1;

    return Math.max(1, Math.min(10, score));
  }

  private static calculateStructure(prompt: string): number {
    let score = 5;

    if (prompt.includes("\n")) score += 1;
    if (prompt.includes("1.") || prompt.includes("-")) score += 1;

    const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length > 1) score += 0.5;

    return Math.max(1, Math.min(10, score));
  }

  private static calculateCompleteness(prompt: string): number {
    let score = 3;

    const essentialKeywords = [
      "context",
      "goal",
      "constraint",
      "format",
      "audience",
    ];

    essentialKeywords.forEach((keyword) => {
      if (prompt.includes(keyword)) score += 1.4;
    });

    return Math.max(1, Math.min(10, score));
  }

  private static detectVagueness(prompt: string): boolean {
    const hasVagueIndicator = VAGUE_INDICATORS.some((indicator) =>
      prompt.includes(indicator.toLowerCase()),
    );

    const isTooShort = prompt.length < 30;

    return hasVagueIndicator || isTooShort;
  }

  private static identifyMissingElements(prompt: string): string[] {
    const missing: string[] = [];

    const checks = [
      { keywords: ["context", "background"], element: "Context information" },
      {
        keywords: ["constraint", "requirement"],
        element: "Specific requirements",
      },
      { keywords: ["format", "output"], element: "Output format" },
      { keywords: ["audience", "user"], element: "Target audience" },
    ];

    checks.forEach((check) => {
      const hasKeywords = check.keywords.some((keyword) =>
        prompt.includes(keyword),
      );
      if (!hasKeywords) {
        missing.push(check.element);
      }
    });

    return missing;
  }

  private static generateSuggestions(
    prompt: string,
    scores: {
      clarity: number;
      specificity: number;
      structure: number;
      completeness: number;
    },
  ): string[] {
    const suggestions: string[] = [];

    if (scores.clarity < 6) {
      suggestions.push("Use more specific and precise language");
    }

    if (scores.specificity < 6) {
      suggestions.push("Add technical details and specific requirements");
    }

    if (scores.structure < 6) {
      suggestions.push("Organize your prompt with clear sections");
    }

    if (scores.completeness < 6) {
      suggestions.push("Add context and define requirements clearly");
    }

    if (prompt.length < 50) {
      suggestions.push("Expand your prompt with more details");
    }

    return suggestions;
  }

  private static createEmptyAnalysis(): PromptAnalysis {
    return {
      clarity: 1,
      specificity: 1,
      structure: 1,
      completeness: 1,
      isVague: true,
      missingElements: ["Content", "Context", "Requirements"],
      suggestions: ["Please enter a prompt to analyze"],
      overallScore: 1,
    };
  }
}
