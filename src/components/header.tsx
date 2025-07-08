"use client";

import React from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useAppStore } from "../../stores/app-store";
import { InputSanitizer } from "../lib/sanitizer";
import { Key, GithubLogo, Spinner } from "@phosphor-icons/react";

export function Header() {
  const { apiKey, setApiKey } = useAppStore();
  const [tempApiKey, setTempApiKey] = React.useState(apiKey);

  React.useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setTempApiKey(newApiKey);

    if (newApiKey && InputSanitizer.validateApiKey(newApiKey)) {
      setApiKey(newApiKey);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    if (pastedText && InputSanitizer.validateApiKey(pastedText)) {
      setApiKey(pastedText);
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-neutral-200">
          <Spinner className="h-8 w-8 animate-spin [animation-duration:4s]" />

          <span className="text-3xl font-serif">Promance</span>
        </div>

        {/* API Status Button with Hover Card */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              size="sm"
              className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-xs text-neutral-200 border-2 border-neutral-700 rounded-2xl hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 hover:shadow-lg transition-colors duration-300 cursor-pointer"
            >
              <Key className="h-4 w-4" />
              {apiKey ? "API Connected" : "Enter Gemini API"}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-neutral-800 text-neutral-200 rounded-2xl w-80"
            side="bottom"
            align="start"
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-neutral-200">
                  Gemini API Key
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Paste your API key - it will save automatically
                </p>
              </div>
              <input
                type="password"
                value={tempApiKey}
                onChange={handleApiKeyChange}
                onPaste={handlePaste}
                placeholder="Paste your Gemini API key here..."
                className="w-full px-3 py-2 text-sm border-2 border-neutral-700 bg-neutral-900 rounded-lg placeholder:text-neutral-500 text-neutral-200 focus:border-neutral-600 focus:outline-none"
                autoFocus
              />
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* GitHub Button */}
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-xs text-neutral-200 border-2 border-neutral-700 rounded-2xl hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 hover:shadow-lg transition-colors duration-300 cursor-pointer"
        >
          <a
            href="https://github.com/armancurr/promance.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GithubLogo className="h-4 w-4" />
            View Source
          </a>
        </Button>
      </div>
    </header>
  );
}
