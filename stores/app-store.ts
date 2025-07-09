import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, EnhancementResponse } from "../types";

interface AppStore extends AppState {}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      originalPrompt: "",
      setOriginalPrompt: (prompt: string) => set({ originalPrompt: prompt }),

      enhancedPrompt: "",
      isEnhancing: false,
      isStreaming: false,
      streamedContent: "",
      hasEnhanced: false,
      enhancementHistory: [],
      setEnhancedPrompt: (prompt: string) => set({ enhancedPrompt: prompt }),
      setIsEnhancing: (enhancing: boolean) => set({ isEnhancing: enhancing }),
      setIsStreaming: (streaming: boolean) => set({ isStreaming: streaming }),
      setStreamedContent: (content: string) =>
        set({ streamedContent: content }),
      appendStreamedContent: (chunk: string) =>
        set((state) => ({ streamedContent: state.streamedContent + chunk })),
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
