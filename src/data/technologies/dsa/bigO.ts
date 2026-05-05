import type { TopicNode } from "@/data/types";

const whatIsBigO: TopicNode = {
  id: "dsa-what-is-bigo",
  title: "What is Big O Notation?",
  iconName: "FunctionSquare",
  link: "https://en.wikipedia.org/wiki/Big_O_notation",
  theory:
    "Big O notation describes how the runtime or memory usage of an algorithm grows relative to the size of its input (n). It expresses the worst-case upper bound — ignoring constants and low-order terms to focus on the dominant growth factor.",
  theoryDetail: {
    keyConcepts: [
      "Big O describes growth rate, not exact time — O(n) doesn't mean 'takes n milliseconds'",
      "Drop constants: O(2n) → O(n). Drop lower-order terms: O(n² + n) → O(n²)",
      "Worst case is the default: O(n) for linear search means n comparisons in the worst case (element not found)",
      "n = input size — could be array length, string length, number of nodes, etc.",
      "Big Ω (Omega) = best case, Big Θ (Theta) = tight bound — but Big O is used in practice for worst case",
    ],
    whyItMatters:
      "An O(n²) algorithm that works fine on 1,000 items will take 1,000,000 operations on 1,000,000 items. Big O lets you predict whether your solution will scale before you hit production with millions of users.",
    commonPitfalls: [
      "Confusing Big O with actual runtime — O(n log n) quicksort can be slower than O(n²) insertion sort on tiny arrays due to constants",
      "Nested loops always = O(n²) — only true if both loops iterate over n; inner loop iterating a constant means O(n)",
      "Forgetting hidden complexity — methods like .sort(), .includes(), and .slice() have their own Big O costs",
    ],
    examples: [
      {
        title: "Identifying complexity from code shape",
        description:
          "You can determine Big O by examining the loop structure and recursive calls without running the code.",
        code: `// ─── O(1) — Constant: doesn't depend on n ───
function getFirst(arr: number[]): number {
  return arr[0];              // always 1 operation, regardless of arr size
}

// ─── O(log n) — Logarithmic: halves problem each step ───
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;  // discard left half
    else                   hi = mid - 1;  // discard right half
  }
  return -1;
}

// ─── O(n) — Linear: one pass through the input ───
function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {   // n iterations
    if (arr[i] === target) return i;
  }
  return -1;
}

// ─── O(n log n) — Linearithmic: split + linear merge ───
// → Merge sort, Heap sort, most efficient comparison sorts

// ─── O(n²) — Quadratic: nested loops over n ───
function bubbleSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {       // n iterations
    for (let j = 0; j < arr.length - i - 1; j++) { // n iterations
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}

// ─── O(2ⁿ) — Exponential: doubles each step ───
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // 2 recursive calls each time
}

// ─── O(n!) — Factorial: all permutations ───
function permutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((val, i) =>
    permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [val, ...p])
  );
}`,
        language: "typescript",
        output: `BIG O COMPLEXITY LADDER
═══════════════════════════════════════════════════

  Notation    Name            n=10      n=100      n=1,000     n=1,000,000
  ──────────────────────────────────────────────────────────────────────────
  O(1)        Constant             1          1           1               1
  O(log n)    Logarithmic          3          7          10              20
  O(n)        Linear              10        100       1,000       1,000,000
  O(n log n)  Linearithmic        33        664      10,000      20,000,000
  O(n²)       Quadratic          100     10,000   1,000,000   10¹²  (slow!)
  O(2ⁿ)       Exponential      1,024   1.27×10³⁰  (impossible)
  O(n!)       Factorial    3,628,800   (impossible at n=13+)

GROWTH RATE VISUAL (n = 100)
═══════════════════════════════════════════════════
  O(1)       ▌                                     1 op
  O(log n)   ███▌                                  7 ops
  O(n)       ███████████████████▌                100 ops
  O(n log n) █████████████████████████████▌      664 ops
  O(n²)      ███████████████████████████████   10,000 ops (much wider)

RULES FOR DROPPING TERMS
═══════════════════════════════════════════════════
  O(2n + 50)        → O(n)      (drop constant 2, drop +50)
  O(n² + n + 100)   → O(n²)    (n dominates n and 100)
  O(n + m)          → O(n + m)  (two different inputs — keep both)
  O(n * m)          → O(n * m)  (two different inputs — keep both)`,
      },
    ],
  },
};

