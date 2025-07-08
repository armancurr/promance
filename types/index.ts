export interface PromptAnalysis {
  clarity: number;
  specificity: number;
  structure: number;
  completeness: number;
  isVague: boolean;
  missingElements: string[];
  suggestions: string[];
  overallScore: number;
}

export interface EnhancementRequest {
  originalPrompt: string;
  analysis: PromptAnalysis;
  userContext?: string;
}

export interface EnhancementResponse {
  enhancedPrompt: string;
  improvements: string[];
  reasoning: string;
  timestamp: number;
}

export interface AppState {
  originalPrompt: string;
  setOriginalPrompt: (prompt: string) => void;

  analysis: PromptAnalysis | null;
  isAnalyzing: boolean;
  setAnalysis: (analysis: PromptAnalysis | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;

  enhancedPrompt: string;
  isEnhancing: boolean;
  enhancementHistory: EnhancementResponse[];
  setEnhancedPrompt: (prompt: string) => void;
  setIsEnhancing: (enhancing: boolean) => void;
  addEnhancementToHistory: (enhancement: EnhancementResponse) => void;

  isSidePanelOpen: boolean;
  toggleSidePanel: () => void;

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

export interface AnalysisPanelProps {
  analysis: PromptAnalysis | null;
  isLoading: boolean;
}

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onChange: (content: string) => void;
}

export interface EnhancementButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const VAGUE_INDICATORS = [
  "create a landing page",
  "make something",
  "build an app",
  "design a website",
  "help me with",
  "write a script",
  "make a program",
  "develop something",
  "build a system",
  "create content",
  "generate text",
  "write code",
  "make a tool",
  "design something",
  "create a solution",
] as const;

export type VagueIndicator = (typeof VAGUE_INDICATORS)[number];

export interface PromptError extends Error {
  code: "RATE_LIMIT" | "API_ERROR" | "VALIDATION_ERROR" | "NETWORK_ERROR";
  details?: Record<string, unknown>;
}
