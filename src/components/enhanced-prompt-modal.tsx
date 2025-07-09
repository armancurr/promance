"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { CopySimple } from "@phosphor-icons/react";
import { useAppStore } from "../../stores/app-store";
import { Editor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

const vercelTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: false,
  rules: [
    { token: "comment", foreground: "a1a1a1" },
    { token: "punctuation.definition.comment", foreground: "a1a1a1" },
    { token: "string.comment", foreground: "a1a1a1" },
    { token: "entity.other.attribute-name", foreground: "b675f1" },
    { token: "constant", foreground: "62a6ff" },
    { token: "entity.name.constant", foreground: "62a6ff" },
    { token: "variable.other.constant", foreground: "62a6ff" },
    { token: "variable.language", foreground: "62a6ff" },
    { token: "entity", foreground: "62a6ff" },
    { token: "entity.name", foreground: "62a6ff" },
    { token: "meta.export.default", foreground: "62a6ff" },
    { token: "meta.definition.variable", foreground: "62a6ff" },
    { token: "variable.parameter.function", foreground: "ededed" },
    { token: "meta.jsx.children", foreground: "ededed" },
    { token: "meta.block", foreground: "ededed" },
    { token: "meta.tag.attributes", foreground: "ededed" },
    { token: "meta.object.member", foreground: "ededed" },
    { token: "meta.embedded.expression", foreground: "ededed" },
    { token: "meta.template.expression", foreground: "ededed" },
    { token: "string.other.begin.yaml", foreground: "ededed" },
    { token: "string.other.end.yaml", foreground: "ededed" },
    { token: "entity.name.function", foreground: "b675f1" },
    { token: "support.type.primitive", foreground: "b675f1" },
    { token: "support.class.component", foreground: "62a6ff" },
    { token: "keyword", foreground: "f05b8d" },
    { token: "keyword.operator", foreground: "f05b8d" },
    { token: "storage.type.function.arrow", foreground: "f05b8d" },
    { token: "punctuation.separator.key-value.css", foreground: "f05b8d" },
    { token: "entity.name.tag.yaml", foreground: "f05b8d" },
    {
      token: "punctuation.separator.key-value.mapping.yaml",
      foreground: "f05b8d",
    },
    { token: "storage", foreground: "f05b8d" },
    { token: "storage.type", foreground: "f05b8d" },
    { token: "storage.modifier.package", foreground: "ededed" },
    { token: "storage.modifier.import", foreground: "ededed" },
    { token: "storage.type.java", foreground: "ededed" },
    { token: "string", foreground: "58c760" },
    { token: "punctuation.definition.string", foreground: "58c760" },
    {
      token: "string.punctuation.section.embedded.source",
      foreground: "58c760",
    },
    { token: "entity.name.tag", foreground: "58c760" },
    { token: "support", foreground: "f05b8d" },
    { token: "support.type.object.module", foreground: "62a6ff" },
    { token: "variable.other.object", foreground: "62a6ff" },
    { token: "support.type.property-name.css", foreground: "62a6ff" },
    { token: "meta.property-name", foreground: "62a6ff" },
    { token: "variable", foreground: "ededed" },
    { token: "variable.other", foreground: "ededed" },
    { token: "invalid.broken", foreground: "f05b8d" },
    { token: "invalid.deprecated", foreground: "f05b8d" },
    { token: "invalid.illegal", foreground: "f05b8d" },
    { token: "invalid.unimplemented", foreground: "f05b8d" },
    { token: "carriage-return", foreground: "111111" },
    { token: "message.error", foreground: "f05b8d" },
    { token: "string.source", foreground: "ededed" },
    { token: "string.variable", foreground: "62a6ff" },
    { token: "source.regexp", foreground: "62a6ff" },
    { token: "string.regexp", foreground: "62a6ff" },
    { token: "string.regexp.character-class", foreground: "62a6ff" },
    { token: "string.regexp.constant.character.escape", foreground: "62a6ff" },
    { token: "string.regexp.source.ruby.embedded", foreground: "62a6ff" },
    {
      token: "string.regexp.string.regexp.arbitrary-repitition",
      foreground: "62a6ff",
    },
    { token: "support.constant", foreground: "62a6ff" },
    { token: "support.variable", foreground: "62a6ff" },
    { token: "meta.module-reference", foreground: "62a6ff" },
    {
      token: "punctuation.definition.list.begin.markdown",
      foreground: "f99902",
    },
    { token: "markup.heading", foreground: "62a6ff", fontStyle: "bold" },
    {
      token: "markup.heading.entity.name",
      foreground: "62a6ff",
      fontStyle: "bold",
    },
    { token: "markup.quote", foreground: "62a6ff" },
    { token: "markup.italic", foreground: "ededed", fontStyle: "italic" },
    { token: "markup.bold", foreground: "ededed", fontStyle: "bold" },
    { token: "markup.raw", foreground: "62a6ff" },
    { token: "markup.deleted", foreground: "f05b8d" },
    { token: "meta.diff.header.from-file", foreground: "f05b8d" },
    { token: "punctuation.definition.deleted", foreground: "f05b8d" },
    { token: "markup.inserted", foreground: "62a6ff" },
    { token: "meta.diff.header.to-file", foreground: "62a6ff" },
    { token: "punctuation.definition.inserted", foreground: "62a6ff" },
    { token: "markup.changed", foreground: "f99902" },
    { token: "punctuation.definition.changed", foreground: "f99902" },
    { token: "markup.ignored", foreground: "777777" },
    { token: "markup.untracked", foreground: "777777" },
    { token: "meta.diff.range", foreground: "b675f1", fontStyle: "bold" },
    { token: "meta.diff.header", foreground: "62a6ff" },
    { token: "meta.separator", foreground: "62a6ff", fontStyle: "bold" },
    { token: "meta.output", foreground: "62a6ff" },
    { token: "meta.export.default", foreground: "ededed" },
    { token: "brackethighlighter.tag", foreground: "ededed" },
    { token: "brackethighlighter.curly", foreground: "ededed" },
    { token: "brackethighlighter.round", foreground: "ededed" },
    { token: "brackethighlighter.square", foreground: "ededed" },
    { token: "brackethighlighter.angle", foreground: "ededed" },
    { token: "brackethighlighter.quote", foreground: "ededed" },
    { token: "brackethighlighter.unmatched", foreground: "f05b8d" },
    {
      token: "constant.other.reference.link",
      foreground: "62a6ff",
      fontStyle: "underline",
    },
    {
      token: "string.other.link",
      foreground: "62a6ff",
      fontStyle: "underline",
    },
    { token: "token.info-token", foreground: "6796E6" },
    { token: "token.warn-token", foreground: "f99902" },
    { token: "token.error-token", foreground: "f05b8d" },
    { token: "token.debug-token", foreground: "b675f1" },
  ],
  colors: {
    "editor.background": "#0a0a0a",
    "editor.findMatchBackground": "#f9990288",
    "editor.findMatchHighlightBackground": "#f9990222",
    "editor.focusedStackFrameHighlightBackground": "#333333",
    "editor.foldBackground": "#ffffff1a",
    "editor.foreground": "#ededed",
    "editor.inactiveSelectionBackground": "#ffffff1a",
    "editor.lineHighlightBackground": "#ffffff1a",
    "editor.linkedEditingBackground": "#ffffff1a",
    "editor.selectionBackground": "#ffffff1a",
    "editor.selectionHighlightBackground": "#ffffff1a",
    "editor.selectionHighlightBorder": "#ffffff1a",
    "editor.stackFrameHighlightBackground": "#f9990225",
    "editor.wordHighlightBackground": "#ffffff1a",
    "editor.wordHighlightBorder": "#00000000",
    "editor.wordHighlightStrongBackground": "#00000000",
    "editor.wordHighlightStrongBorder": "#00000000",
    "editorBracketMatch.background": "#ffffff1a",
    "editorBracketMatch.border": "#00000000",
    "editorCursor.foreground": "#ededed",
    "editorGroup.border": "#242424",
    "editorGroupHeader.tabsBackground": "#000000",
    "editorGroupHeader.tabsBorder": "#242424",
    "editorGutter.addedBackground": "#58c760",
    "editorGutter.deletedBackground": "#f05b8d",
    "editorGutter.modifiedBackground": "#f99902",
    "editorHoverWidget.background": "#000000",
    "editorHoverWidget.foreground": "#a1a1a1",
    "editorIndentGuide.activeBackground1": "#242424",
    "editorIndentGuide.background1": "#242424",
    "editorInlayHint.background": "#0a0a0a",
    "editorInlayHint.foreground": "#a1a1a1",
    "editorLineNumber.activeForeground": "#a1a1a1",
    "editorLineNumber.foreground": "#878787",
    "editorOverviewRuler.border": "#000000",
    "editorOverviewRuler.errorForeground": "#f05b8d",
    "editorRuler.foreground": "#242424",
    "editorWhitespace.foreground": "#878787",
    "editorWidget.background": "#000000",
    "editorWidget.border": "#333333",
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.activeBackground": "#333333",
    "scrollbarSlider.background": "#333333",
    "scrollbarSlider.hoverBackground": "#333333",
    focusBorder: "#00000000",
    foreground: "#a1a1a1",
    "activityBar.activeBorder": "#ededed",
    "activityBar.background": "#000000",
    "activityBar.border": "#242424",
    "activityBar.foreground": "#ededed",
    "activityBar.inactiveForeground": "#878787",
    "sideBar.background": "#000000",
    "sideBar.border": "#242424",
    "sideBar.foreground": "#a1a1a1",
    "panel.background": "#000000",
    "panel.border": "#242424",
    "tab.activeBackground": "#0a0a0a",
    "tab.activeBorder": "#0a0a0a",
    "tab.activeBorderTop": "#ededed",
    "tab.activeForeground": "#a1a1a1",
    "tab.border": "#242424",
    "tab.hoverBackground": "#000000",
    "tab.inactiveBackground": "#000000",
    "tab.inactiveForeground": "#a1a1a1",
    "titleBar.activeBackground": "#000000",
    "titleBar.activeForeground": "#a1a1a1",
    "titleBar.border": "#242424",
    "titleBar.inactiveBackground": "#000000",
    "titleBar.inactiveForeground": "#a1a1a1",
  },
};