const timeComplexityPatterns: TopicNode = {
  id: "dsa-time-complexity",
  title: "Common Complexity Patterns",
  iconName: "Timer",
  link: "https://www.bigocheatsheet.com/",
  theory:
    "Certain code patterns reliably map to specific Big O classes. Recognising these patterns lets you analyse any algorithm in seconds — without running it or doing math.",
  theoryDetail: {
    keyConcepts: [
      "Single loop → O(n); nested loops (both over n) → O(n²); triple nested → O(n³)",
      "Divide-and-conquer with O(n) merge step → O(n log n)",
      "Halving the input each step → O(log n) — regardless of whether it's a loop or recursion",
      "Two separate (non-nested) loops → O(n + m) or O(n) — NOT O(n²)",
      "Hash table lookup/insert/delete is O(1) average — not O(n)",
    ],
    whyItMatters:
      "When asked 'what is the time complexity?' in an interview, you need to identify the pattern from the code shape. Practising pattern recognition is faster than working through mathematical proofs.",
    commonPitfalls: [
      "Counting O(n) for two sequential O(n) loops as O(2n) — simplify to O(n)",
      "Missing that .indexOf(), .includes(), or .filter() inside a loop adds a hidden O(n) factor → O(n²) total",
      "Assuming recursion depth = time complexity — a recursive function calling itself once per level is O(n), not O(2ⁿ)",
    ],
    examples: [
      {
        title: "Pattern recognition cheat sheet",
        description: "Map code structure to Big O in one glance.",
        code: `// ─── Pattern 1: Two separate loops → O(n) ───
function twoLoops(arr: number[]): void {
  for (const x of arr) console.log(x);   // O(n)
  for (const x of arr) console.log(x);   // O(n)
  // Total: O(n) + O(n) = O(2n) → O(n) — NOT O(n²)
}

// ─── Pattern 2: Nested loops, inner is constant → O(n) ───
function nestedConstant(arr: number[]): void {
  for (const x of arr) {                 // O(n)
    for (let i = 0; i < 100; i++) {      // O(100) = O(1)
      console.log(x, i);
    }
  }
  // Total: O(n × 100) = O(100n) → O(n)
}

// ─── Pattern 3: Inner loop shrinks → O(n²) still ───
function halfInner(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {           // n
    for (let j = i + 1; j < arr.length; j++) {     // n/2 on average
      console.log(arr[i], arr[j]);
    }
  }
  // n × n/2 = n²/2 → O(n²) (constants dropped)
}

// ─── Pattern 4: Halving → O(log n) ───
function halvingLoop(n: number): void {
  while (n > 1) {
    console.log(n);
    n = Math.floor(n / 2);    // halves each iteration
  }
  // Runs log₂(n) times → O(log n)
}

// ─── Pattern 5: Hidden O(n) inside loop → O(n²) ───
function hiddenQuadratic(arr: number[]): boolean[] {
  return arr.map(x =>
    arr.includes(x * 2)   // .includes() is O(n) — runs n times → O(n²) total
  );
}

// ─── Fix: use a Set for O(1) lookup → O(n) total ───
function linearFix(arr: number[]): boolean[] {
  const set = new Set(arr);             // O(n) — one pass
  return arr.map(x => set.has(x * 2)); // O(1) per lookup → O(n) total
}`,
        language: "typescript",
        output: `PATTERN → COMPLEXITY MAPPING
═══════════════════════════════════════════════════

  Code Pattern                           Complexity
  ──────────────────────────────────────────────────
  Single loop over n                     O(n)
  Two sequential loops over n            O(n)    ← NOT O(n²)
  Nested loop (both over n)              O(n²)
  Nested loop (inner constant)           O(n)
  Nested loop (inner shrinks by 1)       O(n²)   ← still quadratic
  Divide input in half each step         O(log n)
  Loop + recursive halving               O(n log n)
  Two recursive calls each step          O(2ⁿ)
  .includes() / .indexOf() inside loop   O(n²)   ← hidden cost!
  Set.has() / Map.get() inside loop      O(n)    ← fix it

BEFORE/AFTER: array duplicates
═══════════════════════════════════════════════════
  // BAD — O(n²): .includes() loops through arr for every element
  const hasDuplicate = (arr) => arr.some((x, i) => arr.includes(x, i + 1));

  // GOOD — O(n): Set lookup is O(1)
  const hasDuplicate = (arr) => new Set(arr).size !== arr.length;

  n = 10:      both run instantly
  n = 10,000:  bad: ~50M ops | good: ~10K ops
  n = 1,000,000: bad: crashes browser | good: 200ms`,
      },
    ],
  },
};

