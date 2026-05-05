import type { TopicNode } from "@/data/types";

const eventLoop: TopicNode = {
  id: "js-event-loop",
  title: "The Event Loop, Call Stack & Task Queues",
  iconName: "RefreshCw",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
  theory:
    "JavaScript is single-threaded — only one piece of code runs at a time. The event loop is the mechanism that allows non-blocking I/O despite this constraint. It continuously checks the call stack, microtask queue, and task (macro-task) queue, processing each in priority order.",
  theoryDetail: {
    keyConcepts: [
      "Call stack: synchronous execution — function calls push frames, returns pop them. Overflow = RangeError",
      "Web APIs (browser) / C++ APIs (Node): setTimeout, fetch, DOM events run off-thread and push callbacks to queues when done",
      "Microtask queue: .then() callbacks, queueMicrotask(), async/await continuations — processed COMPLETELY before the next task",
      "Task queue (macrotask): setTimeout, setInterval, I/O events — one task processed per event loop tick",
      "Priority: call stack → microtasks (all) → render (browser) → next macrotask",
      "Promise.then callbacks are microtasks — always run before the next setTimeout",
    ],
    whyItMatters:
      "The event loop explains why setTimeout(fn, 0) doesn't run immediately, why a Promise.then beats setTimeout, why a long synchronous loop freezes the UI, and why Node.js can handle thousands of concurrent connections on one thread.",
    commonPitfalls: [
      "Assuming setTimeout(fn, 0) runs at exactly 0ms — it runs after the current call stack + all microtasks clear",
      "Blocking the event loop with heavy synchronous computation — use Web Workers or break into chunks",
      "Unhandled promise rejections — always add .catch() or try/catch in async functions",
    ],
    examples: [
      {
        title: "Event loop execution order — predict the output",
        description: "Walk through stack, microtask queue, and macrotask queue step by step.",
        code: `console.log("1 — sync start");

setTimeout(() => console.log("2 — setTimeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("3 — Promise.then (microtask)"))
  .then(() => console.log("4 — second .then (microtask)"));

queueMicrotask(() => console.log("5 — queueMicrotask"));

console.log("6 — sync end");

// ─── Output order: 1, 6, 3, 5, 4, 2 ───

// ─── Why? ───
// 1. Sync code runs first:        "1", "6"
// 2. Microtasks drain completely: "3", "5", "4"
//    (3 → its .then queues 4 → 5 runs next → then 4)
// 3. One macrotask:               "2"

// ─── Blocking the event loop ───
function blockingLoop(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}  // busy-wait — BLOCKS everything
}

console.log("before block");
blockingLoop(2000);             // UI freezes for 2 seconds!
console.log("after block");    // nothing runs during the block

// ─── Non-blocking alternative: chunked processing ───
function processInChunks(items: number[], chunkSize = 100) {
  let index = 0;
  function processNext() {
    const chunk = items.slice(index, index + chunkSize);
    chunk.forEach(item => { /* process */ void item; });
    index += chunkSize;
    if (index < items.length) {
      setTimeout(processNext, 0);  // yield to event loop between chunks
    }
  }
  processNext();
}

// ─── Microtask flooding (starvation) ───
function recursiveMicrotask() {
  Promise.resolve().then(recursiveMicrotask);  // never yields to macrotasks!
  // Use setTimeout for recursive scheduling to avoid starving the render loop
}`,
        language: "typescript",
        output: `EVENT LOOP EXECUTION ORDER
═══════════════════════════════════════════════════
  TICK 1 — call stack clears:
    ├─ "1 — sync start"    (synchronous)
    └─ "6 — sync end"      (synchronous)

  TICK 1 — microtasks drain (ALL before next macrotask):
    ├─ "3 — Promise.then"  (queued by Promise.resolve().then)
    ├─ "5 — queueMicrotask" (queued before 3 completed)
    └─ "4 — second .then"  (queued when "3" callback ran)

  TICK 2 — one macrotask dequeued:
    └─ "2 — setTimeout"    (macrotask from setTimeout(..., 0))

FINAL OUTPUT:  1 → 6 → 3 → 5 → 4 → 2

TASK PRIORITY DIAGRAM
═══════════════════════════════════════════════════
  ┌────────────────────────────────────────────┐
  │          EVENT LOOP TICK                   │
  │                                            │
  │  1. Run call stack until empty             │
  │  2. Drain ALL microtasks                   │
  │     (each microtask can queue more)        │
  │  3. Render/paint (browser only)            │
  │  4. Dequeue ONE macrotask → go to step 1  │
  └────────────────────────────────────────────┘

  Microtask sources:    Promise.then, queueMicrotask, MutationObserver
  Macrotask sources:    setTimeout, setInterval, I/O, requestAnimationFrame`,
      },
    ],
  },
};

