import type { TopicNode } from "@/data/types";

const sorting: TopicNode = {
  id: "dsa-sorting",
  title: "Sorting Algorithms",
  iconName: "ArrowUpDown",
  link: "https://en.wikipedia.org/wiki/Sorting_algorithm",
  theory:
    "Sorting arranges elements in a defined order. Each sorting algorithm makes different trade-offs between time complexity, space complexity, stability, and suitability for different data sizes. Understanding when to use each is key.",
  theoryDetail: {
    keyConcepts: [
      "Stable sort: equal elements maintain their original relative order (Merge sort is stable; Quick sort typically isn't)",
      "In-place sort: O(1) auxiliary space — doesn't allocate extra arrays (Bubble, Insertion, Quick)",
      "Comparison sort lower bound: O(n log n) — provably cannot sort n elements faster with comparisons alone",
      "Non-comparison sorts (Counting, Radix, Bucket) can achieve O(n) for specific data types",
      "JavaScript's Array.sort() uses TimSort (hybrid merge+insertion) — O(n log n), stable in modern engines",
    ],
    whyItMatters:
      "Merge sort and quick sort form the basis of standard library sorts. Understanding them helps you customise sorting (comparator functions), debug sort bugs, and recognise when built-in sort is the wrong tool (e.g., nearly-sorted data favours insertion sort).",
    commonPitfalls: [
      "JS Array.sort() sorts lexicographically by default: [10, 2, 30].sort() → [10, 2, 30] not [2, 10, 30]",
      "Quick sort worst case O(n²) on already-sorted arrays with naive pivot — real implementations use random pivot",
      "Bubble sort is never the right answer in production — only useful for teaching swap mechanics",
    ],
    examples: [
      {
        title: "Bubble, Merge, and Quick sort with step traces",
        description:
          "Three fundamental sorting algorithms with annotated implementations and complexity analysis.",
        code: `// ─── Bubble Sort — O(n²) time, O(1) space ───
// Repeatedly swaps adjacent out-of-order elements
function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;  // early exit if already sorted
  }
  return a;
}

// ─── Merge Sort — O(n log n) time, O(n) space, stable ───
// Divide: split into halves recursively
// Conquer: merge two sorted halves into one sorted array
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));  // sort left half
  const right = mergeSort(arr.slice(mid));     // sort right half
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) result.push(left[l++]);  // stable: ≤ not <
    else                     result.push(right[r++]);
  }
  return [...result, ...left.slice(l), ...right.slice(r)];
}

// ─── Quick Sort — O(n log n) avg, O(n²) worst, O(log n) space ───
// Pick a pivot, partition into < pivot and > pivot, recurse
function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {
  if (lo < hi) {
    const pivotIdx = partition(arr, lo, hi);
    quickSort(arr, lo, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, hi);
  }
  return arr;
}

function partition(arr: number[], lo: number, hi: number): number {
  // Random pivot swap to avoid O(n²) on sorted input
  const randIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[randIdx], arr[hi]] = [arr[hi], arr[randIdx]];
  const pivot = arr[hi];
  let i = lo - 1;  // index of smaller element

  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];  // place pivot
  return i + 1;
}

// ─── JavaScript built-in sort — always provide a comparator! ───
const nums = [10, 2, 30, 4, 15];
const sorted = [...nums].sort((a, b) => a - b);  // ascending
const desc   = [...nums].sort((a, b) => b - a);  // descending

console.log("Bubble sort:", bubbleSort([64, 34, 25, 12, 22]));
console.log("Merge sort:", mergeSort([38, 27, 43, 3, 9, 82, 10]));
console.log("Quick sort:", quickSort([...nums]));`,
        language: "typescript",
        output: `SORTING ALGORITHM COMPARISON
═══════════════════════════════════════════════════
  Algorithm      Time (best) Time (avg)  Time (worst)  Space  Stable?
  ──────────────────────────────────────────────────────────────────────
  Bubble Sort    O(n)        O(n²)       O(n²)         O(1)   Yes
  Selection Sort O(n²)       O(n²)       O(n²)         O(1)   No
  Insertion Sort O(n)        O(n²)       O(n²)         O(1)   Yes
  Merge Sort     O(n log n)  O(n log n)  O(n log n)    O(n)   Yes ✅
  Quick Sort     O(n log n)  O(n log n)  O(n²)*        O(log n) No
  Heap Sort      O(n log n)  O(n log n)  O(n log n)    O(1)   No
  Counting Sort  O(n+k)      O(n+k)      O(n+k)        O(k)   Yes

  * O(n²) worst case avoided with random pivot in practice

BUBBLE SORT TRACE: [64, 34, 25, 12, 22]
═══════════════════════════════════════════════════
  Pass 1: [34, 25, 12, 22, 64]  (64 bubbled to end)
  Pass 2: [25, 12, 22, 34, 64]  (34 in place)
  Pass 3: [12, 22, 25, 34, 64]  (25 in place)
  Pass 4: [12, 22, 25, 34, 64]  (no swaps → done)
  Result: [12, 22, 25, 34, 64] ✅

MERGE SORT TRACE: [38, 27, 43, 3]
═══════════════════════════════════════════════════
  Split: [38, 27]  [43, 3]
  Split: [38][27]  [43][3]
  Merge: [27, 38]  [3, 43]
  Merge: [3, 27, 38, 43] ✅

QUICK SORT — PARTITION STEP on [3, 6, 8, 10, 1, 2, 1]
═══════════════════════════════════════════════════
  pivot = 1 (last element)
  i=-1, j scans left to right:
    j=0: 3>1 skip
    j=1: 6>1 skip
    j=5: 2>1 skip
    j=6: 1≤1 → swap arr[0]↔arr[0], i=0
  Place pivot: swap arr[1]↔arr[6]
  [1, 1, 8, 10, 6, 2, 3]  ← left of idx 1 ≤ 1, right ≥ 1`,
      },
    ],
  },
};

