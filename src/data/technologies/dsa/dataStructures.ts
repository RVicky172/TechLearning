import type { TopicNode } from "@/data/types";

const arrays: TopicNode = {
  id: "dsa-arrays",
  title: "Arrays",
  iconName: "List",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
  theory:
    "An array stores elements in contiguous memory locations, giving O(1) indexed access by position. It is the most fundamental data structure — the backbone of most other structures.",
  theoryDetail: {
    keyConcepts: [
      "Contiguous memory: elements are stored side-by-side — arr[i] = base address + i × element size",
      "O(1) random access: any index can be read or written in constant time",
      "Static vs dynamic: static arrays have fixed size; dynamic arrays (JS Array) resize by doubling capacity",
      "O(n) insert/delete at middle: all elements after the target must shift",
      "Cache friendly: sequential memory access is optimal for CPU cache lines",
    ],
    whyItMatters:
      "Arrays are the building block of every other data structure. Understanding their trade-offs — fast access, slow insert/delete in the middle — is the first step to choosing the right structure.",
    commonPitfalls: [
      "Off-by-one errors: arr.length - 1 is the last index, not arr.length",
      "Using .splice() or .unshift() in a loop — each is O(n), making the loop O(n²)",
      "Mutating an array while iterating over it — leads to skipped elements or infinite loops",
    ],
    examples: [
      {
        title: "Array operations and their Big O",
        description: "Implementing common array operations with explicit complexity annotations.",
        code: `const arr: number[] = [10, 20, 30, 40, 50];

// O(1) — Access by index
const third = arr[2];                    // 30

// O(1) amortized — Append to end
arr.push(60);                            // [10, 20, 30, 40, 50, 60]

// O(1) — Remove from end
arr.pop();                               // [10, 20, 30, 40, 50]

// O(n) — Insert at beginning (all elements shift right)
arr.unshift(0);                          // [0, 10, 20, 30, 40, 50]

// O(n) — Remove from beginning (all elements shift left)
arr.shift();                             // [10, 20, 30, 40, 50]

// O(n) — Insert at middle (elements after index shift right)
arr.splice(2, 0, 25);                    // [10, 20, 25, 30, 40, 50]

// O(n) — Remove from middle (elements after index shift left)
arr.splice(2, 1);                        // [10, 20, 30, 40, 50]

// O(n) — Linear search (unsorted)
const idx = arr.indexOf(30);             // 2

// O(log n) — Binary search (sorted array only)
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;          // fast integer division by 2
    if      (arr[mid] === target) return mid;
    else if (arr[mid] < target)  lo = mid + 1;
    else                         hi = mid - 1;
  }
  return -1;
}

// O(n) — Two-pointer technique: find pair that sums to target
function twoSum(sorted: number[], target: number): [number, number] | null {
  let lo = 0, hi = sorted.length - 1;
  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if      (sum === target) return [sorted[lo], sorted[hi]];
    else if (sum < target)   lo++;
    else                     hi--;
  }
  return null;
}

// O(n) — Sliding window: max sum subarray of length k
function maxSumSubarray(arr: number[], k: number): number {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];   // slide: add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
        language: "typescript",
        output: `ARRAY BIG O SUMMARY
═══════════════════════════════════════════════════
  Operation               Time         Space
  ──────────────────────────────────────────────────
  Access by index (arr[i]) O(1)         O(1)
  Search (linear)          O(n)         O(1)
  Search (binary, sorted)  O(log n)     O(1)
  Insert/delete at end     O(1) amort.  O(1)
  Insert/delete at front   O(n)         O(1)
  Insert/delete at middle  O(n)         O(1)
  Slice / Copy             O(n)         O(n)

MEMORY LAYOUT (contiguous)
═══════════════════════════════════════════════════
  Index:   [0]   [1]   [2]   [3]   [4]
  Value:    10    20    30    40    50
  Address: 100   104   108   112   116  (4 bytes each for 32-bit int)

  arr[2] = base(100) + 2×4 = 108 → value 30  ← O(1) lookup

TWO-POINTER: find pair summing to 30 in [10,20,25,30,40,50]
═══════════════════════════════════════════════════
  lo=0(10), hi=5(50) → sum=60 > 30 → hi--
  lo=0(10), hi=4(40) → sum=50 > 30 → hi--
  lo=0(10), hi=3(30) → sum=40 > 30 → hi--
  lo=0(10), hi=2(25) → sum=35 > 30 → hi--
  lo=0(10), hi=1(20) → sum=30 ✅ → return [10, 20]`,
      },
    ],
  },
};

const linkedList: TopicNode = {
  id: "dsa-linked-list",
  title: "Linked Lists",
  iconName: "Link",
  link: "https://en.wikipedia.org/wiki/Linked_list",
  theory:
    "A linked list stores elements as nodes, each holding a value and a pointer to the next node. Unlike arrays, nodes are scattered in memory — giving O(1) insert/delete at any known position but O(n) random access.",
  theoryDetail: {
    keyConcepts: [
      "Node = value + pointer to next (singly linked) or next+prev (doubly linked)",
      "Head pointer points to first node; tail pointer to last node (optional)",
      "O(1) insert/delete at head or tail — just update the pointer, no shifting",
      "O(n) access by index — must traverse from head to reach position i",
      "No wasted capacity — memory is allocated per node, not pre-allocated in blocks",
    ],
    whyItMatters:
      "Linked lists are used in LRU caches, browser history, undo stacks, and as the basis for queues and stacks. The classic interview questions (reverse, detect cycle, find middle) test pointer manipulation.",
    commonPitfalls: [
      "Null pointer errors — always check `current !== null` before accessing `.next`",
      "Losing the list: set `next` pointer before updating `head`, not after",
      "Off-by-one in traversal: stop at `current.next !== null` to get second-to-last node",
    ],
    examples: [
      {
        title: "Singly linked list with classic interview operations",
        description:
          "Full implementation with reverse, cycle detection (Floyd's algorithm), and find-middle.",
        code: `class ListNode<T> {
  constructor(public val: T, public next: ListNode<T> | null = null) {}
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  size = 0;

  // O(1) — prepend to front
  prepend(val: T): void {
    this.head = new ListNode(val, this.head);
    this.size++;
  }

  // O(n) — append to end
  append(val: T): void {
    const node = new ListNode(val);
    if (!this.head) { this.head = node; }
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;  // walk to end
      cur.next = node;
    }
    this.size++;
  }

  // O(n) — delete first occurrence of value
  delete(val: T): void {
    if (!this.head) return;
    if (this.head.val === val) { this.head = this.head.next; this.size--; return; }
    let cur = this.head;
    while (cur.next && cur.next.val !== val) cur = cur.next;
    if (cur.next) { cur.next = cur.next.next; this.size--; }
  }

  toArray(): T[] {
    const result: T[] = [];
    let cur = this.head;
    while (cur) { result.push(cur.val); cur = cur.next; }
    return result;
  }
}

// ─── Classic: Reverse a linked list ───
// O(n) time, O(1) space — three pointer technique
function reverse<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let curr = head;
  while (curr) {
    const next = curr.next;  // save next
    curr.next = prev;        // reverse arrow
    prev = curr;             // move prev forward
    curr = next;             // move curr forward
  }
  return prev; // new head
}

// ─── Classic: Find middle node — Floyd's slow/fast pointer ───
// O(n) time, O(1) space
function findMiddle<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;       // moves 1 step
    fast = fast.next.next;   // moves 2 steps
  }
  return slow; // when fast reaches end, slow is at middle
}

