import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  EnhancementRequest,
  EnhancementResponse,
  PromptError,
} from "../../types";

export class AIEnhancer {
  private static genAI: GoogleGenerativeAI | null = null;

  private static readonly SYSTEM_PROMPT = `
You are a prompt optimization expert. Analyze the user's prompt and enhance it based on these criteria:

REQUIRED ELEMENTS TO CHECK:
1. CLARITY: Remove ambiguous language, use specific terms
2. CONTEXT: Add relevant background information
3. CONSTRAINTS: Include technical requirements, limitations
4. OUTPUT FORMAT: Specify desired format, structure, length
5. EXAMPLES: Provide concrete examples when helpful
6. TONE/STYLE: Define the desired tone and style
7. SUCCESS CRITERIA: Define what makes a good result

ENHANCEMENT RULES:
- Transform vague requests into detailed specifications
- Add missing context about the project/domain
- Include specific technical requirements
- Specify output format and structure
- Add constraints and limitations
- Include success criteria

INPUT FORMAT: User's original prompt
OUTPUT FORMAT: Enhanced markdown prompt with clear sections

Be thorough but concise. Focus on actionable improvements.

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

  private static buildEnhancementPrompt(request: EnhancementRequest): string {
    const { originalPrompt, analysis, userContext } = request;

    let prompt = `${this.SYSTEM_PROMPT}\n\n`;

    prompt += `ORIGINAL PROMPT:\n"${originalPrompt}"\n\n`;

    prompt += `ANALYSIS SCORES:\n`;
    prompt += `- Clarity: ${analysis.clarity}/10\n`;
    prompt += `- Specificity: ${analysis.specificity}/10\n`;
    prompt += `- Structure: ${analysis.structure}/10\n`;
    prompt += `- Completeness: ${analysis.completeness}/10\n`;
    prompt += `- Is Vague: ${analysis.isVague}\n\n`;

    if (analysis.missingElements.length > 0) {
      prompt += `MISSING ELEMENTS:\n`;
      analysis.missingElements.forEach((element) => {
        prompt += `- ${element}\n`;
      });
      prompt += `\n`;
    }

    if (analysis.suggestions.length > 0) {
      prompt += `SUGGESTIONS:\n`;
      analysis.suggestions.forEach((suggestion) => {
        prompt += `- ${suggestion}\n`;
      });
      prompt += `\n`;
    }

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
