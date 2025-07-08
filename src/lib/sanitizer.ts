import DOMPurify from "dompurify";
import type { SanitizationOptions } from "../../types";

export class InputSanitizer {
  private static readonly DEFAULT_OPTIONS: SanitizationOptions = {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
    ],
    allowedAttributes: ["class", "id"],
    stripIgnoreTag: true,
  };

  static sanitizeHTML(input: string, options?: SanitizationOptions): string {
    if (typeof window === "undefined") {
      return this.stripHTMLTags(input);
    }

    const config = { ...this.DEFAULT_OPTIONS, ...options };

    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: config.allowedTags,
      ALLOWED_ATTR: config.allowedAttributes,
    });
  }

  static sanitizeText(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    return input
      .trim()
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 10000);
  }

  static sanitizePrompt(input: string): string {
    if (!input || typeof input !== "string") {
      return "";
    }

    let sanitized = input;

    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/data:text\/html/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    sanitized = sanitized
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n");

    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

    if (sanitized.length > 5000) {
      sanitized = sanitized.slice(0, 5000);
    }

    return sanitized;
  }

  static validateApiKey(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== "string") {
      return false;
    }

    const keyPattern = /^[A-Za-z0-9_-]{20,}$/;
    return keyPattern.test(apiKey.trim());
  }

  private static stripHTMLTags(input: string): string {
    return input.replace(/<[^>]*>/g, "");
  }

  static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  static sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== "string") {
      return "untitled";
    }

    return fileName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .slice(0, 255);
  }
}
