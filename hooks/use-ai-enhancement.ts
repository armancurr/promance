import { useCallback, useState } from "react";
import { useAppStore } from "../stores/app-store";
import { AIEnhancer } from "../src/lib/ai-enhancer";
import { InputSanitizer } from "../src/lib/sanitizer";

export function useAIEnhancement() {
  const {
    originalPrompt,
    enhancedPrompt,
    isEnhancing,
    isStreaming,
    streamedContent,
    apiKey,
    setEnhancedPrompt,
    setIsEnhancing,
    setIsStreaming,
    setStreamedContent,
    appendStreamedContent,
    setHasEnhanced,
    addEnhancementToHistory,
    setIsModalOpen,
    isModalOpen,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);

  const enhancePrompt = useCallback(
    async (userContext?: string) => {
      if (!originalPrompt) {
        setError("No prompt available");
        return false;
      }

      if (!apiKey) {
        setError("API key is required. Please set your Gemini API key.");
        return false;
      }

      setIsEnhancing(true);
      setIsStreaming(true);
      setStreamedContent("");
      setError(null);

      // Open modal immediately when starting enhancement
      if (!isModalOpen) {
        setIsModalOpen(true);
      }

      try {
        AIEnhancer.initialize(apiKey);

        const sanitizedPrompt = InputSanitizer.sanitizePrompt(originalPrompt);
        const sanitizedContext = userContext
          ? InputSanitizer.sanitizeText(userContext)
          : undefined;

        let fullStreamedContent = "";

        const enhancement = await AIEnhancer.enhanceWithStreaming(
          {
            originalPrompt: sanitizedPrompt,
            userContext: sanitizedContext,
          },
          (chunk: string, isComplete: boolean) => {
            if (isComplete) {
              setIsStreaming(false);
              // Parse the final content to extract the enhanced prompt
              try {
                const jsonMatch = fullStreamedContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  if (parsed.enhancedPrompt) {
                    setEnhancedPrompt(parsed.enhancedPrompt);
                  }
                }
              } catch (parseError) {
                console.warn("Failed to parse streamed content:", parseError);
              }
            } else {
              fullStreamedContent += chunk;
              appendStreamedContent(chunk);
            }
          },
        );

        addEnhancementToHistory(enhancement);
        setHasEnhanced(true);
        setEnhancedPrompt(enhancement.enhancedPrompt);

        return true;
      } catch (error) {
        console.error("Enhancement error:", error);
        setError("Enhancement failed. Please try again.");
        return false;
      } finally {
        setIsEnhancing(false);
        setIsStreaming(false);
      }
    },
    [
      originalPrompt,
      apiKey,
      streamedContent,
      setEnhancedPrompt,
      setIsEnhancing,
      setIsStreaming,
      setStreamedContent,
      appendStreamedContent,
      setHasEnhanced,
      addEnhancementToHistory,
      setIsModalOpen,
      isModalOpen,
    ],
  );

  return {
    enhancePrompt,
    isEnhancing,
    isStreaming,
    streamedContent,
    error,
    enhancedPrompt,
  };
}
