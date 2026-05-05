import type { TopicNode } from "@/data/types";

const domSelection: TopicNode = {
  id: "js-dom-selection",
  title: "DOM Selection & Manipulation",
  iconName: "MousePointer",
  link: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
  theory:
    "The DOM (Document Object Model) is a tree representation of an HTML document. JavaScript can query, create, modify, and delete nodes. Modern DOM APIs use CSS selector syntax for querying and live vs static NodeList semantics for collection types.",
  theoryDetail: {
    keyConcepts: [
      "querySelector: returns first matching element (or null) — static snapshot",
      "querySelectorAll: returns a StaticNodeList — doesn't update when DOM changes",
      "getElementsByClassName / getElementsByTagName: return HTMLCollections — LIVE, update automatically",
      "createElement + appendChild/insertAdjacentElement: create and insert new nodes",
      "element.textContent vs innerHTML: textContent is safe (text only); innerHTML parses HTML (XSS risk if used with user data)",
      "classList API: add, remove, toggle, contains, replace — better than className string manipulation",
      "dataset: access data-* attributes — all values are strings",
    ],
    whyItMatters:
      "Even in React/Vue apps, developers occasionally need direct DOM access — refs, third-party library integration, portal rendering, or measuring layout. Understanding the DOM is also essential for debugging and understanding what frameworks do under the hood.",
    commonPitfalls: [
      "innerHTML with user input creates XSS vulnerabilities — always use textContent or sanitize",
      "Live collections: getElementsByClassName returns a live HTMLCollection — mutating the DOM inside a loop can cause infinite loops",
      "Querying before DOM is ready: place scripts at end of body or use DOMContentLoaded",
    ],
    examples: [
      {
        title: "DOM queries, element creation, and manipulation",
        description: "Essential DOM APIs with performance and security notes.",
        code: `// ─── Selecting elements ───
const btn    = document.querySelector<HTMLButtonElement>("#submit-btn");
const inputs = document.querySelectorAll<HTMLInputElement>("input[type='text']");
const header = document.getElementById("header");  // returns HTMLElement | null

// Static vs Live collections
const staticList = document.querySelectorAll(".item");    // StaticNodeList — snapshot
const liveList   = document.getElementsByClassName("item"); // HTMLCollection — live!

// ─── Type-safe querying with TypeScript generics ───
const canvas  = document.querySelector<HTMLCanvasElement>("canvas");
const ctx     = canvas?.getContext("2d");  // optional chain — canvas may be null

// ─── Creating and inserting elements ───
const list = document.querySelector<HTMLUListElement>("#todo-list")!;

function addTodoItem(text: string) {
  const li = document.createElement("li");
  li.textContent = text;           // ✅ safe — text only, no HTML parsing
  li.classList.add("todo-item", "pending");
  li.dataset.createdAt = new Date().toISOString();  // data-created-at attribute
  list.appendChild(li);
  // Or: list.append(li);  — append accepts strings and nodes
}

// insertAdjacentElement — precise insertion
const reference = document.querySelector(".reference-item")!;
const newItem   = document.createElement("div");
reference.insertAdjacentElement("afterend", newItem);  // insert after reference

// ─── Modifying elements ───
const el = document.querySelector<HTMLElement>(".card")!;

// Classes
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("expanded");          // add if absent, remove if present
el.classList.replace("pending", "done");  // swap class names
el.classList.contains("active");          // boolean check

// Attributes
el.setAttribute("aria-expanded", "true");
el.getAttribute("data-id");
el.removeAttribute("disabled");

// Styles (prefer CSS classes — inline styles are hard to override)
el.style.transform = "translateX(100px)";  // OK for dynamic values
el.style.setProperty("--custom-var", "42px");  // set CSS custom properties

// ─── innerHTML vs textContent ───
const userInput = '<script>alert("xss")<\\/script>';
el.innerHTML   = userInput;   // ❌ XSS vulnerability — executes injected scripts
el.textContent = userInput;   // ✅ safe — renders as text, not HTML

// ─── Removing elements ───
el.remove();                              // remove from DOM
el.parentElement?.removeChild(el);        // older API

// ─── Traversal ───
el.parentElement;       // parent element (not parentNode which can be a text node)
el.children;            // live HTMLCollection of child elements
el.firstElementChild;   // first child element
el.nextElementSibling;  // next sibling element
el.closest(".container"); // nearest ancestor matching selector (walks up)`,
        language: "typescript",
        output: `DOM TREE STRUCTURE
═══════════════════════════════════════════════════
  document
  └── <html>
      ├── <head>
      │   └── <title>
      └── <body>
          ├── <header id="header">
          │   └── <h1>
          └── <ul id="todo-list">
              ├── <li class="todo-item pending">Buy milk</li>
              └── <li class="todo-item done">Write code</li>

QUERY SELECTOR vs getElements*
═══════════════════════════════════════════════════
  querySelector('#id')          → Element | null (first match)
  querySelectorAll('.class')    → StaticNodeList (snapshot, non-live)
  getElementById('id')          → HTMLElement | null (fastest)
  getElementsByClassName('cls') → HTMLCollection (LIVE — updates with DOM)
  getElementsByTagName('div')   → HTMLCollection (LIVE)

INSERTADJACENTELEMENT POSITIONS
═══════════════════════════════════════════════════
  beforebegin  → before the element itself
  afterbegin   → inside element, before first child
  beforeend    → inside element, after last child
  afterend     → after the element itself

  <div>           ← beforebegin
    <div>         ← afterbegin
      [element]
    </div>        ← beforeend
  </div>          ← afterend

SECURITY: innerHTML vs textContent
═══════════════════════════════════════════════════
  el.innerHTML = userInput;   ← EXECUTES embedded scripts  ❌
  el.textContent = userInput; ← renders as plain text      ✅`,
      },
    ],
  },
};

