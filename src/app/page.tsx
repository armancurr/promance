"use client";

import React from "react";
// import { motion, AnimatePresence } from "motion/react";
import { PromptInput } from "../components/prompt-input";
// import { AnalysisPanel } from "../components/analysis-panel";
import { EnhancedPromptModal } from "../components/enhanced-prompt-modal";
import { Header } from "../components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-500 via-stone-800 to-stone-950">
      <Header />

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl text-neutral-200 mb-2 font-serif">
              Promance
            </h1>
            <p className="max-w-xl mx-auto text-sm text-neutral-400">
              Just enter your Gemini API key and your prompt, and Promance will
              enhance it for you, make sure to use the enhanced prompt in your
              agent.
            </p>
          </div>

          <PromptInput />

          {/* <AnimatePresence>
            {shouldShowAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="mt-8"
              >
                <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} />
              </motion.div>
            )}
          </AnimatePresence> */}
        </div>
      </div>

      <EnhancedPromptModal />
    </div>
  );
}
