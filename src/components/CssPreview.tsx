"use client";

import { useId, useMemo } from "react";
import type { TheoryDetail } from "@/data/types";

type Example = NonNullable<TheoryDetail["examples"]>[number];

function stripPreviewComments(code: string) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, match => {
      const trimmed = match.trim();
      if (
        trimmed.startsWith("/* HTML:") ||
        trimmed.startsWith("/* HTML ") ||
        trimmed.startsWith("/* JavaScript") ||
        trimmed.startsWith("/* CSS")
      ) {
        return "";
      }
      return match;
    })
    .trim();
}

function extractBlock(code: string, marker: RegExp) {
  const match = code.match(marker);
  return match?.[1]?.trim() ?? "";
}

function inferPreview(example: Example) {
  if (example.preview) {
    return example.preview;
  }

  if (example.language !== "css") {
    return null;
  }

  const html = extractBlock(example.code, /\/\*\s*HTML:\s*([\s\S]*?)\*\//);
  const javascript = extractBlock(example.code, /\/\*\s*JavaScript\s*\*\/([\s\S]*)$/);
  const css = stripPreviewComments(example.code);

  if (!html && !example.output) {
    return null;
  }

  return {
    html,
    css,
    javascript,
  };
}

function buildSrcDoc(example: Example, scopeId: string) {
  const preview = inferPreview(example);

  if (!preview) {
    return null;
  }

  const fallbackOutput = example.output
    ? `<div class="preview-note"><pre>${example.output
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre></div>`
    : `<div class="preview-note">Add preview.html for this example to render a browser demo.</div>`;
  const body = preview.html || fallbackOutput;
  const css = preview.css || "";
  const javascript = preview.javascript || "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: light;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      * , *::before, *::after { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        background: #f8fafc;
        color: #0f172a;
      }

      .preview-root {
        min-height: 100vh;
        padding: 20px;
        display: grid;
        align-content: start;
        gap: 16px;
      }

      .preview-note {
        padding: 14px 16px;
        border: 1px dashed #94a3b8;
        border-radius: 12px;
        background: white;
        color: #475569;
        font-size: 14px;
        line-height: 1.5;
      }

      .preview-note pre {
        margin: 0;
        white-space: pre-wrap;
        font: inherit;
      }

      ${css}
    </style>
  </head>
  <body>
    <div class="preview-root" id="${scopeId}">
      ${body}
    </div>
    <script>
      ${javascript}
    </script>
  </body>
</html>`;
}

export function CssPreview({ example }: { example: Example }) {
  const scopeId = useId().replace(/:/g, "");
  const srcDoc = useMemo(() => buildSrcDoc(example, scopeId), [example, scopeId]);

  if (!srcDoc) {
    return null;
  }

  return (
    <div className="border-t border-(--border)">
      <div className="flex items-center gap-2 px-6 py-2.5 bg-(--bg-elevated) border-b border-(--border)">
        <span className="w-2 h-2 rounded-full bg-(--success) shrink-0" />
        <span className="text-[10px] font-semibold text-(--success) uppercase tracking-widest">Browser Preview</span>
      </div>
      <iframe
        title={`${example.title} preview`}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        className="block w-full border-0 bg-white"
        height={example.preview?.height ?? 260}
      />
    </div>
  );
}