const binarySearch: TopicNode = {
  id: "dsa-binary-search",
  title: "Binary Search",
  iconName: "Search",
  link: "https://en.wikipedia.org/wiki/Binary_search_algorithm",
  theory:
    "Binary search finds a target in a sorted collection by halving the search space each step — achieving O(log n) instead of O(n) linear search. The key insight: eliminating half the possibilities each time leads to logarithmic growth.",
  theoryDetail: {
    keyConcepts: [
      "Requires sorted input — or a monotonic condition (answers form a yes/no pattern without gaps)",
      "Each step eliminates half the remaining candidates: 1 billion elements → 30 steps",
      "Template: maintain [lo, hi] closed interval; find mid = (lo+hi)>>1; adjust boundary based on condition",
      "Left bisect: find first position where condition is true",
      "Right bisect: find last position where condition is true",
    ],
    whyItMatters:
      "Binary search is O(log n) where linear search is O(n) — a trillion-to-30 speedup at n=1 billion. It also applies to non-obvious problems: 'find minimum in rotated array', 'search in infinite sorted list', 'smallest number with property X'.",
    commonPitfalls: [
      "Integer overflow: (lo + hi) can overflow in languages with fixed int size — use lo + (hi-lo)/2",
      "Infinite loop: if lo or hi doesn't change, the loop runs forever — ensure mid always moves a boundary",
      "Off-by-one in boundary: whether to use lo <= hi or lo < hi depends on whether mid is a valid candidate",
    ],
    examples: [
      {
        title: "Classic binary search and the universal template",
        description:
          "Standard binary search plus the generalised template for monotonic condition problems.",
        code: `// ─── Classic binary search — O(log n) ───
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);  // avoids integer overflow
    if      (arr[mid] === target) return mid;
    else if (arr[mid] < target)  lo = mid + 1;  // target in right half
    else                         hi = mid - 1;  // target in left half
  }
  return -1;  // not found
}

// ─── Find first and last occurrence — O(log n) ───
function searchRange(arr: number[], target: number): [number, number] {
  // Left bisect: find first index where arr[mid] >= target
  const leftBound = (): number => {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else                   hi = mid;      // mid could be the answer, keep it
    }
    return arr[lo] === target ? lo : -1;
  };

  // Right bisect: find last index where arr[mid] <= target
  const rightBound = (): number => {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] <= target) lo = mid + 1;
      else                    hi = mid;
    }
    return arr[lo - 1] === target ? lo - 1 : -1;
  };

  return [leftBound(), rightBound()];
}

// ─── Search in rotated sorted array — O(log n) ───
// [4, 5, 6, 7, 0, 1, 2] — rotated at index 4
function searchRotated(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;

    // Determine which half is sorted
    if (arr[lo] <= arr[mid]) {             // left half is sorted
      if (target >= arr[lo] && target < arr[mid]) hi = mid - 1;
      else                                        lo = mid + 1;
    } else {                               // right half is sorted
      if (target > arr[mid] && target <= arr[hi]) lo = mid + 1;
      else                                        hi = mid - 1;
    }
  }
  return -1;
}

// ─── Binary search on answer space — O(log(max) × n) ───
// "Find minimum capacity to ship packages within D days"
function shipWithinDays(weights: number[], D: number): number {
  let lo = Math.max(...weights);   // minimum: heaviest single package
  let hi = weights.reduce((a, b) => a + b, 0); // maximum: all at once

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    // Can we ship all packages in D days with capacity mid?
    let days = 1, currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > mid) { days++; currentLoad = 0; }
      currentLoad += w;
    }
    if (days <= D) hi = mid;  // capacity mid works, try smaller
    else           lo = mid + 1; // not enough, increase capacity
  }
  return lo;
}`,
        language: "typescript",
        output: `BINARY SEARCH: why O(log n)?
═══════════════════════════════════════════════════
  n elements. Each step halves the search space:
  Step 1: n/2 candidates
  Step 2: n/4 candidates
  Step k: n/2^k candidates
  Stops when n/2^k = 1  →  k = log₂(n)

  n=1,024    → 10 steps
  n=1M       → 20 steps
  n=1B       → 30 steps
  n=1T       → 40 steps  ← linear search: 1,000,000,000,000 steps

CLASSIC TRACE: arr=[1,3,5,7,9,11,13], target=7
═══════════════════════════════════════════════════
  lo=0, hi=6 → mid=3, arr[3]=7 === 7 → return 3 ✅  (found in 1 step!)

FIND RANGE: arr=[5,7,7,8,8,10], target=8
═══════════════════════════════════════════════════
  Left bisect:  lo=0,hi=6 → mid=2(7)<8→lo=3
                lo=3,hi=6 → mid=4(8)≥8→hi=4
                lo=4,hi=4 → mid=4(8)≥8→hi=4
                lo=4,hi=4 → exit, arr[4]=8 → first=4 ✅
  Right bisect: finds last at index 4 → range=[3,4] ✅

BINARY SEARCH ON ANSWER SPACE
═══════════════════════════════════════════════════
  Instead of searching in an array, search in the
  range of possible answers [lo..hi]:
  - Define what "feasible" means for a given answer
  - If mid is feasible → maybe go smaller (hi=mid)
  - If mid is not feasible → go larger (lo=mid+1)
  Converges in O(log(hi-lo)) iterations
  Each iteration costs O(n) check → total O(n log(range))`,
      },
    ],
  },
};