const eventHandling: TopicNode = {
  id: "js-event-handling",
  title: "Events & Event Delegation",
  iconName: "Zap",
  link: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
  theory:
    "Browser events propagate in three phases: capture (top-down), target, and bubble (bottom-up). Understanding propagation enables event delegation — attaching a single listener to a parent that handles events from all children, including dynamically added ones. This is far more efficient than attaching listeners to each child.",
  theoryDetail: {
    keyConcepts: [
      "addEventListener(type, handler, { capture, once, passive }) — the modern event API",
      "Event bubbling: events propagate from target up through ancestor elements by default",
      "event.stopPropagation(): prevents further bubbling — use sparingly, can break delegation",
      "event.preventDefault(): prevents default browser action (form submit, link navigation)",
      "Event delegation: listen on parent, check event.target to identify the source",
      "removeEventListener: must pass the exact same function reference — no anonymous functions",
      "AbortController: cancel multiple event listeners at once",
    ],
    whyItMatters:
      "Event delegation is a critical performance pattern for lists, tables, and other dynamic content. React's synthetic event system uses delegation internally — all events are registered on the root, not individual elements. Understanding native events helps debug framework event issues.",
    commonPitfalls: [
      "Anonymous functions in addEventListener: impossible to removeEventListener — store reference",
      "Forgetting to remove listeners: causes memory leaks — use AbortController or cleanup in useEffect",
      "stopPropagation breaking delegation: parent listener never fires when child calls stopPropagation",
      "Passive event listeners: touch/scroll handlers should use { passive: true } to not block scrolling",
    ],
    examples: [
      {
        title: "Event listeners, bubbling, delegation, and cleanup",
        description: "From basic events to delegation patterns and AbortController cleanup.",
        code: `// ─── Basic event listener ───
const btn = document.querySelector<HTMLButtonElement>("#btn")!;

function handleClick(event: MouseEvent) {
  console.log("clicked", event.target);
  event.preventDefault();  // prevent form submit, link navigation, etc.
}

btn.addEventListener("click", handleClick);

// ─── Event propagation: capture vs bubble ───
// <div id="outer">  <div id="inner">  <button id="btn">
// Click on button:
//   Capture phase: outer → inner → button  (top-down)
//   Target phase:  button
//   Bubble phase:  button → inner → outer  (bottom-up)

document.querySelector("#outer")!.addEventListener(
  "click",
  (e) => console.log("outer bubble"),  // default: bubble phase
  { capture: false }
);

document.querySelector("#outer")!.addEventListener(
  "click",
  (e) => console.log("outer capture"),  // fires FIRST
  { capture: true }
);

// ─── Event Delegation — one listener handles all list items ───
const list = document.querySelector<HTMLUListElement>("#item-list")!;

list.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Check which element was actually clicked
  const item = target.closest<HTMLLIElement>("li[data-id]");
  if (!item) return;  // clicked on list container, not an item

  const id = item.dataset.id;
  const action = target.closest("[data-action]")?.getAttribute("data-action");

  if (action === "delete") deleteItem(id!);
  if (action === "complete") completeItem(id!);
});

// Works for items added AFTER the listener is attached ✅
function addItem(text: string, id: string) {
  list.insertAdjacentHTML("beforeend",
    \`<li data-id="\${id}">
      \${text}
      <button data-action="complete">✓</button>
      <button data-action="delete">✕</button>
    </li>\`
  );
}

// ─── Removing listeners with AbortController ───
const controller = new AbortController();
const { signal } = controller;

document.addEventListener("keydown", handleKeyDown, { signal });
document.addEventListener("keyup", handleKeyUp, { signal });
window.addEventListener("resize", handleResize, { signal });

// Cancel ALL listeners at once
controller.abort();

function handleKeyDown(e: KeyboardEvent) {}
function handleKeyUp(e: KeyboardEvent) {}
function handleResize(e: UIEvent) {}

// ─── Once: auto-removes after first fire ───
btn.addEventListener("click", () => console.log("first click only"), { once: true });

// ─── Passive: for scroll/touch (tells browser: no preventDefault) ───
document.addEventListener("touchmove", handleTouch, { passive: true });
function handleTouch(e: TouchEvent) { /* cannot call e.preventDefault() here */ }

// ─── Custom events ───
const event = new CustomEvent("user:login", {
  detail: { userId: 123, name: "Alice" },
  bubbles: true,
  cancelable: true,
});
document.dispatchEvent(event);

document.addEventListener("user:login", (e: Event) => {
  const { userId, name } = (e as CustomEvent<{ userId: number; name: string }>).detail;
  console.log(\`User \${name} logged in\`);
});`,
        language: "typescript",
        output: `EVENT PROPAGATION PHASES
═══════════════════════════════════════════════════
  HTML:  <div id="outer">
           <div id="inner">
             <button id="btn">Click</button>

  Click button → events fire in this order:

  Phase 1 — CAPTURE (top → target, capture:true listeners):
    outer[capture] → inner[capture] → btn[capture]

  Phase 2 — TARGET:
    btn (both capture and bubble listeners fire)

  Phase 3 — BUBBLE (target → top, capture:false listeners):
    btn[bubble] → inner[bubble] → outer[bubble]

DELEGATION vs INDIVIDUAL LISTENERS
═══════════════════════════════════════════════════
  1000 list items with click handlers:

  Individual:   1000 listeners × memory overhead
  Delegation:   1 listener on <ul>

  Delegation advantages:
  ✅ Works for dynamically added items
  ✅ Less memory usage
  ✅ Single place to manage logic

ABORTCONTROLLER CLEANUP PATTERN
═══════════════════════════════════════════════════
  // Setup
  const ctrl = new AbortController();
  el.addEventListener("click", fn, { signal: ctrl.signal });
  el.addEventListener("focus", fn, { signal: ctrl.signal });

  // Teardown (removes ALL attached with this signal)
  ctrl.abort();

  // In React useEffect:
  useEffect(() => {
    const ctrl = new AbortController();
    el.addEventListener("click", fn, { signal: ctrl.signal });
    return () => ctrl.abort();  // cleanup on unmount
  }, []);`,
      },
    ],
  },
};