const spaceComplexity: TopicNode = {
  id: "dsa-space-complexity",
  title: "Space Complexity & Amortized Analysis",
  iconName: "HardDrive",
  link: "https://en.wikipedia.org/wiki/Space_complexity",
  theory:
    "Space complexity measures the extra memory an algorithm uses as input size grows — not counting the input itself (auxiliary space). Amortized analysis averages the cost of occasional expensive operations across many cheap ones.",
  theoryDetail: {
    keyConcepts: [
      "Auxiliary space only: input array of n elements doesn't count — only extra memory allocated counts",
      "In-place algorithms (O(1) space): bubble sort, insertion sort — modify input without extra allocation",
      "Call stack counts as space: a recursion depth of n uses O(n) stack space",
      "Amortized O(1): array .push() is usually O(1) but occasionally O(n) when the array doubles — amortized over n pushes it averages O(1)",
      "Trade-off: O(n) time + O(1) space OR O(n) space + O(1) time (caching) — memoization trades space for time",
    ],
    whyItMatters:
      "A solution with O(n²) time but O(1) space may be preferable to O(n log n) time with O(n) space in a memory-constrained environment. Space-time trade-offs are a core interview and system design topic.",
    commonPitfalls: [
      "Forgetting recursion stack space — a naive recursive fibonacci has O(n) space complexity",
      "Assuming a new array creation is 'free' — every slice(), map(), or filter() allocates O(n) memory",
      "Not knowing that tail-call optimization (TCO) eliminates stack growth — TypeScript/Node doesn't reliably support TCO",
    ],
    examples: [
      {
        title: "Space complexity in practice",
        description: "Compare in-place vs out-of-place algorithms and measure recursion stack depth.",
        code: `// ─── O(1) Space — in-place reverse ───
function reverseInPlace(arr: number[]): void {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    [arr[lo], arr[hi]] = [arr[hi], arr[lo]];  // swap without extra array
    lo++; hi--;
  }
  // Extra memory: just 2 index variables → O(1)
}

// ─── O(n) Space — out-of-place reverse ───
function reverseOutOfPlace(arr: number[]): number[] {
  return [...arr].reverse(); // allocates new array of size n → O(n)
}

// ─── O(n) Space from recursion stack ───
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // n frames on the call stack → O(n) space
}

// ─── O(1) Space — iterative equivalent ───
function factorialIterative(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;  // O(1) space
  return result;
}

// ─── Amortized O(1) — dynamic array push ───
class DynamicArray<T> {
  private data: T[] = [];
  private capacity = 1;
  private length = 0;

  push(item: T): void {
    if (this.length === this.capacity) {
      // Resize: copy all n elements to new array → O(n) — but rare
      this.data = [...this.data, ...new Array(this.capacity)];
      this.capacity *= 2;
    }
    this.data[this.length++] = item;  // usually O(1)
  }
  // Amortized: n pushes trigger log₂(n) resizes, total work = n + n/2 + n/4 + ... = 2n → O(1) amortized
}

// ─── Memoization: trade O(n) space for O(n) time ───
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;   // O(1) lookup
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);                    // cache result
  return result;
  // Time: O(n) — each subproblem solved once
  // Space: O(n) — memo Map + O(n) recursion depth
}`,
        language: "typescript",
        output: `SPACE COMPLEXITY SUMMARY
═══════════════════════════════════════════════════

  Algorithm               Time      Space    Notes
  ──────────────────────────────────────────────────────────────
  reverseInPlace()        O(n)      O(1)     modifies input array
  reverseOutOfPlace()     O(n)      O(n)     creates new array
  factorial (recursive)   O(n)      O(n)     n stack frames
  factorial (iterative)   O(n)      O(1)     single loop variable
  fibMemo()               O(n)      O(n)     memo + call stack
  fibNaive()              O(2ⁿ)     O(n)     O(n) max stack depth at once
  bubbleSort              O(n²)     O(1)     in-place swaps
  mergeSort               O(n log n) O(n)    auxiliary merge arrays
  quickSort (in-place)    O(n log n) O(log n) recursion stack depth

AMORTIZED ANALYSIS — Dynamic Array Push
═══════════════════════════════════════════════════
  Push 1:  capacity=1 → push  (O(1))
  Push 2:  resize to 2, copy 1 (O(1)), push (O(1))
  Push 3:  resize to 4, copy 2 (O(2)), push (O(1))
  Push 5:  resize to 8, copy 4 (O(4)), push (O(1))
  Push 9:  resize to 16, copy 8 (O(8)), push (O(1))

  Total cost for n pushes = n + n/2 + n/4 + ... ≤ 2n = O(n)
  Per push (amortized): O(n) / n = O(1) ✅

MEMO TRADE-OFF (fibonacci n=40)
═══════════════════════════════════════════════════
  fibNaive(40):   ~2 billion recursive calls  (too slow)
  fibMemo(40):    41 unique subproblems       (instant)
  fibIterative:   40 loop iterations, O(1) space (best)`,
      },
    ],
  },
};

export const dsaBigO: TopicNode = {
  id: "dsa-big-o",
  title: "Big O Notation",
  iconName: "TrendingUp",
  link: "https://www.bigocheatsheet.com/",
  theory:
    "Big O notation is the universal language for describing algorithm efficiency. It quantifies how runtime and memory scale as input size grows — the essential tool for choosing the right algorithm and spotting bottlenecks.",
  theoryDetail: {
    keyConcepts: [
      "Big O = worst-case growth rate of time or space, dropping constants and lower-order terms",
      "The complexity ladder: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)",
      "Space complexity measures auxiliary memory — not the input itself",
      "Amortized analysis averages occasional expensive operations over many cheap ones",
    ],
    whyItMatters:
      "Big O is asked in every technical interview and is essential for writing scalable code. An O(n²) solution on 10 records is fine; on 10 million records it will bring your server to its knees.",
    commonPitfalls: [
      "Confusing O notation with actual milliseconds — Big O is relative, not absolute",
      "Missing hidden O(n) costs inside library methods (.includes, .indexOf, .filter)",
    ],
  },
  children: [whatIsBigO, timeComplexityPatterns, spaceComplexity],
};
