import type { TopicNode } from "@/data/types";

export const cssContainerQueries: TopicNode = { 
  id: "css-container-queries",
  title: "Container Queries",
  iconName: "Layers",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
  theory:
    "Container queries let components respond to their own container's size instead of the viewport. This enables truly self-contained, reusable components that look correct in any context.",
  theoryDetail: {
    keyConcepts: [
      "container-type: inline-size registers an element as a query container",
      "@container (min-width: 400px) queries the nearest named or unnamed container",
      "container-name: card-container gives a container an explicit name for nested queries",
      "cqi, cqb — container query inline/block units (similar to vw/vh but relative to the container)",
    ],
    whyItMatters:
      "Media queries respond to the viewport, making component-level responsive design impossible without JavaScript. Container queries solve this — a card component can be wide in a sidebar and narrow in a modal without any layout-level knowledge.",
    commonPitfalls: [
      "Forgetting to set container-type: inline-size — without it, @container rules never apply",
      "Querying the container you're styling — a container cannot query itself; query its parent",
      "Using container queries for page-level layout — media queries are still the right tool there",
    ],
    examples: [
      {
        title: "Self-contained responsive card",
        description:
          "The card switches from a stacked to a side-by-side layout based on its container width, not the viewport.",
        code: `/* HTML:
  <div class="card-wrapper">          ← the container
    <article class="card">
      <img class="card-image" ...>
      <div class="card-body">...</div>
    </article>
  </div>
*/

/* 1. Register the wrapper as a container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 2. Default (narrow) layout — stacked */
.card {
  display: grid;
  grid-template-columns: 1fr;
}

/* 3. When container is 500px or wider — side-by-side */
@container card (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
  }

  .card-image {
    border-radius: 8px 0 0 8px;
  }
}

/* OUTPUT in narrow sidebar (300px):  [image over text]
   OUTPUT in main content (700px):    [image | text side-by-side]
   Same component, zero JS, responsive to its slot. */`,
        language: "css",
      },
    ],
  },
};