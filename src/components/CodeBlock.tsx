"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  code: string;
  language?: string;
};

// Map our data language strings to prism language names
const languageMap: Record<string, string> = {
  jsx: "jsx",
  tsx: "tsx",
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
};

export function CodeBlock({ code, language = "javascript" }: Props) {
  const { theme } = useTheme();
  const prismTheme = theme === "dark" ? themes.palenight : themes.oneDark;
  const prismLang = languageMap[language] ?? "javascript";

  return (
    <Highlight code={code.trimEnd()} language={prismLang} theme={prismTheme}>
      {({ style, tokens, getLineProps, getTokenProps }) => {
        const { background, backgroundColor, ...preStyle } = style;

        return (
          <pre
            className="bg-(--bg-code) p-5 overflow-x-auto text-xs leading-relaxed"
            // Let CSS token classes control the surface background.
            style={preStyle}
          >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
          </pre>
        );
      }}
    </Highlight>
  );
}
