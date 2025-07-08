import { useCallback, useState } from "react";
import { useAppStore } from "../stores/app-store";
import { AIEnhancer } from "../src/lib/ai-enhancer";
import { InputSanitizer } from "../src/lib/sanitizer";

export function useAIEnhancement() {
  const {
    originalPrompt,
    analysis,
    enhancedPrompt,
    isEnhancing,
    apiKey,
    setEnhancedPrompt,
    setIsEnhancing,
    setHasEnhanced,
    addEnhancementToHistory,
    setIsModalOpen,
    isModalOpen,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);

  const enhancePrompt = useCallback(
    async (userContext?: string) => {
      if (!originalPrompt || !analysis) {
        setError("No prompt or analysis available");
        return false;
      }

      if (!apiKey) {
        setError("API key is required. Please set your Gemini API key.");
        return false;
      }

      setIsEnhancing(true);
      setError(null);

      try {
        AIEnhancer.initialize(apiKey);

        const sanitizedPrompt = InputSanitizer.sanitizePrompt(originalPrompt);
        const sanitizedContext = userContext
          ? InputSanitizer.sanitizeText(userContext)
          : undefined;

        const enhancement = await AIEnhancer.enhance({
          originalPrompt: sanitizedPrompt,
          analysis,
          userContext: sanitizedContext,
        });

        setEnhancedPrompt(enhancement.enhancedPrompt);
        addEnhancementToHistory(enhancement);
        setHasEnhanced(true);

        if (!isModalOpen) {
          setIsModalOpen(true);
        }

        return true;
      } catch (error) {
        console.error("Enhancement error:", error);
        setError("Enhancement failed. Please try again.");
        return false;
      } finally {
        setIsEnhancing(false);
      }
    },
    [
      originalPrompt,
      analysis,
      apiKey,
      setEnhancedPrompt,
      setIsEnhancing,
      setHasEnhanced,
      addEnhancementToHistory,
      setIsModalOpen,
      isModalOpen,
    ],
  );

  return {
    enhancePrompt,
    isEnhancing,
    error,
    enhancedPrompt,
  };
}
