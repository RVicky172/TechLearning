import type { TopicNode } from "@/data/types";

export const htmlFundamentals: TopicNode = {
  id: "html-fundamentals",
  title: "HTML Fundamentals",
  iconName: "FileCode2",
  theoryDetail: {
    keyConcepts: [
      "HTML provides structure and semantics to web content",
      "Semantic elements: <header>, <nav>, <main>, <section>, <article>, <footer>",
      "Document structure: <!DOCTYPE>, <html>, <head>, <body>",
      "Meta tags: control charset, viewport, SEO, and browser behavior",
      "Accessibility: semantic HTML + ARIA attributes help assistive technologies",
      "Microdata: schema.org markup for search engines (JSON-LD preferred)",
    ],
    whyItMatters:
      "Good HTML structure improves accessibility, SEO, and maintainability. It's the foundation that CSS and JavaScript build upon.",
    commonPitfalls: [
      "Using <div> for everything instead of semantic elements; hurts a11y and SEO",
      "Missing alt text on images; inaccessible and bad for SEO",
      "Not validating HTML; missing closing tags cause layout issues",
      "Improper heading hierarchy (h1 → h3, skipping h2); confuses screen readers",
      "Missing lang attribute on <html>; affects browser language detection",
    ],
    examples: [
      {
        title: "Semantic HTML Structure",
        description: "Proper HTML structure with semantic elements.",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My awesome blog">
    <title>Blog - My Awesome Site</title>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "Hello World"
      }
    </script>
  </head>
  <body>
    <header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <article>
        <h1>Hello World</h1>
        <p>First post...</p>
      </article>
    </main>

    <footer>
      <p>&copy; 2026 My Site</p>
    </footer>
  </body>
</html>`,
        language: "html",
      },
    ],
  },
};