// ─── Classic: Detect cycle — Floyd's cycle detection ───
// O(n) time, O(1) space
function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;  // they met → cycle exists
  }
  return false;
}`,
        language: "typescript",
        output: `LINKED LIST BIG O
═══════════════════════════════════════════════════
  Operation               Singly Linked   Array
  ──────────────────────────────────────────────────
  Access by index          O(n)            O(1)
  Insert at head           O(1)            O(n)
  Insert at tail           O(n)*           O(1) amort.
  Insert at middle         O(1)**          O(n)
  Delete at head           O(1)            O(n)
  Search                   O(n)            O(n)
  Memory per element       +pointer        compact

  * O(1) with tail pointer maintained
  ** O(n) to find the position, O(1) to do the insert

REVERSE TRACE: 1 → 2 → 3 → 4 → null
═══════════════════════════════════════════════════
  Initial:  prev=null  curr=1 → 2 → 3 → 4
  Step 1:   prev=1     curr=2,  1 → null
  Step 2:   prev=2     curr=3,  2 → 1 → null
  Step 3:   prev=3     curr=4,  3 → 2 → 1 → null
  Step 4:   prev=4     curr=null, 4 → 3 → 2 → 1 → null
  Result:   4 → 3 → 2 → 1 → null ✅

FIND MIDDLE TRACE: 1 → 2 → 3 → 4 → 5
═══════════════════════════════════════════════════
  Start:  slow=1, fast=1
  Step 1: slow=2, fast=3
  Step 2: slow=3, fast=5
  fast.next=null → stop. Middle = node(3) ✅

