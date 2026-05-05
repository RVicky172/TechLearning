import type { TopicNode } from "@/data/types";

const bitwiseOperators: TopicNode = {
  id: "dsa-bitwise-operators",
  title: "Bitwise Operators",
  iconName: "Binary",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_operators",
  theory:
    "Bitwise operators work directly on the binary (base-2) representation of integers, one bit at a time. They are the fastest possible operations a CPU can perform — and are used in flags, compression, encryption, and low-level algorithms.",
  theoryDetail: {
    keyConcepts: [
      "Every integer is stored in memory as a sequence of bits (0s and 1s): 5 = 0101 in binary",
      "In JavaScript/TypeScript, bitwise operators convert operands to 32-bit signed integers, operate, then convert back",
      "AND (&): both bits must be 1 → result is 1. Used to check/clear flags",
      "OR  (|): at least one bit is 1 → result is 1. Used to set flags",
      "XOR (^): bits differ → result is 1. Used to toggle flags and detect differences",
      "NOT (~): inverts all bits. ~n = -(n+1) in two's complement",
      "Left shift (<<): multiply by 2 per shift. Right shift (>>): divide by 2 per shift",
    ],
    whyItMatters:
      "Bitwise operations run in a single CPU instruction — orders of magnitude faster than division or modulo. They appear in interview problems (detect power of 2, count set bits, swap without temp), competitive programming, and systems code.",
    commonPitfalls: [
      "JavaScript bitwise ops truncate to 32-bit signed integers — be careful with large numbers",
      "Using ~ to find .indexOf() result: ~(-1) === 0 (falsy) was a pre-ES6 pattern; use !== -1 today for clarity",
      "Confusing logical operators (&&, ||) with bitwise (&, |) — they are completely different",
    ],
    examples: [
      {
        title: "Every bitwise operator with binary breakdown",
        description: "Visual bit-by-bit breakdown of how each operator transforms its operands.",
        code: `// Helper: show number in binary with padding
const bin = (n: number, bits = 8) => (n >>> 0).toString(2).padStart(bits, "0");

const a = 0b00001010;  // decimal 10
const b = 0b00001100;  // decimal 12

console.log("a =", a, " →", bin(a));   // 00001010
console.log("b =", b, " →", bin(b));   // 00001100

// ─── AND (&): 1 only where BOTH bits are 1 ───
console.log("a & b =", a & b, "→", bin(a & b));    // 8  → 00001000

// ─── OR (|): 1 where EITHER bit is 1 ───
console.log("a | b =", a | b, "→", bin(a | b));    // 14 → 00001110

// ─── XOR (^): 1 where bits DIFFER ───
console.log("a ^ b =", a ^ b, "→", bin(a ^ b));    // 6  → 00000110

// ─── NOT (~): inverts all bits ───
console.log("~a    =", ~a,    "→", bin(~a));        // -11 → 11110101 (two's complement)

// ─── Left Shift (<<): shift bits left, multiply by 2 per position ───
console.log("a << 1 =", a << 1, "→", bin(a << 1)); // 20 → 00010100
console.log("a << 2 =", a << 2, "→", bin(a << 2)); // 40 → 00101000

// ─── Right Shift (>>): shift bits right, divide by 2 per position ───
console.log("a >> 1 =", a >> 1, "→", bin(a >> 1)); // 5  → 00000101
console.log("a >> 2 =", a >> 2, "→", bin(a >> 2)); // 2  → 00000010

// ─── Unsigned Right Shift (>>>): fills with 0s, handles negatives ───
const neg = -1;  // all 1s in 32-bit: 11111111111111111111111111111111
console.log("-1 >> 1  =", neg >> 1);   // -1 (sign bit preserved)
console.log("-1 >>> 1 =", neg >>> 1);  // 2147483647 (no sign preservation)`,
        language: "typescript",
        output: `BINARY REPRESENTATIONS
═══════════════════════════════════════════════════
  a = 10  →  00001010
  b = 12  →  00001100

OPERATOR RESULTS
═══════════════════════════════════════════════════
          a:  00001010   (decimal 10)
          b:  00001100   (decimal 12)
             ──────────
  a  &  b  :  00001000   = 8    (AND: both bits must be 1)
  a  |  b  :  00001110   = 14   (OR: at least one bit is 1)
  a  ^  b  :  00000110   = 6    (XOR: bits must differ)
       ~  a :  11110101   = -11  (NOT: flip every bit)

SHIFT OPERATIONS
═══════════════════════════════════════════════════
  a << 1  :  00010100   = 20   (10 × 2¹ = 20)
  a << 2  :  00101000   = 40   (10 × 2² = 40)
  a >> 1  :  00000101   = 5    (10 ÷ 2¹ = 5)
  a >> 2  :  00000010   = 2    (10 ÷ 2² = 2.5 → 2, truncated)

UNSIGNED RIGHT SHIFT
═══════════════════════════════════════════════════
  -1 in 32-bit:  11111111111111111111111111111111
  -1 >> 1  :     11111111111111111111111111111111  = -1  (sign bit copied)
  -1 >>> 1 :     01111111111111111111111111111111  = 2,147,483,647  (zero filled)`,
      },
      {
        title: "Practical bit tricks",
        description:
          "Common interview patterns: check power of 2, count set bits, swap without temp, find the missing number.",
        code: `// ─── 1. Check if n is a power of 2 ───
// A power of 2 has exactly one 1-bit: 8 = 1000
// n - 1 flips all bits below it: 7 = 0111
// n & (n-1) == 0 only for powers of 2
function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}
// isPowerOfTwo(8) → true  (1000 & 0111 = 0000)
// isPowerOfTwo(6) → false (0110 & 0101 = 0100 ≠ 0)

// ─── 2. Get / Set / Clear a specific bit ───
function getBit(n: number, position: number): number {
  return (n >> position) & 1;  // shift target bit to position 0, mask with 1
}
function setBit(n: number, position: number): number {
  return n | (1 << position);  // OR with a 1 at the target position
}
function clearBit(n: number, position: number): number {
  return n & ~(1 << position); // AND with all 1s except target position
}
function toggleBit(n: number, position: number): number {
  return n ^ (1 << position);  // XOR flips the target bit
}

// ─── 3. Count set bits (Hamming weight / popcount) ───
function countSetBits(n: number): number {
  let count = 0;
  while (n) {
    n &= (n - 1); // clears the lowest set bit each iteration
    count++;
  }
  return count;
}
// countSetBits(13) → 3  (13 = 1101 → three 1-bits)

// ─── 4. Swap without a temp variable ───
function swapXOR(arr: number[], i: number, j: number): void {
  arr[i] ^= arr[j];  // a = a XOR b
  arr[j] ^= arr[i];  // b = b XOR (a XOR b) = a
  arr[i] ^= arr[j];  // a = (a XOR b) XOR a = b
}

// ─── 5. Find the one missing number (XOR trick) ───
// XOR of identical values = 0, XOR is associative and commutative
function findMissing(arr: number[]): number {
  const n = arr.length + 1;
  let xor = 0;
  for (let i = 1; i <= n; i++) xor ^= i;  // XOR of 1..n
  for (const num of arr)       xor ^= num; // XOR with all present numbers
  return xor; // unpaired number remains
  // Explanation: (1^2^3^...^n) ^ (all present) = missing (all others cancel)
}

// ─── 6. Check if integer is even/odd ───
const isEven = (n: number): boolean => (n & 1) === 0;  // last bit is 0
const isOdd  = (n: number): boolean => (n & 1) === 1;  // last bit is 1

// ─── 7. Multiply and divide by 2 using shifts ───
const multiplyBy2  = (n: number): number => n << 1;
const divideBy2    = (n: number): number => n >> 1;
const multiplyBy8  = (n: number): number => n << 3;   // 2³ = 8`,
        language: "typescript",
        output: `POWER OF TWO CHECK
═══════════════════════════════════════════════════
  isPowerOfTwo(1)  →  true   (1    = 0001, 0 = 0000, AND = 0)
  isPowerOfTwo(2)  →  true   (2    = 0010, 1 = 0001, AND = 0)
  isPowerOfTwo(8)  →  true   (8    = 1000, 7 = 0111, AND = 0)
  isPowerOfTwo(6)  →  false  (6    = 0110, 5 = 0101, AND = 0100 ≠ 0)
  isPowerOfTwo(0)  →  false  (guard: n > 0)

BIT OPERATIONS ON n = 13 (binary: 1101)
═══════════════════════════════════════════════════
  getBit(13, 0)  →  1  (bit 0 = rightmost bit)
  getBit(13, 1)  →  0
  getBit(13, 2)  →  1
  getBit(13, 3)  →  1
  setBit(13, 1)  →  15  (1101 | 0010 = 1111)
  clearBit(13,3) →  5   (1101 & 0111 = 0101)
  toggleBit(13,1)→  15  (1101 ^ 0010 = 1111)
  countSetBits(13)→ 3   (1, 1, 0, 1 → three 1s)

FIND MISSING NUMBER (array 1..5 with one missing)
═══════════════════════════════════════════════════
  arr = [1, 2, 4, 5]  (3 is missing)
  XOR of 1..5: 1^2^3^4^5 = 1
  XOR with arr: 1 ^ 1^2^4^5 = 3  ← answer ✅

  Why it works: every paired number XORs to 0.
  Only the missing number has no pair → it survives.

SHIFT = POWER OF 2 MULTIPLY/DIVIDE
═══════════════════════════════════════════════════
  5 << 1 = 10   (5 × 2)
  5 << 3 = 40   (5 × 8)
  40 >> 1 = 20  (40 ÷ 2)
  Shifts are faster than * and / — the CPU does it natively.`,
      },
    ],
  },
};

