import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, PromptAnalysis, EnhancementResponse } from "../types";

interface AppStore extends AppState {}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      originalPrompt: "",
      setOriginalPrompt: (prompt: string) => set({ originalPrompt: prompt }),

      analysis: null,
      isAnalyzing: false,
      setAnalysis: (analysis: PromptAnalysis | null) => set({ analysis }),
      setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),

      enhancedPrompt: "",
      isEnhancing: false,
      hasEnhanced: false,
      enhancementHistory: [],
      setEnhancedPrompt: (prompt: string) => set({ enhancedPrompt: prompt }),
      setIsEnhancing: (enhancing: boolean) => set({ isEnhancing: enhancing }),
      setHasEnhanced: (enhanced: boolean) => set({ hasEnhanced: enhanced }),
      addEnhancementToHistory: (enhancement: EnhancementResponse) =>
        set((state) => ({
          enhancementHistory: [
            enhancement,
            ...state.enhancementHistory.slice(0, 9),
          ],
        })),

      isModalOpen: false,
      setIsModalOpen: (open: boolean) => set({ isModalOpen: open }),
      toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),

      apiKey: "",
      setApiKey: (key: string) => set({ apiKey: key }),
    }),
    {
      name: "prompt-optimizer-storage",
      partialize: (state) => ({
        enhancementHistory: state.enhancementHistory,
        apiKey: state.apiKey,
        enhancedPrompt: state.enhancedPrompt,
      }),
      skipHydration: false,
    },
  ),
);