CYCLE DETECTION (Floyd's)
═══════════════════════════════════════════════════
  If cycle exists: fast gains 1 step on slow per iteration.
  In a cycle of length C, they meet after at most C steps.
  Why O(1) space: no visited set needed — just two pointers.`,
      },
    ],
  },
};

const stacksQueues: TopicNode = {
  id: "dsa-stacks-queues",
  title: "Stacks & Queues",
  iconName: "Layers",
  link: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)",
  theory:
    "A stack (LIFO — Last In, First Out) and a queue (FIFO — First In, First Out) are abstract data types that restrict access to a linear collection. Both offer O(1) insert and delete at their respective access points.",
  theoryDetail: {
    keyConcepts: [
      "Stack: push (add top), pop (remove top), peek (view top) — all O(1)",
      "Queue: enqueue (add rear), dequeue (remove front), peek (view front) — all O(1)",
      "Implemented with arrays or linked lists underneath; linked list avoids resize cost",
      "Monotonic stack: maintains sorted order of elements — used in next-greater-element problems",
      "Deque (double-ended queue): insert/remove from both ends — generalisation of stack and queue",
    ],
    whyItMatters:
      "Stacks underlie function call frames, undo/redo, depth-first search, and expression evaluation. Queues power BFS, task scheduling, and message brokers. Knowing both is essential for graph traversal.",
    commonPitfalls: [
      "Using JS array as a queue with .shift() — it's O(n) per call; use a proper linked-list queue for O(1)",
      "Stack overflow from too-deep recursion — every function call pushes a frame onto the call stack",
    ],
    examples: [
      {
        title: "Stack, Queue, and Monotonic Stack implementations",
        description: "TypeScript implementations with the classic 'valid parentheses' and 'next greater element' problems.",
        code: `// ─── Stack using array (O(1) push/pop) ───
class Stack<T> {
  private data: T[] = [];
  push(item: T): void { this.data.push(item); }        // O(1) amortized
  pop(): T | undefined { return this.data.pop(); }     // O(1)
  peek(): T | undefined { return this.data[this.data.length - 1]; } // O(1)
  isEmpty(): boolean { return this.data.length === 0; }
  size(): number { return this.data.length; }
}

// ─── Queue using doubly-linked list (true O(1) dequeue) ───
class QueueNode<T> { constructor(public val: T, public next: QueueNode<T> | null = null) {} }
class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private _size = 0;

  enqueue(val: T): void {                              // O(1) — add to tail
    const node = new QueueNode(val);
    if (this.tail) this.tail.next = node;
    else           this.head = node;
    this.tail = node;
    this._size++;
  }
  dequeue(): T | undefined {                           // O(1) — remove from head
    if (!this.head) return undefined;
    const val = this.head.val;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this._size--;
    return val;
  }
  peek(): T | undefined { return this.head?.val; }
  size(): number { return this._size; }
}

// ─── Classic Stack Problem: Valid Parentheses ───
// O(n) time, O(n) space
function isValid(s: string): boolean {
  const stack = new Stack<string>();
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if ("([{".includes(ch)) { stack.push(ch); }
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.isEmpty();
}

