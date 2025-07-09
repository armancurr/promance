import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  EnhancementRequest,
  EnhancementResponse,
  PromptError,
  StreamCallback,
} from "../../types";

export class AIEnhancer {
  private static genAI: GoogleGenerativeAI | null = null;

  private static readonly SYSTEM_PROMPT = `
You are a prompt optimization expert. Your task is to analyze and enhance a user's prompt.

**Core Mission:** Refine the user's prompt for clarity, structure, and completeness while **strictly preserving their original intent**.

**CRITICAL RULES:**
1.  **NO FABRICATION:** Absolutely do not invent any details, examples, or context. Your role is to identify and highlight gaps, not fill them with made-up information.
2.  **USE PLACEHOLDERS:** When information is missing, use clear placeholders like \`[Please specify the desired output format]\` or \`[Provide a concrete example of a 'good' result]\`.
3.  **ENHANCE, DON'T REPLACE:** The enhanced prompt must be a structured and clarified version of the user's original request, not a new prompt on a similar topic.

**Enhancement Checklist:**
-   **Clarity:** Is the language ambiguous? Refine it for precision.
-   **Context:** Is background information needed? Add a placeholder for it.
-   **Output Format:** Is the desired output format (e.g., JSON, markdown, list) specified? If not, add a placeholder.
-   **Examples:** Would an example clarify the request? Add a placeholder for one.
-   **Tone & Style:** Is the desired tone (e.g., formal, casual, expert) defined? If not, add a placeholder.
-   **Constraints:** Are there any limitations or boundaries? Add a placeholder if needed.
-   **Success Criteria:** How will the user know the output is good? Add a placeholder for success criteria.

Focus on making the prompt more robust and actionable for an AI, so the user can get a better result by filling in your placeholders.

Please respond with a JSON object in this exact format:
{
  "enhancedPrompt": "The improved prompt text here",
  "improvements": ["List of specific improvements made"],
  "reasoning": "Brief explanation of the enhancement strategy"
}
`;

  static initialize(apiKey: string): void {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  static async enhance(
    request: EnhancementRequest,
  ): Promise<EnhancementResponse> {
    if (!this.genAI) {
      throw this.createError("API_ERROR", "AI service not initialized");
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = this.buildEnhancementPrompt(request);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      return this.parseResponse(responseText, request.originalPrompt);
    } catch (error) {
      console.error("AI Enhancement error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw this.createError("API_ERROR", "Invalid API key");
        }
        if (
          error.message.includes("quota") ||
          error.message.includes("limit")
        ) {
          throw this.createError("RATE_LIMIT", "Rate limit exceeded");
        }
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          throw this.createError("NETWORK_ERROR", "Network connection failed");
        }
      }

      throw this.createError("API_ERROR", "Failed to enhance prompt");
    }
  }

  static async enhanceWithStreaming(
    request: EnhancementRequest,
    onStreamChunk: StreamCallback,
  ): Promise<EnhancementResponse> {
    if (!this.genAI) {
      throw this.createError("API_ERROR", "AI service not initialized");
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const prompt = this.buildEnhancementPrompt(request);
      const result = await model.generateContentStream(prompt);

      let fullResponse = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullResponse += chunkText;
          onStreamChunk(chunkText, false);
        }
      }

      // Signal completion
      onStreamChunk("", true);

      return this.parseResponse(fullResponse, request.originalPrompt);
    } catch (error) {
      console.error("AI Enhancement streaming error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw this.createError("API_ERROR", "Invalid API key");
        }
        if (
          error.message.includes("quota") ||
          error.message.includes("limit")
        ) {
          throw this.createError("RATE_LIMIT", "Rate limit exceeded");
        }
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          throw this.createError("NETWORK_ERROR", "Network connection failed");
        }
      }

      throw this.createError("API_ERROR", "Failed to enhance prompt");
    }
  }

  private static buildEnhancementPrompt(request: EnhancementRequest): string {
    const { originalPrompt, userContext } = request;

    let prompt = `${this.SYSTEM_PROMPT}\n\n`;

    prompt += `ORIGINAL PROMPT:\n"${originalPrompt}"\n\n`;

    if (userContext) {
      prompt += `ADDITIONAL CONTEXT:\n${userContext}\n\n`;
    }

    prompt += `Please enhance this prompt and respond with the JSON format specified above.`;

    return prompt;
  }

  private static parseResponse(
    responseText: string,
    originalPrompt: string,
  ): EnhancementResponse {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.enhancedPrompt || !parsed.improvements || !parsed.reasoning) {
        throw new Error("Invalid response structure");
      }

      return {
        enhancedPrompt: parsed.enhancedPrompt,
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : [parsed.improvements],
        reasoning: parsed.reasoning,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.warn("Failed to parse AI response, using fallback:", error);

      return {
        enhancedPrompt: this.createFallbackEnhancement(originalPrompt),
        improvements: ["Added basic structure and formatting"],
        reasoning: "Applied basic prompt enhancement patterns",
        timestamp: Date.now(),
      };
    }
  }

  private static createFallbackEnhancement(originalPrompt: string): string {
    return `# Enhanced Prompt

## Context
Please provide the context and background for this request.

## Objective
${originalPrompt}

## Requirements
- Define specific technical requirements
- Specify constraints and limitations
- Include success criteria

## Output Format
- Specify the desired format and structure
- Include any style requirements
- Define the expected length or scope

## Additional Notes
- Add any relevant examples or references
- Include timeline or deadline information if applicable`;
  }

  private static createError(
    code: PromptError["code"],
    message: string,
    details?: Record<string, unknown>,
  ): PromptError {
    const error = new Error(message) as PromptError;
    error.code = code;
    error.details = details;
    return error;
  }

  static async testConnection(apiKey: string): Promise<boolean> {
    try {
      this.initialize(apiKey);
      const model = this.genAI!.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent(
        'Test connection. Respond with "OK".',
      );
      const response = result.response.text();

      return response.toLowerCase().includes("ok");
    } catch (error) {
      console.error("API connection test failed:", error);
      return false;
    }
  }
}