const recursionDp: TopicNode = {
  id: "dsa-recursion-dp",
  title: "Recursion & Dynamic Programming",
  iconName: "RefreshCw",
  link: "https://en.wikipedia.org/wiki/Dynamic_programming",
  theory:
    "Recursion solves problems by breaking them into sub-problems of the same kind. Dynamic Programming (DP) extends this by storing sub-problem results (memoization/tabulation) to avoid redundant computation — turning O(2ⁿ) into O(n).",
  theoryDetail: {
    keyConcepts: [
      "Base case: the simplest sub-problem that doesn't recurse — without it, you get infinite recursion",
      "Optimal substructure: the optimal solution to the whole contains optimal solutions to sub-problems",
      "Overlapping sub-problems: the same sub-problem is solved multiple times — DP caches these results",
      "Top-down (memoization): recursive + cache. Bottom-up (tabulation): iterative, fill a table from base cases up",
      "State definition: what information uniquely identifies a sub-problem — usually the key to DP design",
    ],
    whyItMatters:
      "DP is one of the most common interview topics at top companies. Problems like Fibonacci, coin change, longest common subsequence, and knapsack all have brute-force exponential solutions that DP makes polynomial.",
    commonPitfalls: [
      "Missing the base case — results in stack overflow or wrong answers",
      "Incorrect state definition — if two different situations map to the same state, the cache gives wrong results",
      "Not recognising when DP applies: look for 'maximum/minimum', 'how many ways', 'is it possible' with overlapping sub-problems",
    ],
    examples: [
      {
        title: "Fibonacci: brute force → memoization → tabulation → optimised",
        description: "Four implementations showing the evolution from O(2ⁿ) to O(n) to O(1) space.",
        code: `// ─── 1. Brute Force Recursion — O(2ⁿ) time, O(n) space ───
function fibBrute(n: number): number {
  if (n <= 1) return n;                       // base case
  return fibBrute(n - 1) + fibBrute(n - 2);  // two branches per call
}
// fibBrute(6): 25 function calls
// fibBrute(40): ~2.7 billion calls (very slow)

// ─── 2. Top-Down Memoization — O(n) time, O(n) space ───
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;       // cache hit
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);                        // cache result
  return result;
}
// fibMemo(40): 41 unique sub-problems, each solved once

// ─── 3. Bottom-Up Tabulation — O(n) time, O(n) space ───
function fibTab(n: number): number {
  if (n <= 1) return n;
  const dp = [0, 1];                          // base cases
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];           // build up from base
  }
  return dp[n];
}

// ─── 4. Space-Optimised — O(n) time, O(1) space ───
function fibOptimal(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
  // Only need last 2 values — drop the array entirely
}

// ─── Classic DP: Coin Change ───
// Minimum coins to make 'amount'. Denominations in 'coins'
// O(amount × coins.length) time, O(amount) space
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;  // base case: 0 coins to make amount 0

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        // If we use this coin, we need 1 + dp[a-coin] coins
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ─── Classic DP: Climbing Stairs ───
// How many ways to climb n stairs (1 or 2 steps at a time)?
// Same as Fibonacci! dp[n] = dp[n-1] + dp[n-2]
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) { [a, b] = [b, a + b]; }
  return b;
}`,
        language: "typescript",
        output: `FIBONACCI EVOLUTION
═══════════════════════════════════════════════════
  Implementation  n=10  n=40        Time      Space
  ──────────────────────────────────────────────────────
  fibBrute        55    102334155   O(2ⁿ)     O(n)
  fibMemo         55    102334155   O(n)      O(n)
  fibTab          55    102334155   O(n)      O(n)
  fibOptimal      55    102334155   O(n)      O(1) ✅

RECURSION TREE for fibBrute(5) — shows overlap
═══════════════════════════════════════════════════
                 fib(5)
               /       \\
           fib(4)      fib(3)
          /     \\     /     \\
       fib(3) fib(2) fib(2) fib(1)
       / \\
    fib(2) fib(1)

  fib(3) computed 2 times → cache eliminates duplicate work

COIN CHANGE DP TABLE: coins=[1,2,5], amount=11
═══════════════════════════════════════════════════
  amount:  0  1  2  3  4  5  6  7  8  9  10  11
  dp:      0  1  1  2  2  1  2  2  3  3   2   3
  Answer: 3 coins (5+5+1) ✅

  State: dp[a] = minimum coins to make amount a
  Recurrence: dp[a] = min(dp[a - coin] + 1) for each coin ≤ a
  Base case: dp[0] = 0

CLIMBING STAIRS: n=5
═══════════════════════════════════════════════════
  n=1: 1 way  (1)
  n=2: 2 ways (1+1, 2)
  n=3: 3 ways (1+1+1, 1+2, 2+1)
  n=4: 5 ways
  n=5: 8 ways  ← same as Fibonacci(n+1)!`,
      },
    ],
  },
};