// ─── Monotonic Stack: Next Greater Element ───
// O(n) time — each element pushed and popped at most once
function nextGreaterElement(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = [];  // stores indices of elements awaiting their "next greater"

  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      result[idx] = nums[i];  // found next greater for idx
    }
    stack.push(i);
  }
  return result;
}`,
        language: "typescript",
        output: `STACK vs QUEUE vs DEQUE
═══════════════════════════════════════════════════
  Structure   Order   Add        Remove     Access
  ──────────────────────────────────────────────────
  Stack       LIFO    push(top)  pop(top)   peek(top)
  Queue       FIFO    enqueue    dequeue    peek(front)
                      (rear)     (front)
  Deque       Both    front/rear front/rear front/rear

  All operations are O(1).

VALID PARENTHESES TRACE: "({[]})"
═══════════════════════════════════════════════════
  ch='(' → push    stack: ['(']
  ch='{' → push    stack: ['(', '{']
  ch='[' → push    stack: ['(', '{', '[']
  ch=']' → pop '[' vs pairs[']']='[' ✅  stack: ['(', '{']
  ch='}' → pop '{' vs pairs['}']='{'  ✅  stack: ['(']
  ch=')' → pop '(' vs pairs[')']='('  ✅  stack: []
  isEmpty() → true → VALID ✅

NEXT GREATER ELEMENT: [2, 1, 2, 4, 3, 1]
═══════════════════════════════════════════════════
  i=0, val=2  stack=[0]
  i=1, val=1  stack=[0,1]   (1 < nums[0]=2, don't pop)
  i=2, val=2  stack=[0,2]   pop 1 → result[1]=2
  i=3, val=4  stack=[3]     pop 2 → result[2]=4, pop 0 → result[0]=4
  i=4, val=3  stack=[3,4]
  i=5, val=1  stack=[3,4,5]
  Remaining in stack: indices 3,4,5 → result stays -1
  Result: [4, 2, 4, -1, -1, -1] ✅`,
      },
    ],
  },
};

const hashTables: TopicNode = {
  id: "dsa-hash-tables",
  title: "Hash Tables",
  iconName: "Hash",
  link: "https://en.wikipedia.org/wiki/Hash_table",
  theory:
    "A hash table (hash map) maps keys to values using a hash function that converts each key to an array index. It gives O(1) average-case insert, delete, and lookup — the fastest possible for key-value operations.",
  theoryDetail: {
    keyConcepts: [
      "Hash function: converts key → index. A good function distributes keys uniformly",
      "Collision: two keys hash to the same index — resolved by chaining (linked list per bucket) or open addressing",
      "Load factor: (number of entries) / (number of buckets) — kept below 0.75 to avoid performance degradation",
      "Rehashing: when load factor is exceeded, a new larger array is allocated and all entries re-hashed — O(n)",
      "JavaScript Map preserves insertion order; plain objects ({}) coerce non-string keys",
    ],
    whyItMatters:
      "Hash tables turn O(n) search problems into O(1) lookup. Two-sum, frequency count, grouping, and deduplication — all become O(n) with a Map. Nearly every interview involves a hash table somewhere.",
    commonPitfalls: [
      "Worst-case O(n) for hash tables when all keys collide — negligible in practice with good hash functions",
      "Using an object {} as a map: numeric keys are sorted, not insertion-ordered; use Map instead",
      "Iterating over a large Map while mutating it — leads to undefined behaviour",
    ],
    examples: [
      {
        title: "Hash table patterns: frequency count, grouping, and two-sum",
        description:
          "The most common hash table patterns that appear in interview questions.",
        code: `// ─── Pattern 1: Frequency Count ───
// O(n) time and space
function charFrequency(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  return freq;
}

// ─── Pattern 2: Two Sum ───
// O(n) time and space — instead of O(n²) nested loops
function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>(); // value → index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i]; // found pair
    }
    seen.set(nums[i], i);
  }
  return null;
}

