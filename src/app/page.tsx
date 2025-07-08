"use client";

import React from "react";
import { PromptInput } from "../components/prompt-input";
import { AnalysisPanel } from "../components/analysis-panel";
import { SidePanel } from "../components/side-panel";
import { useAppStore } from "../../stores/app-store";
import { usePromptAnalysis } from "../../hooks/use-prompt-analysis";

export default function Home() {
  const { isSidePanelOpen } = useAppStore();
  const { analysis, isAnalyzing } = usePromptAnalysis();

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="flex h-screen">
        <div
          className={`transition-all duration-300 ${
            isSidePanelOpen ? "w-1/2" : "w-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto h-full">
                <PromptInput />
              </div>
            </div>
          </div>
        </div>

        {isSidePanelOpen && (
          <div className="w-1/2 border-l border-neutral-900">
            <SidePanel />
          </div>
        )}
      </div>
    </div>
  );
}
