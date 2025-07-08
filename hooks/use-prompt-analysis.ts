import { useEffect, useCallback } from "react";
import { useAppStore } from "../stores/app-store";
import { PromptAnalyzer } from "../src/lib/prompt-analyzer";
import { InputSanitizer } from "../src/lib/sanitizer";

export function usePromptAnalysis() {
  const { originalPrompt, analysis, isAnalyzing, setAnalysis, setIsAnalyzing } =
    useAppStore();

  const analyzePrompt = useCallback(
    async (prompt: string) => {
      if (!prompt || prompt.trim().length === 0) {
        setAnalysis(null);
        return;
      }

      setIsAnalyzing(true);

      try {
        const sanitizedPrompt = InputSanitizer.sanitizePrompt(prompt);

        // Simulate async analysis (in case we want to add debouncing)
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Analyze the prompt
        const result = PromptAnalyzer.analyze(sanitizedPrompt);

        setAnalysis(result);
      } catch (error) {
        console.error("Analysis error:", error);
        setAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setAnalysis, setIsAnalyzing],
  );

  // Auto-analyze when the prompt changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzePrompt(originalPrompt);
    }, 300); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [originalPrompt, analyzePrompt]);

  return {
    analysis,
    isAnalyzing,
    analyzePrompt,
  };
}