export function EnhancedPromptModal() {
  const {
    enhancedPrompt,
    setEnhancedPrompt,
    isModalOpen,
    setIsModalOpen,
    isStreaming,
    streamedContent,
  } = useAppStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const contentToCopy = isStreaming ? streamedContent : enhancedPrompt;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="bg-neutral-950 border-2 border-neutral-800 rounded-3xl w-[90vw] h-[80vh] max-w-4xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  {isStreaming
                    ? "Generating Enhanced Prompt..."
                    : "Enhanced Prompt"}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {isStreaming
                    ? "AI is enhancing your prompt in real-time"
                    : "You can edit the prompt if you like"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCopy}
                  size="sm"
                  disabled={isStreaming && !streamedContent}
                  className={`bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-2xl hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${copied ? "text-green-600" : ""}`}
                >
                  <CopySimple className="h-4 w-4" />
                  {copied ? "Exported" : "Export"}
                </Button>
                {/* <Button
                  onClick={handleClose}
                  size="sm"
                  className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-200 border-2 border-neutral-800 cursor-pointer rounded-lg hover:bg-gradient-to-b hover:from-neutral-900 hover:to-neutral-950 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button> */}
              </div>
            </div>

            <div className="flex-1 rounded-3xl overflow-hidden relative">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={isStreaming ? streamedContent : enhancedPrompt}
                onChange={(value) =>
                  !isStreaming && setEnhancedPrompt(value || "")
                }
                theme="vercel-dark"
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("vercel-dark", vercelTheme);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily:
                    'Geist Mono, ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  fontLigatures: true,
                  wordWrap: "on",
                  padding: { top: 24, bottom: 24 },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: "gutter",
                  folding: true,
                  lineNumbers: "off",
                  glyphMargin: false,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  renderWhitespace: "boundary",
                  bracketPairColorization: { enabled: true },
                  guides: {
                    indentation: true,
                    highlightActiveIndentation: true,
                  },
                  cursorBlinking: "smooth",
                  cursorStyle: "underline",
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
                  readOnly: isStreaming,
                }}
              />
              {isStreaming && (
                <div className="absolute bottom-6 right-6">
                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-neutral-300">
                      Streaming...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
