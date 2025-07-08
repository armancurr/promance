import { useState, useCallback, useEffect } from "react";
import { RateLimiter } from "../src/lib/rate-limiter";
import type { RateLimitConfig } from "../types";

export function useRateLimit(config?: Partial<RateLimitConfig>) {
  const [isLimited, setIsLimited] = useState(false);
  const [requestsRemaining, setRequestsRemaining] = useState(10);
  const [resetTime, setResetTime] = useState(Date.now());
  const [identifier] = useState(() => RateLimiter.createBrowserIdentifier());

  const updateStatus = useCallback(() => {
    const status = RateLimiter.getStatus(identifier, config);
    setIsLimited(status.isLimited);
    setRequestsRemaining(status.requestsRemaining);
    setResetTime(status.resetTime);
  }, [identifier, config]);

  const checkLimit = useCallback((): boolean => {
    const allowed = RateLimiter.isAllowed(identifier, config);
    updateStatus();
    return allowed;
  }, [identifier, config, updateStatus]);

  // Update status on mount and periodically
  useEffect(() => {
    updateStatus();

    const interval = setInterval(updateStatus, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updateStatus]);

  const getTimeUntilReset = useCallback((): number => {
    return Math.max(0, resetTime - Date.now());
  }, [resetTime]);

  const formatTimeUntilReset = useCallback((): string => {
    const timeMs = getTimeUntilReset();

    if (timeMs === 0) {
      return "Available now";
    }

    const seconds = Math.ceil(timeMs / 1000);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }

    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }, [getTimeUntilReset]);

  return {
    isLimited,
    requestsRemaining,
    checkLimit,
    getTimeUntilReset,
    formatTimeUntilReset,
    identifier,
  };
}