const promises: TopicNode = {
  id: "js-promises",
  title: "Promises",
  iconName: "Clock",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  theory:
    "A Promise represents an eventually available value — pending, fulfilled, or rejected. Promises replaced callback hell with chainable .then()/.catch() handlers. They are the foundation of the entire async JavaScript ecosystem: fetch, async/await, and all modern APIs return Promises.",
  theoryDetail: {
    keyConcepts: [
      "States: pending → fulfilled (with value) or rejected (with reason) — state transition is permanent",
      ".then(onFulfilled, onRejected) — returns a NEW promise, enabling chaining",
      ".catch(fn) is shorthand for .then(undefined, fn) — always at the end of a chain",
      ".finally(fn) — runs on both fulfil and reject, doesn't receive value (for cleanup)",
      "Promise.all([...]) — waits for all, fails fast on first rejection",
      "Promise.allSettled([...]) — waits for all, always resolves with status+value/reason",
      "Promise.race([...]) — resolves/rejects with the first settled promise",
      "Promise.any([...]) — resolves with the first fulfilled (ignores rejections)",
    ],
    whyItMatters:
      "Every browser API (fetch, geolocation, IndexedDB) and Node.js API (fs.promises, axios, database clients) returns Promises. Knowing when to use all vs allSettled vs race vs any is a common interview question.",
    commonPitfalls: [
      "Not returning a promise from .then() — without return, the next .then() gets undefined",
      "Missing .catch() — unhandled rejections crash Node.js processes and show warnings in browsers",
      "Promise.all failing silently — one rejection cancels all; use allSettled to handle partial failures",
      "Creating unnecessary promise wrappers: return new Promise(r => r(value)) → just use Promise.resolve(value)",
    ],
    examples: [
      {
        title: "Promise chaining, combinators, and error handling",
        description: "From basic promise creation to all/allSettled patterns and error propagation.",
        code: `// ─── Creating promises ───
const fetchUser = (id: number): Promise<{ name: string; role: string }> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ name: "Alice", role: "admin" });
      else        reject(new Error("Invalid user ID"));
    }, 100);
  });

// ─── Chaining — each .then receives the RETURNED value of the previous ───
fetchUser(1)
  .then(user => {
    console.log(user.name);    // "Alice"
    return user.role;           // ← returned value passed to next .then
  })
  .then(role => {
    console.log(role);          // "admin"
    return role.toUpperCase();  // ← chaining continues
  })
  .then(upper => console.log(upper)) // "ADMIN"
  .catch(err => console.error("Error:", err.message))  // catches any rejection in the chain
  .finally(() => console.log("cleanup")); // always runs

// ─── Promise.all — fail-fast parallel ───
const ids = [1, 2, 3];
Promise.all(ids.map(fetchUser))
  .then(users => console.log(users))   // all 3 users
  .catch(err => console.error(err));   // if ANY fails, entire .all rejects

// ─── Promise.allSettled — partial failures ───
Promise.allSettled([
  fetchUser(1),
  fetchUser(-1),  // will reject
  fetchUser(3),
]).then(results => {
  results.forEach(result => {
    if (result.status === "fulfilled") {
      console.log("✅", result.value.name);
    } else {
      console.log("❌", result.reason.message);
    }
  });
});

// ─── Promise.race — first settled wins ───
const timeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );

Promise.race([fetchUser(1), timeout(50)])
  .then(user => console.log("Got user:", user))
  .catch(err => console.error("Race lost:", err.message)); // if timeout < fetch

// ─── Error propagation through chain ───
Promise.resolve("start")
  .then(v => { throw new Error("step 2 failed"); })  // rejection propagates
  .then(v => console.log("skipped"))                  // skipped on rejection
  .catch(err => {
    console.error("caught:", err.message);            // "step 2 failed"
    return "recovered";                               // returning a value → back to fulfilled
  })
  .then(v => console.log("after recovery:", v));      // "after recovery: recovered"`,
        language: "typescript",
        output: `PROMISE STATE MACHINE
═══════════════════════════════════════════════════
           ┌──────────────────────┐
           │       pending        │
           └──────────┬───────────┘
                      │
            resolve() │ reject()
           ┌──────────▼───────────┐
           │                      │
    ┌──────▼──────┐     ┌─────────▼─────────┐
    │  fulfilled  │     │      rejected      │
    │  (value)    │     │      (reason)      │
    └──────┬──────┘     └─────────┬──────────┘
           │                      │
           ▼ .then(fn)            ▼ .catch(fn)
        new Promise             new Promise
    (state depends on fn)   (can recover → fulfilled)

PROMISE COMBINATORS
═══════════════════════════════════════════════════
  Promise.all([p1,p2,p3])
    → resolves when ALL resolve: [v1, v2, v3]
    → rejects immediately if ANY rejects

  Promise.allSettled([p1,p2,p3])
    → always resolves when all SETTLE (never rejects)
    → [{status:"fulfilled",value},{status:"rejected",reason},...]

  Promise.race([p1,p2,p3])
    → resolves/rejects with whichever SETTLES first

  Promise.any([p1,p2,p3])
    → resolves with first FULFILLED
    → rejects only if ALL reject (AggregateError)

CHAINING RETURN VALUES
═══════════════════════════════════════════════════
  .then(v => value)        → next gets value
  .then(v => promise)      → next waits for promise to settle
  .then(v => { throw err}) → chain switches to rejected state
  .catch(e => value)       → chain switches back to fulfilled`,
      },
    ],
  },
};

