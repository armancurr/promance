export interface EnhancementRequest {
  originalPrompt: string;
  userContext?: string;
}

export interface EnhancementResponse {
  enhancedPrompt: string;
  improvements: string[];
  reasoning: string;
  timestamp: number;
}

export interface StreamedEnhancementResponse {
  enhancedPrompt: string;
  improvements: string[];
  reasoning: string;
  timestamp: number;
  isComplete: boolean;
}

export type StreamCallback = (chunk: string, isComplete: boolean) => void;

export interface AppState {
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;

  enhancedPrompt: string;
  isEnhancing: boolean;
  isStreaming: boolean;
  streamedContent: string;
  hasEnhanced: boolean;
  enhancementHistory: EnhancementResponse[];
  setEnhancedPrompt: (prompt: string) => void;
  setIsEnhancing: (enhancing: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setStreamedContent: (content: string) => void;
  appendStreamedContent: (chunk: string) => void;
  setHasEnhanced: (enhanced: boolean) => void;
  addEnhancementToHistory: (enhancement: EnhancementResponse) => void;

  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  toggleModal: () => void;

  apiKey: string;
  setApiKey: (key: string) => void;
}

export interface RateLimitState {
  requests: number[];
  isLimited: boolean;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface EditorSettings {
  theme: "vs-dark" | "vs-light";
  fontSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
}

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  stripIgnoreTag?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface EnhancementButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export interface PromptError extends Error {
  code: "RATE_LIMIT" | "API_ERROR" | "VALIDATION_ERROR" | "NETWORK_ERROR";
  details?: Record<string, unknown>;
}
