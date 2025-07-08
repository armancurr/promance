"use client";

import React from "react";
import { motion } from "motion/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAppStore } from "../../stores/app-store";
import { InputSanitizer } from "../lib/sanitizer";
import { useAIEnhancement } from "../../hooks/use-ai-enhancement";
import { Sparkle, Eye } from "@phosphor-icons/react";

export function PromptInput() {
  const {
    originalPrompt,
    setOriginalPrompt,
    apiKey,
    analysis,
    hasEnhanced,
    isModalOpen,
    setIsModalOpen,
  } = useAppStore();
  const { enhancePrompt, isEnhancing } = useAIEnhancement();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.max(
        160,
        Math.min(400, textareaRef.current.scrollHeight),
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [originalPrompt]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = InputSanitizer.sanitizePrompt(e.target.value);
    setOriginalPrompt(sanitized);
  };

  const handleEnhanceClick = () => {
    enhancePrompt();
  };

  const handleReopenClick = () => {
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && canEnhance) {
      e.preventDefault();
      enhancePrompt();
    }
  };

  const canEnhance = originalPrompt && analysis && apiKey && !isEnhancing;
  const canReopen = hasEnhanced && !isModalOpen;

  return (
    <div className="space-y-4">
      <div>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={originalPrompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here..."
            className="min-h-40 resize-none text-md p-6 pb-16 border-2 border-neutral-900 bg-neutral-950 rounded-3xl placeholder:text-neutral-600 text-neutral-200 focus:border-neutral-900 focus:ring-transparent focus:ring-0 focus:ring-offset-0 focus:outline-black/50 scrollbar-hide"
            maxLength={5000}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />

          <motion.div
            className="absolute bottom-4 right-4 flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <Button
              onClick={handleReopenClick}
              disabled={!canReopen}
              size="sm"
              className="text-xs bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-2xl hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="h-4 w-4" />
              View Enhanced
            </Button>

            <Button
              onClick={handleEnhanceClick}
              disabled={!canEnhance}
              size="sm"
              className="text-xs bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-2xl hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkle className="h-4 w-4" />
              {isEnhancing ? "Enhancing..." : "Enhance"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
