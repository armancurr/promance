"use client";

import React from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useAppStore } from "../../stores/app-store";
import { InputSanitizer } from "../lib/sanitizer";
import { useAIEnhancement } from "../../hooks/use-ai-enhancement";
import { Key, Sparkle, X } from "@phosphor-icons/react";

export function PromptInput() {
  const { originalPrompt, setOriginalPrompt, apiKey, setApiKey, analysis } =
    useAppStore();
  const { enhancePrompt, isEnhancing } = useAIEnhancement();
  const [showApiKeyInput, setShowApiKeyInput] = React.useState(false);
  const [tempApiKey, setTempApiKey] = React.useState(apiKey);

  React.useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  React.useEffect(() => {
    if (
      tempApiKey &&
      tempApiKey !== apiKey &&
      InputSanitizer.validateApiKey(tempApiKey)
    ) {
      const timeoutId = setTimeout(() => {
        setApiKey(tempApiKey);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [tempApiKey, apiKey, setApiKey]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = InputSanitizer.sanitizePrompt(e.target.value);
    setOriginalPrompt(sanitized);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempApiKey(e.target.value);
  };

  const handleEnhanceClick = () => {
    enhancePrompt();
  };

  const canEnhance = originalPrompt && analysis && apiKey && !isEnhancing;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-200">
          Enter your prompt:
        </label>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            size="sm"
            className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-lg hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300"
          >
            <Key className="h-4 w-4" />
            {apiKey ? "API Connected" : "Enter Gemini API"}
          </Button>

          <Button
            onClick={handleEnhanceClick}
            disabled={!canEnhance}
            size="sm"
            className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-lg hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300"
          >
            <Sparkle className="h-4 w-4" />
            {isEnhancing ? "Enhancing..." : "Enhance"}
          </Button>
        </div>
      </div>

      {showApiKeyInput && (
        <div className="p-4 bg-neutral-950 rounded-xl border-2 border-neutral-900 space-y-3">
          <input
            type="password"
            value={tempApiKey}
            onChange={handleApiKeyChange}
            placeholder="Paste your Gemini API key here..."
            className="w-full px-3 py-2 text-sm border-2 border-neutral-900 bg-neutral-950 rounded-lg placeholder:text-neutral-400 text-neutral-200"
          />
        </div>
      )}

      <div className="flex-1">
        <Textarea
          value={originalPrompt}
          onChange={handlePromptChange}
          placeholder="Enter your AI prompt here..."
          className="h-full resize-none text-base p-4 border-2 border-neutral-900 bg-neutral-950 rounded-xl placeholder:text-neutral-400 text-neutral-200 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 focus:outline-none"
          maxLength={5000}
        />
      </div>
    </div>
  );
}
