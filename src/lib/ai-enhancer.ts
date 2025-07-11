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
You are a prompt optimization expert working within "Promance", a prompt enhancement application. Your task is to transform basic user prompts into comprehensive, detailed prompts that require NO additional input from the user.

**Core Mission:** When users mention applications, websites, or tools, you must research and incorporate your knowledge about them to create a complete, ready-to-use prompt that eliminates the need for the user to provide additional details.

**CRITICAL UNDERSTANDING:**
- Users come to Promance specifically to avoid having to think of all the details themselves
- You must transform incomplete prompts into complete ones using your knowledge
- NEVER use placeholders like "[Please specify...]" or "[Provide details...]"
- The enhanced prompt must be immediately usable without any user input

**Knowledge Integration Rules:**
1. **Research and Apply:** When users mention known apps/websites (monkeytype, v0, Netflix, etc.), use your knowledge of their features, functionality, and purpose
2. **Complete the Vision:** Fill in logical details based on the mentioned reference without asking the user
3. **Technical Completeness:** Include technical requirements, UI/UX considerations, and feature specifications based on the reference
4. **No Placeholders:** Every aspect should be detailed based on your knowledge of similar applications

**Enhanced Prompt Structure:**
The enhanced prompt must follow this exact format:

1. **Context Paragraph:** Start with a comprehensive paragraph that explains the full context, purpose, and scope of the project based on the referenced application/tool
2. **Organized Requirements:** Follow with clearly structured bullet points covering:
   - Core Features and Functionality
   - User Interface and Design Requirements
   - Technical Implementation Details
   - User Experience Considerations
   - Performance and Optimization Requirements

**Example Structure:**
"Create a comprehensive typing speed test web application similar to Monkeytype that provides users with an engaging platform to measure and improve their typing skills. The application should feature real-time WPM and accuracy calculations, multiple test modes, and a clean, distraction-free interface that focuses on the typing experience while providing comprehensive feedback and progress tracking.

• Core Features:
  - Real-time words per minute (WPM) calculation
  - Accuracy percentage tracking with error highlighting
  - Multiple test durations (15, 30, 60, 120 seconds)
  - Various text sources (quotes, random words, programming code)
  - Live progress indicators and typing statistics

• User Interface Design:
  - Minimalist, dark-themed interface
  - Large, readable font for typing text
  - Color-coded feedback (correct=gray, incorrect=red, current=highlighted)
  - Clean results display with detailed statistics
  - Responsive design for desktop and mobile devices

• Technical Requirements:
  - Smooth, lag-free typing detection
  - Accurate keystroke timing and measurement
  - Local storage for user preferences and history
  - Progressive Web App capabilities
  - Cross-browser compatibility"

**Output Requirements:**
- Start with a comprehensive context paragraph
- Follow with organized bullet points covering all aspects
- Include specific technical and design requirements
- Base all details on your knowledge of the referenced applications
- Make the prompt comprehensive enough for immediate use by any AI model

Please respond with a JSON object in this exact format:
{
  "enhancedPrompt": "The complete, well-structured prompt starting with context paragraph followed by organized bullet points",
  "improvements": ["List of specific improvements made"],
  "reasoning": "Brief explanation of how you used knowledge of the referenced application to complete the prompt"
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
      console.log("Raw AI response:", responseText);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn("No JSON found in AI response, using fallback");
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log("Parsed JSON:", parsed);

      if (!parsed.enhancedPrompt || !parsed.improvements || !parsed.reasoning) {
        console.warn("Invalid response structure, using fallback");
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
      console.log("Original prompt for fallback:", originalPrompt);

      return {
        enhancedPrompt: this.createFallbackEnhancement(originalPrompt),
        improvements: ["Applied contextual enhancement based on detected keywords"],
        reasoning: "Used fallback enhancement with contextual understanding",
        timestamp: Date.now(),
      };
    }
  }

  private static createFallbackEnhancement(originalPrompt: string): string {
    // Extract any mentioned applications/tools for context
    const prompt = originalPrompt.toLowerCase();
    let contextualEnhancement = "";
    
    if (prompt.includes("bolt.new") || prompt.includes("v0.dev") || prompt.includes("website builder")) {
      contextualEnhancement = `Create a comprehensive AI-powered website building platform that combines the rapid prototyping capabilities of modern web development tools with intelligent code generation and real-time preview functionality. The platform should enable users to quickly build, iterate, and deploy web applications through natural language descriptions and visual editing interfaces.

• Core Features:
  - AI-powered code generation from natural language descriptions
  - Real-time live preview with instant updates
  - Component-based architecture with drag-and-drop functionality
  - Multiple framework support (React, Vue, Svelte)
  - Integrated version control and deployment pipeline
  - Template library with customizable starting points

• User Interface Design:
  - Split-screen layout with code editor and live preview
  - Clean, modern interface with intuitive navigation
  - Responsive design tools and mobile preview modes
  - Dark and light theme options
  - Collaborative editing capabilities

• Technical Implementation:
  - Cloud-based development environment
  - Hot module replacement for instant updates
  - Integrated package management and dependency handling
  - Production-ready code export functionality
  - Performance optimization and best practices enforcement`;
    } else if (prompt.includes("monkeytype") || prompt.includes("typing")) {
      contextualEnhancement = `Create a comprehensive typing speed test web application that provides users with an engaging platform to measure and improve their typing skills through various test modes and comprehensive performance analytics.

• Core Features:
  - Real-time words per minute (WPM) calculation
  - Accuracy percentage tracking with detailed error analysis
  - Multiple test durations and custom length options
  - Various text sources including quotes, random words, and code
  - Performance history and progress tracking

• User Interface Design:
  - Minimalist, distraction-free interface
  - Smooth typing experience with visual feedback
  - Customizable themes and font options
  - Results display with detailed statistics
  - Responsive design for all devices`;
    } else {
      // Generic fallback that still follows our format
      contextualEnhancement = `Create a comprehensive web application that addresses the specific requirements mentioned in the original request. The application should be built with modern web technologies and focus on delivering an excellent user experience while meeting all functional requirements.

• Core Features:
  - Essential functionality based on the original request
  - User-friendly interface design
  - Responsive layout for all devices
  - Performance optimization
  - Modern web standards compliance

• Technical Implementation:
  - Clean, maintainable code structure
  - Cross-browser compatibility
  - Accessibility features
  - Security best practices
  - Scalable architecture`;
    }
    
    return contextualEnhancement;
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