const observersAndIntersection: TopicNode = {
  id: "js-observers",
  title: "Observers & Web APIs",
  iconName: "Eye",
  link: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver",
  theory:
    "Modern browsers provide observer APIs that react to DOM, layout, and visibility changes without polling. MutationObserver watches for DOM mutations. IntersectionObserver triggers when elements enter or exit the viewport. ResizeObserver fires when element dimensions change. These are the foundation of lazy loading, infinite scroll, and animation-on-scroll patterns.",
  theoryDetail: {
    keyConcepts: [
      "MutationObserver: watch for node additions/removals, attribute changes, text content changes",
      "IntersectionObserver: detect when element intersects viewport or another element — threshold and rootMargin control sensitivity",
      "ResizeObserver: fires when an element's size changes — more accurate than window 'resize' event",
      "All observers are asynchronous and non-blocking — callbacks run as microtasks after layout",
      "Always disconnect() observers when done — they hold references and prevent garbage collection",
    ],
    whyItMatters:
      "IntersectionObserver is the standard implementation for lazy loading images, infinite scroll, and scroll-triggered animations. MutationObserver is used by third-party libraries and browser extensions to react to DOM changes. ResizeObserver powers responsive component libraries.",
    commonPitfalls: [
      "Not calling disconnect() — causes memory leaks, observer keeps firing indefinitely",
      "IntersectionObserver fires once immediately on observe() — check isIntersecting before acting",
      "MutationObserver with subtree: true on large DOMs — can be expensive, narrow the scope",
    ],
    examples: [
      {
        title: "MutationObserver, IntersectionObserver, and ResizeObserver",
        description: "The three observer APIs for reactive DOM programming.",
        code: `// ─── IntersectionObserver — lazy loading images ───
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src!;    // load the actual image
      img.removeAttribute("data-src");
      observer.unobserve(img);        // stop watching once loaded
    });
  },
  {
    root: null,         // viewport
    rootMargin: "50px", // start loading 50px before entering viewport
    threshold: 0,       // fire as soon as 1px is visible
  }
);

// Observe all lazy images
document.querySelectorAll<HTMLImageElement>("img[data-src]")
  .forEach(img => imageObserver.observe(img));

// ─── IntersectionObserver — scroll-triggered animation ───
const animationObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  },
  { threshold: 0.2 }  // fire when 20% of element is visible
);

document.querySelectorAll(".animate-on-scroll")
  .forEach(el => animationObserver.observe(el));

// ─── MutationObserver — watch for DOM changes ───
const target = document.querySelector("#dynamic-content")!;

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "childList") {
      console.log("Children changed:", mutation.addedNodes, mutation.removedNodes);
    }
    if (mutation.type === "attributes") {
      console.log(\`Attribute '\${mutation.attributeName}' changed\`);
      console.log("Old value:", mutation.oldValue);
    }
  });
});

mutationObserver.observe(target, {
  childList: true,       // watch for added/removed children
  subtree: true,         // watch all descendants, not just direct children
  attributes: true,      // watch attribute changes
  attributeOldValue: true, // include old attribute value in mutation record
  characterData: false,  // don't watch text content changes
});

// Stop observing
mutationObserver.disconnect();

// ─── ResizeObserver — respond to element size changes ───
const resizeObserver = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log(\`Element is now \${width}px × \${height}px\`);

    // Responsive component logic
    entry.target.classList.toggle("compact", width < 400);
    entry.target.classList.toggle("wide", width >= 800);
  });
});

const card = document.querySelector(".card")!;
resizeObserver.observe(card);

// ─── Cleanup pattern (works great with useEffect) ───
function setupObservers(el: Element) {
  const io = new IntersectionObserver(/* ... */ () => {});
  const ro = new ResizeObserver(/* ... */ () => {});
  io.observe(el);
  ro.observe(el);

  return () => {
    io.disconnect();
    ro.disconnect();
  };
}`,
        language: "typescript",
        output: `OBSERVER COMPARISON
═══════════════════════════════════════════════════
  Observer            Watches                   Use Case
  ─────────────────────────────────────────────────────────
  IntersectionObserver  Element ↔ viewport    Lazy load, infinite scroll,
                        visibility            animate on scroll

  MutationObserver      DOM additions,        Watch third-party widget,
                        removals, attributes  auto-adjust to dynamic HTML

  ResizeObserver        Element dimensions    Responsive components,
                                             canvas resize, chart reflow

  window 'resize' event  Window dimensions   Deprecated pattern for
                                             element sizing (imprecise)

INTERSECTIONOBSERVER OPTIONS
═══════════════════════════════════════════════════
  root: null            → viewport (default)
  root: element         → scroll within that element

  rootMargin: "50px"    → expand detection zone 50px beyond root
  rootMargin: "-10%"    → shrink detection zone 10% inward

  threshold: 0          → fire when 1px enters/exits
  threshold: 0.5        → fire when 50% is visible
  threshold: [0,0.25,0.5,0.75,1] → fire at each ratio

MUTATION TYPES
═══════════════════════════════════════════════════
  childList:      nodes added or removed
  attributes:     attribute value changed
  characterData:  text node content changed
  subtree:        apply to all descendants (not just direct children)`,
      },
    ],
  },
};

export const jsDom: TopicNode = {
  id: "js-dom",
  title: "The DOM & Browser APIs",
  iconName: "Globe",
  link: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
  theory:
    "The Document Object Model is the browser's tree representation of an HTML page. JavaScript can read and modify any part of the DOM — selecting elements, changing content and styles, handling events, and observing changes. Even in React apps, DOM knowledge is essential for refs, portals, and debugging.",
  theoryDetail: {
    keyConcepts: [
      "querySelector/querySelectorAll: CSS selector-based queries — static snapshots",
      "Event propagation: capture (top-down) → target → bubble (bottom-up)",
      "Event delegation: one listener on a parent handles events from all children",
      "Observer APIs: IntersectionObserver (viewport), MutationObserver (DOM changes), ResizeObserver (size)",
    ],
    whyItMatters:
      "React and other frameworks abstract the DOM, but they all ultimately compile to DOM operations. Understanding the DOM makes you a better framework user and is essential when you need to step outside the abstraction.",
    commonPitfalls: [
      "innerHTML with user content is an XSS vector — always use textContent for text",
      "Forgetting to disconnect observers and remove listeners — causes memory leaks",
    ],
  },
  children: [domSelection, eventHandling, observersAndIntersection],
};
