import type { TopicNode } from "@/data/types";

export const tsClasses: TopicNode = {
  id: "ts-classes",
  title: "Classes & OOP",
  iconName: "Package",
  theory:
    "TypeScript enhances JavaScript classes with access modifiers, abstract classes, and interface implementations — enabling full object-oriented patterns with static type checking.",
  theoryDetail: {
    keyConcepts: [
      "public, private, protected, and readonly modifiers control member visibility and mutability",
      "Abstract classes define a base contract without a full implementation",
      "The 'implements' keyword verifies a class satisfies an interface at compile time",
    ],
    whyItMatters:
      "Typed classes enforce encapsulation at the type level. Private fields hide implementation details, abstract classes establish reusable hierarchies, and interfaces decouple consumers from concrete types.",
    commonPitfalls: [
      "Using public on everything — default visibility is already public; only annotate non-public members",
      "Confusing TypeScript's structural 'private' with JavaScript's # private fields",
      "Overusing inheritance when composition with interfaces would be more flexible",
    ],
  },
  children: [
    {
      id: "ts-class-basics",
      title: "Class Basics & Constructors",
      iconName: "Box",
      link: "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      theory:
        "TypeScript classes support constructor parameter shorthand, typed properties, and optional/readonly fields all in one declaration.",
      theoryDetail: {
        keyConcepts: [
          "Constructor shorthand: 'constructor(public name: string)' declares and assigns in one step",
          "Class properties must be declared with a type before use (unlike plain JavaScript)",
          "readonly properties can only be assigned at declaration or in the constructor",
        ],
        whyItMatters:
          "Constructor shorthand cuts boilerplate by 60% in typical classes while making the type shape immediately visible at the class definition.",
        commonPitfalls: [
          "Forgetting to declare class properties before using them in methods",
          "Mixing constructor shorthand with manual property declarations causing duplication",
          "Not using readonly for properties that should never change after construction",
        ],
        examples: [
          {
            title: "Constructor shorthand and readonly fields",
            description:
              "Inline property declarations in the constructor keep class definitions concise and typed.",
            code: `class User {
  readonly createdAt: Date;

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    private passwordHash: string
  ) {
    this.createdAt = new Date();
  }

  verifyPassword(input: string): boolean {
    // passwordHash is private — only accessible inside User
    return this.passwordHash === hash(input);
  }

  toPublicProfile(): Pick<User, "id" | "name" | "email"> {
    return { id: this.id, name: this.name, email: this.email };
  }
}

function hash(s: string): string { return s; } // placeholder

const user = new User("1", "Alice", "alice@x.com", "h4sh");
// user.passwordHash; // ✅ compile error — private
// user.id = "2";     // ✅ compile error — readonly`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-class-modifiers",
      title: "Access Modifiers & Readonly",
      iconName: "Lock",
      link: "https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility",
      theory:
        "public, private, and protected control who can access a class member. readonly prevents reassignment after construction.",
      theoryDetail: {
        keyConcepts: [
          "public: accessible everywhere (default when no modifier is present)",
          "private: only accessible inside the declaring class",
          "protected: accessible inside the class and its subclasses",
        ],
        whyItMatters:
          "Access modifiers enforce encapsulation at the type system level, preventing misuse of internal state. The compiler, not runtime checks, enforces the boundaries.",
        commonPitfalls: [
          "TypeScript 'private' is erased at runtime — JavaScript # fields give true runtime privacy",
          "Using protected when private suffices — unnecessarily exposes internals to subclasses",
          "Marking mutable state as readonly only in the interface but not the class — they must match",
        ],
        examples: [
          {
            title: "TS private vs JS # private fields",
            description:
              "TypeScript private is compile-time only; # fields enforce true runtime encapsulation.",
            code: `// TypeScript 'private' — compile-time only
class TSPrivate {
  private secret = "ts-private";
  getSecret(): string { return this.secret; }
}

const ts = new TSPrivate();
// ts.secret; // ✅ compile error
// (ts as any).secret; // ❌ accessible at runtime via cast

// JavaScript # private — true runtime encapsulation
class JSPrivate {
  #secret = "js-private";
  getSecret(): string { return this.#secret; }
}

const js = new JSPrivate();
// js.#secret;         // ✅ compile error
// (js as any)["#secret"]; // still not accessible — runtime enforced

// ─── protected: base class shares with subclasses ───
class Animal {
  protected species: string;
  constructor(species: string) { this.species = species; }
}

class Dog extends Animal {
  describe(): string {
    return \`I am a \${this.species}\`; // ✅ protected is accessible in subclass
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-class-abstract",
      title: "Abstract Classes & Interfaces",
      iconName: "Layers",
      link: "https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members",
      theory:
        "Abstract classes define shared behavior and require subclasses to implement abstract members. 'implements' verifies a class matches an interface.",
      theoryDetail: {
        keyConcepts: [
          "Abstract classes cannot be instantiated directly — only subclasses can",
          "Abstract methods have no body — each subclass must provide its own implementation",
          "A class can implement multiple interfaces but can only extend one abstract class",
        ],
        whyItMatters:
          "Abstract classes let you share default behavior while mandating that subclasses define their own variations. Combined with interfaces, they enable true polymorphism.",
        commonPitfalls: [
          "Putting too much logic in an abstract class making it hard to swap implementations",
          "Implementing an interface but forgetting a required method — the compiler will catch this",
          "Confusing abstract classes (partial implementation) with interfaces (no implementation)",
        ],
        examples: [
          {
            title: "Abstract storage with concrete implementations",
            description:
              "An abstract base defines the contract; concrete classes swap the storage backend.",
            code: `interface Logger {
  log(message: string): void;
}

abstract class BaseStorage<T> implements Logger {
  protected items: Map<string, T> = new Map();

  // Shared behavior — concrete in the base
  log(message: string): void {
    console.log(\`[Storage] \${message}\`);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  // Each subclass defines its own persistence strategy
  abstract save(id: string, item: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}

class InMemoryStorage<T> extends BaseStorage<T> {
  async save(id: string, item: T): Promise<void> {
    this.items.set(id, item);
    this.log(\`Saved \${id}\`);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
    this.log(\`Deleted \${id}\`);
  }
}

// new BaseStorage(); // ✅ compile error — abstract class
const store = new InMemoryStorage<{ name: string }>();`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