const asyncAwait: TopicNode = {
  id: "js-async-await",
  title: "async / await",
  iconName: "Zap",
  link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises",
  theory:
    "async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses execution of the async function until the Promise settles, then resumes — making asynchronous code read like synchronous code without blocking the thread.",
  theoryDetail: {
    keyConcepts: [
      "async function always returns a Promise — returned values are auto-wrapped in Promise.resolve()",
      "await can only be used inside an async function (or at the top level of a module)",
      "await pauses only the async function — the rest of the program continues (non-blocking)",
      "try/catch inside async functions catches both synchronous throws and rejected promises",
      "Sequential vs parallel: multiple awaits in sequence are slow — use Promise.all for parallel",
      "Top-level await: available in ES modules — no need to wrap in an async IIFE",
    ],
    whyItMatters:
      "async/await eliminated callback hell and made asynchronous code dramatically more readable and debuggable. Stack traces with async/await are human-readable. Every modern API call (fetch, database queries, file I/O) uses it.",
    commonPitfalls: [
      "Sequential awaits in a loop when requests are independent: for (const id of ids) await fetch(id) — use Promise.all instead",
      "Forgetting await: const data = fetchUser() returns a Promise, not the user — add await",
      "Error swallowing with empty catch: catch(e) {} — always log or rethrow",
      "async forEach doesn't await each callback: array.forEach(async item => await fetch(item)) — use for...of or Promise.all(array.map(...))",
    ],
    examples: [
      {
        title: "Sequential vs parallel await, error handling, and async pitfalls",
        description: "Practical async patterns with timing comparison and the forEach trap.",
        code: `// ─── Basic async/await ───
async function getUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  const user = await response.json();
  return user;  // auto-wrapped in Promise.resolve()
}

// ─── try/catch for error handling ───
async function loadUserSafely(id: number) {
  try {
    const user = await getUser(id);
    console.log("Loaded:", user);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to load user:", error.message);
    }
    return null;  // recover with a default value
  } finally {
    console.log("Done loading (always runs)");
  }
}

// ─── Sequential vs Parallel — critical performance difference ───
const ids = [1, 2, 3, 4, 5];

// ❌ SLOW — each await waits before starting the next (5 × 100ms = 500ms)
async function sequential() {
  const users = [];
  for (const id of ids) {
    const user = await getUser(id);  // waits 100ms before next fetch
    users.push(user);
  }
  return users;
}

// ✅ FAST — all requests start simultaneously (max 100ms total)
async function parallel() {
  const users = await Promise.all(ids.map(id => getUser(id)));
  return users;
}

// ─── async forEach TRAP ───
async function brokenForEach() {
  const results: number[] = [];
  [1, 2, 3].forEach(async (n) => {
    const result = await Promise.resolve(n * 2);
    results.push(result);
  });
  // forEach doesn't await async callbacks — results is [] here!
  console.log(results); // [] ← bug!
}

// ─── Fix 1: for...of loop ───
async function withForOf() {
  const results: number[] = [];
  for (const n of [1, 2, 3]) {
    results.push(await Promise.resolve(n * 2));
  }
  return results;  // [2, 4, 6] ✅
}

// ─── Fix 2: Promise.all + map (parallel) ───
async function withPromiseAll() {
  return await Promise.all([1, 2, 3].map(n => Promise.resolve(n * 2)));
  // [2, 4, 6] ✅ — faster, all run concurrently
}

// ─── Top-level await (ES module) ───
// const config = await fetch("/api/config").then(r => r.json());
// console.log(config); // works without wrapping in async IIFE`,
        language: "typescript",
        output: `ASYNC/AWAIT IS PROMISE SUGAR
═══════════════════════════════════════════════════
  // async function desugars to:
  async function getUser(id) {
    const res = await fetch(url);
    return res.json();
  }

  // Equivalent promise chain:
  function getUser(id) {
    return fetch(url).then(res => res.json());
  }

  Both return a Promise — identical semantics.

SEQUENTIAL vs PARALLEL TIMING
═══════════════════════════════════════════════════
  5 requests, each takes 100ms:

  Sequential (for...of + await):
  ─── req1 ──── req2 ──── req3 ──── req4 ──── req5 ──→
  Total: 500ms  ❌

  Parallel (Promise.all):
  ─── req1 ─┐
  ─── req2 ─┤
  ─── req3 ─┼── all complete ──→
  ─── req4 ─┤
  ─── req5 ─┘
  Total: 100ms  ✅ (5× faster)

ASYNC FOREACH TRAP
═══════════════════════════════════════════════════
  [1,2,3].forEach(async n => {
    await doWork(n);       // callback IS async
  });                      // but forEach doesn't await it!
  // ← forEach returns synchronously, work still pending

  Fix: for...of (sequential) or Promise.all + .map (parallel)

ERROR HANDLING
═══════════════════════════════════════════════════
  try/catch catches:  ✅ await rejections
                      ✅ synchronous throws
                      ✅ errors thrown after another await
  .catch():           handles rejections only from promise chain`,
      },
    ],
  },
};

export const jsAsync: TopicNode = {
  id: "js-async",
  title: "Asynchronous JavaScript",
  iconName: "Clock",
  link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous",
  theory:
    "JavaScript runs on a single thread, yet handles thousands of concurrent network requests, timers, and I/O operations. The event loop, promises, and async/await are the three interlocking mechanisms that make this possible.",
  theoryDetail: {
    keyConcepts: [
      "Single thread + event loop: synchronous code runs first, then microtasks (promises), then macrotasks (setTimeout)",
      "Promises represent eventual values — chainable, composable, and the foundation of async/await",
      "async/await: syntactic sugar over promises — reads synchronously, executes asynchronously",
      "Promise.all for parallel, for...of + await for sequential — choose based on dependency",
    ],
    whyItMatters:
      "Every API call, database query, file read, and user interaction is asynchronous. Misusing async patterns is the most common source of race conditions, UI freezes, and performance regressions.",
    commonPitfalls: [
      "Sequential awaits in a loop when requests are independent — always costs N × latency instead of max-latency",
      "async forEach not awaiting callbacks — use for...of or Promise.all + map",
      "Missing .catch() or try/catch — unhandled rejections silently swallow errors",
    ],
  },
  children: [eventLoop, promises, asyncAwait],
};