// ─── Pattern 3: Group Anagrams ───
// O(n × k log k) — n strings, k = avg string length
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const str of strs) {
    const key = str.split("").sort().join(""); // canonical form
    const group = map.get(key) ?? [];
    group.push(str);
    map.set(key, group);
  }
  return Array.from(map.values());
}

// ─── Pattern 4: Sliding window with frequency ───
// Longest substring without repeating characters — O(n)
function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>(); // char → last seen index
  let max = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch)! >= left) {
      left = seen.get(ch)! + 1; // shrink window past duplicate
    }
    seen.set(ch, right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}

// ─── Set for O(1) membership testing ───
// Longest consecutive sequence — O(n)
function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let maxLen = 0;
  for (const n of set) {
    if (!set.has(n - 1)) { // start of a sequence
      let curr = n, len = 1;
      while (set.has(curr + 1)) { curr++; len++; }
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}`,
        language: "typescript",
        output: `HASH TABLE BIG O
═══════════════════════════════════════════════════
  Operation         Average     Worst Case
  ──────────────────────────────────────────────────
  Insert            O(1)        O(n) (all keys collide)
  Delete            O(1)        O(n)
  Lookup            O(1)        O(n)
  Rehash            O(n)        O(n) (rare)

TWO SUM TRACE: nums=[2,7,11,15], target=9
═══════════════════════════════════════════════════
  i=0: complement=9-2=7, seen={}          → not found, add 2→0
  i=1: complement=9-7=2, seen={2:0}       → FOUND at index 0!
  Return [0, 1] ✅  (O(n) vs O(n²) brute force)

GROUP ANAGRAMS: ["eat","tea","tan","ate","nat","bat"]
═══════════════════════════════════════════════════
  "eat" → sort → "aet"  →  group["aet"] = ["eat"]
  "tea" → sort → "aet"  →  group["aet"] = ["eat","tea"]
  "tan" → sort → "ant"  →  group["ant"] = ["tan"]
  "ate" → sort → "aet"  →  group["aet"] = ["eat","tea","ate"]
  "nat" → sort → "ant"  →  group["ant"] = ["tan","nat"]
  "bat" → sort → "abt"  →  group["abt"] = ["bat"]
  Result: [["eat","tea","ate"],["tan","nat"],["bat"]] ✅

LONGEST SUBSTRING NO REPEAT: "abcabcbb"
═══════════════════════════════════════════════════
  Window expands: a, ab, abc → length 3
  'a' seen at 0 ≥ left=0 → left moves to 1
  Window: bca → length 3
  'b' seen at 1 ≥ left=1 → left moves to 2
  ...   max = 3 ✅`,
      },
    ],
  },
};

const treesAndGraphs: TopicNode = {
  id: "dsa-trees-graphs",
  title: "Trees & Graphs",
  iconName: "GitFork",
  link: "https://en.wikipedia.org/wiki/Tree_(data_structure)",
  theory:
    "A tree is a hierarchical structure with a root node and child nodes, with no cycles. A graph is a generalisation — nodes (vertices) connected by edges, which can be directed or undirected, cyclic or acyclic.",
  theoryDetail: {
    keyConcepts: [
      "Binary Search Tree (BST): left < node < right — O(log n) search, insert, delete on balanced trees",
      "Tree traversals: in-order (left→node→right), pre-order (node→left→right), post-order (left→right→node)",
      "BFS (Breadth-First Search): explores level by level using a queue — O(V+E)",
      "DFS (Depth-First Search): explores as deep as possible using a stack/recursion — O(V+E)",
      "Adjacency list vs matrix: list is O(V+E) space (sparse graphs); matrix is O(V²) (dense graphs)",
    ],
    whyItMatters:
      "Trees model file systems, DOM, org charts, and decision trees. Graphs model social networks, roads, and dependencies. BFS and DFS are the core traversal algorithms for hundreds of interview problems.",
    commonPitfalls: [
      "Infinite loops in graph DFS/BFS — always maintain a `visited` set",
      "Confusing in-order vs pre-order: in-order gives sorted output from a BST",
      "Assuming balanced tree — unbalanced BST degrades to O(n) for all operations",
    ],
    examples: [
      {
        title: "Binary tree traversals and BFS/DFS on a graph",
        description: "DFS/BFS traversals with level-order output and graph cycle detection.",
        code: `// ─── Binary Tree ───
class TreeNode {
  constructor(
    public val: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

// In-order: Left → Node → Right → sorted output for BST
function inOrder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inOrder(root.left), root.val, ...inOrder(root.right)];
}

// Level-order (BFS): process each level using a queue
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}

