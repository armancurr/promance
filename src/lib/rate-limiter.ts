import type { RateLimitState, RateLimitConfig } from "../../types";

export class RateLimiter {
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60000,
  };

  private static instances: Map<string, RateLimitState> = new Map();

  static isAllowed(
    identifier: string,
    config?: Partial<RateLimitConfig>,
  ): boolean {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    const now = Date.now();
    const windowStart = now - fullConfig.windowMs;

    let state = this.instances.get(identifier);
    if (!state) {
      state = { requests: [], isLimited: false };
      this.instances.set(identifier, state);
    }

    state.requests = state.requests.filter(
      (timestamp) => timestamp > windowStart,
    );

    const isWithinLimit = state.requests.length < fullConfig.maxRequests;

    if (isWithinLimit) {
      state.requests.push(now);
      state.isLimited = false;
    } else {
      state.isLimited = true;
    }

    return isWithinLimit;
  }

  static getStatus(
    identifier: string,
    config?: Partial<RateLimitConfig>,
  ): {
    isLimited: boolean;
    requestsRemaining: number;
    resetTime: number;
  } {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    const now = Date.now();
    const windowStart = now - fullConfig.windowMs;

    const state = this.instances.get(identifier);
    if (!state) {
      return {
        isLimited: false,
        requestsRemaining: fullConfig.maxRequests,
        resetTime: now + fullConfig.windowMs,
      };
    }

    state.requests = state.requests.filter(
      (timestamp) => timestamp > windowStart,
    );

    const requestsRemaining = Math.max(
      0,
      fullConfig.maxRequests - state.requests.length,
    );
    const oldestRequest = state.requests[0];
    const resetTime = oldestRequest
      ? oldestRequest + fullConfig.windowMs
      : now + fullConfig.windowMs;

    return {
      isLimited: state.isLimited,
      requestsRemaining,
      resetTime,
    };
  }

  static createBrowserIdentifier(): string {
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
    const screenInfo =
      typeof screen !== "undefined"
        ? `${screen.width}x${screen.height}`
        : "unknown";

    const fingerprint = `${userAgent}-${screenInfo}`;

    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return `browser-${Math.abs(hash)}`;
  }
}