const bitmaskFlags: TopicNode = {
  id: "dsa-bitmask-flags",
  title: "Bitmasks & Permission Flags",
  iconName: "ToggleLeft",
  link: "https://en.wikipedia.org/wiki/Mask_(computing)",
  theory:
    "A bitmask stores multiple boolean flags in a single integer — each bit represents one flag. This technique uses 1 integer instead of n booleans, and checking/setting flags takes a single CPU instruction.",
  theoryDetail: {
    keyConcepts: [
      "Define each flag as a power of 2 (1, 2, 4, 8, 16…) — each occupies exactly one bit position",
      "Set a flag: permissions |= FLAG (OR turns that bit on)",
      "Clear a flag: permissions &= ~FLAG (AND with NOT clears that bit)",
      "Check a flag: (permissions & FLAG) !== 0 (AND isolates that bit)",
      "Toggle a flag: permissions ^= FLAG (XOR flips that bit)",
    ],
    whyItMatters:
      "Unix file permissions (rwx = 4+2+1), HTTP cache directives, React's internal fiber flags, and database permission systems all use bitmasks. Reading them requires understanding bitwise AND/OR/NOT.",
    commonPitfalls: [
      "Using non-power-of-2 values for flags — flags must be powers of 2 to occupy unique bit positions",
      "Over-engineering small flag sets — 5 booleans is simpler than a bitmask for simple objects",
      "JavaScript's 32-bit limit — max 32 distinct flags per bitmask in JavaScript",
    ],
    examples: [
      {
        title: "File permission system with bitmasks",
        description:
          "Model Unix-style read/write/execute permissions using bitwise operators.",
        code: `// ─── Define flags as powers of 2 (each occupies one bit) ───
const PERMISSIONS = {
  NONE:    0b000,  // 0 — no permissions
  EXECUTE: 0b001,  // 1 — bit 0
  WRITE:   0b010,  // 2 — bit 1
  READ:    0b100,  // 4 — bit 2
  ALL:     0b111,  // 7 — all permissions
} as const;

type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ─── Utility functions ───
function hasPermission(userPerms: number, flag: number): boolean {
  return (userPerms & flag) !== 0;
}
function addPermission(userPerms: number, flag: number): number {
  return userPerms | flag;
}
function removePermission(userPerms: number, flag: number): number {
  return userPerms & ~flag;
}
function togglePermission(userPerms: number, flag: number): number {
  return userPerms ^ flag;
}
function describePermissions(perms: number): string {
  const parts: string[] = [];
  if (hasPermission(perms, PERMISSIONS.READ))    parts.push("READ");
  if (hasPermission(perms, PERMISSIONS.WRITE))   parts.push("WRITE");
  if (hasPermission(perms, PERMISSIONS.EXECUTE)) parts.push("EXECUTE");
  return parts.length ? parts.join(" | ") : "NONE";
}

// ─── Usage ───
let alice = PERMISSIONS.READ | PERMISSIONS.WRITE;  // 110 in binary = 6
console.log("Alice:", describePermissions(alice));

alice = addPermission(alice, PERMISSIONS.EXECUTE);
console.log("After adding EXECUTE:", describePermissions(alice));

alice = removePermission(alice, PERMISSIONS.WRITE);
console.log("After removing WRITE:", describePermissions(alice));

console.log("Can READ?",    hasPermission(alice, PERMISSIONS.READ));
console.log("Can WRITE?",   hasPermission(alice, PERMISSIONS.WRITE));
console.log("Can EXECUTE?", hasPermission(alice, PERMISSIONS.EXECUTE));`,
        language: "typescript",
        output: `BITMASK STATE TRACE
═══════════════════════════════════════════════════
  Initial:  READ | WRITE = 100 | 010 = 110 = 6

  After addPermission(EXECUTE):
    110 | 001 = 111 = 7
    Alice: READ | WRITE | EXECUTE

  After removePermission(WRITE):
    111 & ~010 = 111 & 101 = 101 = 5
    Alice: READ | EXECUTE

  hasPermission(READ):    (101 & 100) = 100 ≠ 0  →  true
  hasPermission(WRITE):   (101 & 010) = 000 = 0   →  false
  hasPermission(EXECUTE): (101 & 001) = 001 ≠ 0  →  true

UNIX PERMISSIONS DECODED (e.g. chmod 755)
═══════════════════════════════════════════════════
  chmod 755 = 7  5  5
            Owner Group Others
  7 = 111   rwx
  5 = 101   r-x
  5 = 101   r-x

  chmod 644 = 6  4  4
  6 = 110   rw-
  4 = 100   r--
  4 = 100   r--

STORING 32 FLAGS IN ONE 32-BIT INTEGER
═══════════════════════════════════════════════════
  Using booleans: 32 × 4 bytes = 128 bytes per user
  Using bitmask:   1 × 4 bytes = 4 bytes per user  (32× smaller)
  Check any flag: 1 CPU AND instruction (nanoseconds)`,
      },
    ],
  },
};

export const dsaBitwise: TopicNode = {
  id: "dsa-bitwise",
  title: "Bitwise Operations",
  iconName: "Cpu",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_operators",
  theory:
    "Bitwise operations manipulate integers at the binary level — one bit at a time. They are the fastest operations a CPU executes and appear in permission systems, cryptography, compression, and interview coding challenges.",
  theoryDetail: {
    keyConcepts: [
      "Integers in memory are sequences of bits; bitwise ops work directly on those bits",
      "&  AND: 1 only if both bits are 1 — used to check/clear flags",
      "|  OR:  1 if either bit is 1 — used to set flags",
      "^  XOR: 1 if bits differ — used to toggle flags and detect differences",
      "<< left shift: multiply by 2; >> right shift: divide by 2",
    ],
    whyItMatters:
      "Unix permissions, React fiber flags, and common interview problems (power of 2, missing number, unique element) all use bitwise operations. This is a guaranteed interview topic.",
    commonPitfalls: [
      "JavaScript bitwise ops are 32-bit — numbers outside this range behave unexpectedly",
      "Confusing & with && and | with || — they are completely different operations",
    ],
  },
  children: [bitwiseOperators, bitmaskFlags],
};