// Max depth of binary tree (DFS)
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// ─── Graph represented as adjacency list ───
type Graph = Map<number, number[]>;

// BFS — shortest path in unweighted graph
function bfs(graph: Graph, start: number): Map<number, number> {
  const dist = new Map<number, number>([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift()!;
    for (const neighbor of graph.get(node) ?? []) {
      if (!dist.has(neighbor)) {
        dist.set(neighbor, dist.get(node)! + 1);
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

// DFS — detect cycle in directed graph
function hasCycle(graph: Graph): boolean {
  const visited = new Set<number>();
  const inStack = new Set<number>();   // current DFS path

  function dfs(node: number): boolean {
    visited.add(node);
    inStack.add(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (inStack.has(neighbor)) return true; // back edge = cycle
    }
    inStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}`,
        language: "typescript",
        output: `TREE TRAVERSAL ORDERS
═══════════════════════════════════════════════════
  Tree:       4
             / \\
            2   6
           / \\ / \\
          1  3 5  7

  In-order   (L→N→R): [1, 2, 3, 4, 5, 6, 7]  ← sorted! ✅
  Pre-order  (N→L→R): [4, 2, 1, 3, 6, 5, 7]  ← root first
  Post-order (L→R→N): [1, 3, 2, 5, 7, 6, 4]  ← root last
  Level-order (BFS):  [[4],[2,6],[1,3,5,7]]   ← by level

GRAPH TRAVERSAL COMPARISON
═══════════════════════════════════════════════════
  Graph:  1 — 2 — 4
          |   |
          3 — 5

  BFS from 1: 1,2,3,4,5  (explores level by level, shortest path)
  DFS from 1: 1,2,4,5,3  (explores deep, then backtracks)

  BFS uses: Queue — FIFO — guarantees shortest path (unweighted)
  DFS uses: Stack/Recursion — finds path, explores all paths

TIME COMPLEXITY (V=vertices, E=edges)
═══════════════════════════════════════════════════
  BFS / DFS          O(V + E)  time,  O(V) space
  BST search/insert  O(log n) balanced, O(n) unbalanced
  Level-order BFS    O(n) nodes visited, O(w) space (w=max width)
  Max depth DFS       O(n) — visits every node once`,
      },
    ],
  },
};

export const dsaDataStructures: TopicNode = {
  id: "dsa-data-structures",
  title: "Data Structures",
  iconName: "Database",
  link: "https://en.wikipedia.org/wiki/Data_structure",
  theory:
    "Data structures are ways of organising data so that operations (access, insert, delete, search) can be performed efficiently. Choosing the right structure is often the difference between a solution that passes and one that times out.",
  theoryDetail: {
    keyConcepts: [
      "No single best structure — each has trade-offs between time, space, and the operations it optimises",
      "Arrays: O(1) access, O(n) insert/delete at middle",
      "Linked lists: O(1) insert/delete at known position, O(n) access",
      "Hash tables: O(1) average for insert/delete/lookup",
      "Trees: O(log n) for balanced BST; BFS/DFS in O(V+E) for graphs",
    ],
    whyItMatters:
      "The right data structure can turn an O(n²) solution into O(n). Every FAANG interview tests your ability to identify which structure makes your solution efficient.",
    commonPitfalls: [
      "Defaulting to arrays for everything — often a Map or Set makes the solution O(n) instead of O(n²)",
      "Not knowing the built-in operations' Big O — .includes(), .indexOf(), and array .shift() are all O(n)",
    ],
  },
  children: [arrays, linkedList, stacksQueues, hashTables, treesAndGraphs],
};
