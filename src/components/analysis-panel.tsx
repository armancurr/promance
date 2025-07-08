"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Warning, CheckCircle, Lightbulb } from "@phosphor-icons/react";
import type { AnalysisPanelProps } from "../../types";
import { LoadingSpinner } from "./loading-spinner";

export function AnalysisPanel({ analysis, isLoading }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-muted-foreground">
            Analyzing prompt...
          </span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Enter a prompt above to see analysis results
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Prompt Analysis
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Overall Score:</span>
          <span
            className={`text-xl font-bold ${getScoreColor(analysis.overallScore)}`}
          >
            {analysis.overallScore}/10
          </span>
          {analysis.isVague && (
            <Badge variant="destructive" className="ml-2">
              <Warning className="h-3 w-3 mr-1" />
              Vague
            </Badge>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Clarity</span>
            <span
              className={`text-sm font-bold ${getScoreColor(analysis.clarity)}`}
            >
              {analysis.clarity}/10
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.clarity)}`}
              style={{ width: `${(analysis.clarity / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Specificity</span>
            <span
              className={`text-sm font-bold ${getScoreColor(analysis.specificity)}`}
            >
              {analysis.specificity}/10
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.specificity)}`}
              style={{ width: `${(analysis.specificity / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Structure</span>
            <span
              className={`text-sm font-bold ${getScoreColor(analysis.structure)}`}
            >
              {analysis.structure}/10
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.structure)}`}
              style={{ width: `${(analysis.structure / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completeness</span>
            <span
              className={`text-sm font-bold ${getScoreColor(analysis.completeness)}`}
            >
              {analysis.completeness}/10
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.completeness)}`}
              style={{ width: `${(analysis.completeness / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Missing Elements */}
        {analysis.missingElements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center">
              <Warning className="h-4 w-4 mr-2 text-orange-500" />
              Missing Elements
            </h4>
            <ul className="space-y-1">
              {analysis.missingElements.map((element, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {element}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
              Suggestions
            </h4>
            <ul className="space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Success Message */}
      {analysis.overallScore >= 8 && !analysis.isVague && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 dark:text-green-200">
            Excellent prompt! Your prompt is clear, specific, and
            well-structured.
          </span>
        </div>
      )}
    </div>
  );
}