export const dsaAlgorithms: TopicNode = {
  id: "dsa-algorithms",
  title: "Core Algorithms",
  iconName: "Zap",
  link: "https://en.wikipedia.org/wiki/Algorithm",
  theory:
    "Algorithms are step-by-step procedures for solving problems. The four fundamental algorithm families — sorting, binary search, recursion, and dynamic programming — appear in almost every technical interview and underlie production systems at scale.",
  theoryDetail: {
    keyConcepts: [
      "Sorting: transforms unordered data into ordered data — enables binary search and many optimisations",
      "Binary search: eliminates half the search space each step — O(log n) in sorted or monotonic contexts",
      "Recursion: breaks problems into identical smaller sub-problems — natural for trees and divide-and-conquer",
      "Dynamic programming: caches recursive sub-problem results to avoid recomputation — turns O(2ⁿ) into O(n)",
    ],
    whyItMatters:
      "These four families solve the majority of coding interview problems. Recognising which family applies — and why — is the core skill tested in technical interviews.",
    commonPitfalls: [
      "Using bubble sort when the problem has no constraints on algorithm choice — always prefer merge/quick sort",
      "Jumping to DP before trying recursion — DP is an optimisation of recursion, understand the recursion first",
    ],
  },
  children: [sorting, binarySearch, recursionDp],
};
