import type { Technology } from "@/data/types";

const typescript: Technology = {
  id: "typescript",
  name: "TypeScript",
  description: "Strongly typed superset of JavaScript that catches bugs at compile time and improves IDE support.",
  color: "bg-blue-700",
  iconName: "FileCode2",
  deviconClass: "devicon-typescript-plain colored",
  tree: [
    {
      id: "ts-basics",
      title: "TypeScript Fundamentals",
      iconName: "BookOpen",
      theory: "TypeScript adds optional static types to JavaScript. Start here to understand how type annotations work and why they make your code more maintainable.",
      theoryDetail: {
        keyConcepts: [
          "TypeScript is a superset of JavaScript — all valid JS is valid TS",
          "Types are erased at compile time; the runtime is pure JavaScript",
          "tsc compiles TypeScript; tsconfig.json controls strictness, module format, and output",
        ],
        whyItMatters:
          "TypeScript catches type errors, undefined property access, and wrong argument types before they reach production — acting as a fast, always-on first-pass test suite.",
        commonPitfalls: [
          "Defaulting to 'any' to silence errors — this disables type checking entirely",
          "Not enabling 'strict: true' in tsconfig, missing null checks and other safety rules",
          "Over-annotating types that TypeScript can already infer — trust the compiler",
        ],
      },
      children: [
        {
          id: "ts-types",
          title: "Basic Types",
          iconName: "Tag",
          link: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
          theory: "TypeScript supports primitives like string, number, boolean, arrays, tuples, and special types like any, unknown, and never.",
          theoryDetail: {
            keyConcepts: [
              "Primitives: string, number, boolean, bigint, symbol, null, undefined",
              "Arrays: string[] or Array<string>; Tuples fix length and types: [string, number]",
              "'unknown' requires narrowing before use; 'never' represents unreachable code paths",
            ],
            whyItMatters:
              "Getting basic types right eliminates the most common runtime errors — undefined.length, calling a number as a function, or mismatching string and number IDs.",
            commonPitfalls: [
              "Using 'any' when 'unknown' is more appropriate — unknown forces type checking before use",
              "Forgetting null and undefined are distinct types under strictNullChecks",
              "Using the broad 'object' type instead of a specific interface or Record type",
            ],
          },
        },
        {
          id: "ts-interfaces",
          title: "Interfaces & Type Aliases",
          iconName: "Shapes",
          link: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
          theory: "Interfaces describe the shape of objects. Type aliases let you name any type. Both are key tools for modeling your domain.",
          theoryDetail: {
            keyConcepts: [
              "Interfaces define object shapes and can extend multiple other interfaces",
              "Type aliases work for any type: unions, functions, primitives, intersections",
              "Interfaces are open for declaration merging; type aliases are sealed",
            ],
            whyItMatters:
              "Well-named types serve as self-documenting contracts between functions and modules. IDEs use them for autocompletion, reducing lookup time dramatically.",
            commonPitfalls: [
              "Using interface for non-object types where a type alias is clearer",
              "Accidental declaration merging when two files define the same interface name",
              "Forgetting optional properties (?:) require undefined handling at usage sites",
            ],
          },
        },
        {
          id: "ts-narrowing",
          title: "Type Narrowing",
          iconName: "Filter",
          link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
          theory: "TypeScript narrows types based on control flow. Use typeof, instanceof, and 'in' guards to work safely with union types.",
          theoryDetail: {
            keyConcepts: [
              "typeof guards primitives; instanceof guards class instances",
              "'in' operator checks property existence and narrows discriminated unions",
              "User-defined type guards (x is Type) narrow in the caller's scope",
            ],
            whyItMatters:
              "Narrowing is how TypeScript makes union types usable. Without it, every operation on a union member would be a compile error.",
            commonPitfalls: [
              "Truthiness checks don't distinguish null from 0 or '' — use explicit comparisons",
              "Narrowing only applies within the branch — the type widens again outside it",
              "Writing redundant type guards for types TypeScript already narrows automatically",
            ],
          },
        },
      ],
    },
    {
      id: "ts-advanced",
      title: "Advanced Patterns",
      iconName: "Zap",
      theory: "Master TypeScript's most powerful features to write fully type-safe APIs, utilities, and libraries.",
      theoryDetail: {
        keyConcepts: [
          "Template literal types combine string unions: `${Method}/${Route}`",
          "The 'infer' keyword extracts types from conditional type expressions",
          "Recursive types model trees, JSON, or linked lists — add a depth guard for performance",
        ],
        whyItMatters:
          "Advanced TypeScript turns the type system into a compile-time constraint engine. You can encode business rules as types and let the compiler enforce them automatically.",
        commonPitfalls: [
          "Over-engineering types that are clever but unreadable — prefer clarity over cleverness",
          "Using @ts-ignore to bypass errors instead of modeling the data correctly",
          "Recursive types without a base case causing TypeScript to hit the instantiation depth limit",
        ],
      },
      children: [
        {
          id: "ts-generics",
          title: "Generics",
          iconName: "Box",
          link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
          theory: "Generics let you write reusable functions and types that work with any type while preserving type safety.",
          theoryDetail: {
            keyConcepts: [
              "Generic parameters declared with <T> are inferred from arguments or supplied explicitly",
              "Constraints with 'extends' restrict what T can be: <T extends object>",
              "Default type parameters provide a fallback: <T = string>",
            ],
            whyItMatters:
              "Without generics, reusable utilities like Array.map or Promise would lose their input types through transformations, forcing unsafe casts back to the original type.",
            commonPitfalls: [
              "Too many unconstrained type parameters making function signatures unreadable",
              "Forgetting constraints causing 'Property X does not exist on type T' errors",
              "Using generics when a union type or overload is simpler and more readable",
            ],
          },
        },
        {
          id: "ts-utility",
          title: "Utility Types",
          iconName: "Wrench",
          link: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
          theory: "Partial, Required, Pick, Omit, Record and more — TypeScript ships built-in generic utilities for transforming existing types.",
          theoryDetail: {
            keyConcepts: [
              "Partial<T> makes all fields optional; Required<T> makes all required",
              "Pick<T, 'a'|'b'> selects keys; Omit<T, 'a'> excludes them",
              "ReturnType<typeof fn> and Parameters<typeof fn> extract function type info",
            ],
            whyItMatters:
              "Utility types keep your type definitions DRY — derive DTOs, partial forms, and API responses from a single source-of-truth type without duplication.",
            commonPitfalls: [
              "Nesting 4+ utility types creating unreadable one-liners — alias intermediate steps",
              "Using Partial everywhere 'to be safe' instead of modeling the actual required/optional split",
              "Reaching for utilities before checking if TypeScript can infer the shape automatically",
            ],
          },
        },
        {
          id: "ts-conditional",
          title: "Conditional & Mapped Types",
          iconName: "GitBranch",
          link: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
          theory: "Conditional types choose between types based on a condition. Mapped types transform every property of an existing type.",
          theoryDetail: {
            keyConcepts: [
              "T extends U ? X : Y distributes over union types by default",
              "Mapped types iterate over keyof T to transform each property",
              "The 'as' clause in mapped types renames or filters keys",
            ],
            whyItMatters:
              "Conditional and mapped types underpin TypeScript's entire utility library. Understanding them unlocks building type-safe APIs, ORMs, and validation schemas.",
            commonPitfalls: [
              "Unexpected distribution over unions — wrap T in a tuple [T] to disable it",
              "Infinite recursion in recursive conditional types without a base case",
              "Creating complex types without intermediate aliases making error messages cryptic",
            ],
          },
        },
      ],
    },
    {
      id: "ts-functions",
      title: "Functions & Type Safety",
      iconName: "FunctionSquare",
      theory: "TypeScript brings full type safety to function parameters, return values, and higher-order functions — the backbone of any application.",
      theoryDetail: {
        keyConcepts: [
          "Annotate every parameter and return type for maximum tooling support",
          "Function overloads let you express multiple call signatures for one implementation",
          "Rest parameters type as an array; spread preserves tuple element types",
        ],
        whyItMatters:
          "Functions are the primary unit of code reuse. Typed functions make refactoring safe — changing a signature immediately surfaces every call site that needs updating.",
        commonPitfalls: [
          "Forgetting to type the return value, letting TypeScript infer 'void' when you meant 'Promise<void>'",
          "Writing overly wide parameter types (any[]) that erase the benefit of type checking",
          "Not using 'never' for exhaustive checks in switch statements over discriminated unions",
        ],
      },
      children: [
        {
          id: "ts-func-signatures",
          title: "Function Signatures & Return Types",
          iconName: "ArrowRight",
          link: "https://www.typescriptlang.org/docs/handbook/2/functions.html",
          theory: "Explicit parameter and return type annotations make function contracts clear and enable rich IDE autocomplete and error detection.",
          theoryDetail: {
            keyConcepts: [
              "Parameters: (name: string, age: number) — annotate each individually",
              "Return type after the closing parenthesis: function greet(): string",
              "Optional parameters with '?': (name?: string); default values infer the type",
            ],
            whyItMatters:
              "Typed signatures are the API contract of your function. They let callers know exactly what to pass and what to expect back without reading the implementation.",
            commonPitfalls: [
              "Omitting the return type and relying on inference — inference breaks if you add an early return with a different type",
              "Using null and undefined inconsistently in optional parameters",
              "Declaring a parameter as 'any' to skip type modeling — use 'unknown' + narrowing instead",
            ],
          },
        },
        {
          id: "ts-func-overloads",
          title: "Function Overloads",
          iconName: "Layers",
          link: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads",
          theory: "Overloads declare multiple signatures for the same function so callers get precise return types based on the arguments they pass.",
          theoryDetail: {
            keyConcepts: [
              "Write two or more overload signatures above the implementation signature",
              "The implementation signature is not visible to callers — it must be compatible with all overloads",
              "Use overloads when the return type genuinely depends on input types; otherwise use a union return type",
            ],
            whyItMatters:
              "Overloads let a single function handle multiple argument shapes while still giving callers an exact, narrow return type — critical for libraries and SDK design.",
            commonPitfalls: [
              "Making the implementation signature too narrow — it must cover every overload's parameter types",
              "Using overloads when conditional types or generics would be cleaner",
              "Ordering overloads from most specific to least specific — TypeScript matches the first compatible one",
            ],
          },
        },
        {
          id: "ts-func-async",
          title: "Async Functions & Promise Types",
          iconName: "Clock",
          link: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html",
          theory: "async/await in TypeScript always returns a Promise. Typing async functions correctly ensures downstream consumers know what they will receive.",
          theoryDetail: {
            keyConcepts: [
              "An async function with return type T implicitly returns Promise<T>",
              "Awaiting a Promise<T> yields T — TypeScript infers this automatically",
              "Use Promise.allSettled for concurrent calls when you need all results even on failure",
            ],
            whyItMatters:
              "Untyped async code is where 'undefined is not a function' runtime errors hide. Typed Promises surface these errors at compile time before they reach production.",
            commonPitfalls: [
              "Forgetting to await a Promise — the value is then Promise<T> not T",
              "Not catching rejections in async functions — unhandled rejections crash Node.js processes",
              "Using Promise<any> as a shortcut — the caller loses all type information about the resolved value",
            ],
          },
        },
      ],
    },
    {
      id: "ts-classes",
      title: "Classes & OOP",
      iconName: "Package",
      theory: "TypeScript enhances JavaScript classes with access modifiers, abstract classes, and interface implementations — enabling full object-oriented patterns with static type checking.",
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
          theory: "TypeScript classes support constructor parameter shorthand, typed properties, and optional/readonly fields all in one declaration.",
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
          },
        },
        {
          id: "ts-class-modifiers",
          title: "Access Modifiers & Readonly",
          iconName: "Lock",
          link: "https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility",
          theory: "public, private, and protected control who can access a class member. readonly prevents reassignment after construction.",
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
          },
        },
        {
          id: "ts-class-abstract",
          title: "Abstract Classes & Interfaces",
          iconName: "Layers",
          link: "https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members",
          theory: "Abstract classes define shared behavior and require subclasses to implement abstract members. 'implements' verifies a class matches an interface.",
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
          },
        },
      ],
    },
    {
      id: "ts-enums-literals",
      title: "Enums & Literal Types",
      iconName: "List",
      theory: "Enums and literal types let you express a fixed set of allowed values. Template literal types combine string literals with string manipulation at the type level.",
      theoryDetail: {
        keyConcepts: [
          "Numeric enums auto-increment; string enums require explicit values for each member",
          "const enums are inlined by the compiler, producing no runtime object",
          "Literal types (type Dir = 'left' | 'right') are lighter-weight alternatives to enums",
        ],
        whyItMatters:
          "Enums and literal unions document the exact set of valid values and let the compiler reject any value outside that set — eliminating magic strings and numeric constants.",
        commonPitfalls: [
          "Using regular enums in ESM packages — they produce a runtime object that can cause bundling issues",
          "Numeric enums are reverse-mapped — Enum[0] === 'Member'; this surprises many developers",
          "Mixing string and numeric members in one enum makes the type hard to work with",
        ],
      },
      children: [
        {
          id: "ts-enums",
          title: "Enums",
          iconName: "Hash",
          link: "https://www.typescriptlang.org/docs/handbook/enums.html",
          theory: "Enums define a named set of constants. TypeScript supports numeric enums (auto-incremented), string enums (explicit values), and const enums (compiler-inlined).",
          theoryDetail: {
            keyConcepts: [
              "Numeric enum: enum Direction { Up, Down, Left, Right } starts at 0",
              "String enum: enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }",
              "const enum: erased at compile time; members are replaced with their literal values",
            ],
            whyItMatters:
              "Enums replace scattered magic strings and numbers with a named, type-safe set. Renaming a member propagates everywhere via the IDE, unlike renaming a string literal.",
            commonPitfalls: [
              "Numeric enums allow any number to be assigned — use string enums for strict validation",
              "const enums break across module boundaries without 'isolatedModules' awareness",
              "Forgetting that numeric enums are reverse-mapped — iterating an enum gives both keys and values",
            ],
          },
        },
        {
          id: "ts-literal-types",
          title: "Literal & Union Types",
          iconName: "Tag",
          link: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types",
          theory: "Literal types restrict a variable to an exact value. Combined into unions, they model state machines and discriminated data structures.",
          theoryDetail: {
            keyConcepts: [
              "String literal: type Dir = 'north' | 'south' | 'east' | 'west'",
              "Discriminated unions: a shared literal field narrows to a specific variant",
              "'as const' freezes an object/array so TypeScript infers the narrowest literal type",
            ],
            whyItMatters:
              "Discriminated unions with a literal tag field let TypeScript narrow a union to a specific variant inside a branch — eliminating runtime instanceof checks for plain objects.",
            commonPitfalls: [
              "Widening: 'let x = 'hello'' infers string, not 'hello' — use 'const' or 'as const'",
              "Forgetting to handle all variants in a switch — add a 'never' default to catch gaps",
              "Using string enums instead of literal unions when the set won't grow — unions are simpler",
            ],
          },
        },
        {
          id: "ts-template-literal",
          title: "Template Literal Types",
          iconName: "Code",
          link: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
          theory: "Template literal types build new string literal types by combining existing string unions — enabling typed event names, CSS property names, and REST endpoints.",
          theoryDetail: {
            keyConcepts: [
              "type Greeting = `Hello, ${string}` matches any string starting with 'Hello, '",
              "Distributes over unions: `on${Capitalize<'click'|'focus'>}` → 'onClick' | 'onFocus'",
              "Intrinsic utility types: Uppercase<S>, Lowercase<S>, Capitalize<S>, Uncapitalize<S>",
            ],
            whyItMatters:
              "Template literal types bring compile-time string manipulation to TypeScript. They power fully typed event systems, CSS-in-TS utilities, and auto-generated API client types.",
            commonPitfalls: [
              "Template literal types on large unions produce an exponential product — keep union members small",
              "Using template literals to validate runtime strings — they are compile-time only",
              "Forgetting the Capitalize/Lowercase helpers when building camelCase keys from snake_case unions",
            ],
          },
        },
      ],
    },
    {
      id: "ts-modules-config",
      title: "Modules & Configuration",
      iconName: "Settings",
      theory: "A well-configured tsconfig.json is the foundation of a reliable TypeScript project. Understanding module resolution and declaration files lets you consume and publish typed packages.",
      theoryDetail: {
        keyConcepts: [
          "strict: true enables strictNullChecks, noImplicitAny, and other safety flags simultaneously",
          "moduleResolution: 'bundler' or 'node16' aligns TypeScript with your bundler's import rules",
          "paths: {} in tsconfig maps short aliases (@/components) to real directories",
        ],
        whyItMatters:
          "tsconfig is the single source of truth for compiler behavior. Wrong settings silently disable safety checks; correct settings make TypeScript a powerful correctness tool.",
        commonPitfalls: [
          "Using an old tsconfig template that misses 'strict' or 'moduleResolution' updates",
          "Forgetting to include path aliases in both tsconfig and the bundler (Vite/webpack)",
          "Publishing a package without declaration files — consumers get 'implicit any' for all exports",
        ],
      },
      children: [
        {
          id: "ts-tsconfig",
          title: "tsconfig.json Deep Dive",
          iconName: "FileJson",
          link: "https://www.typescriptlang.org/tsconfig",
          theory: "tsconfig.json controls exactly which files TypeScript compiles and what rules it enforces. Every meaningful option is worth understanding.",
          theoryDetail: {
            keyConcepts: [
              "compilerOptions.target: output JS version (ES2022 is the modern default)",
              "compilerOptions.lib: type definitions available (DOM, ES2022, etc.)",
              "include/exclude/files control which source files are part of the compilation",
            ],
            whyItMatters:
              "Misconfigured tsconfig is the root cause of 'works on my machine' TypeScript failures. Understanding each option prevents hidden bugs from silent type downgrades.",
            commonPitfalls: [
              "Setting 'strict: false' globally to fix one error — this disables all strict checks",
              "Forgetting 'skipLibCheck: true' in projects with third-party type conflicts",
              "Not setting 'baseUrl' when using path aliases — aliases require both baseUrl and paths",
            ],
          },
        },
        {
          id: "ts-modules",
          title: "ES Modules & Import/Export",
          iconName: "Share2",
          link: "https://www.typescriptlang.org/docs/handbook/2/modules.html",
          theory: "TypeScript fully supports ES module syntax. Understanding how TypeScript resolves imports prevents runtime 'module not found' errors.",
          theoryDetail: {
            keyConcepts: [
              "import type { T } only imports the type — it is erased at compile time and safe for isolatedModules",
              "Re-export patterns: export { foo } from './foo' without importing into the module scope",
              "moduleResolution: 'bundler' lets you omit file extensions; 'node16' requires .js extensions in .ts source",
            ],
            whyItMatters:
              "Module resolution bugs are notoriously hard to debug at runtime. Understanding the resolution algorithm early prevents hours of 'Cannot find module' troubleshooting.",
            commonPitfalls: [
              "Mixing CommonJS require() and ES import in the same file under 'module: ESNext'",
              "Forgetting 'export {}' in files with no exports when 'isolatedModules' is true",
              "Not using 'import type' for type-only imports — fails under isolatedModules and Babel transforms",
            ],
          },
        },
        {
          id: "ts-declaration-files",
          title: "Declaration Files (.d.ts)",
          iconName: "FileType",
          link: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
          theory: "Declaration files describe the types of JavaScript libraries. TypeScript ships them for built-ins; @types/* packages provide them for popular JS libraries.",
          theoryDetail: {
            keyConcepts: [
              "declare module 'lib' { } creates ambient declarations for JavaScript-only packages",
              "/// <reference types=\"node\" /> instructs the compiler to include Node.js type definitions globally",
              "When you set 'declaration: true', tsc auto-generates .d.ts files alongside output",
            ],
            whyItMatters:
              "Without declaration files, every JavaScript library you import becomes 'any', erasing TypeScript's benefits at every third-party boundary.",
            commonPitfalls: [
              "Writing a .d.ts by hand when tsc --declaration can generate it automatically",
              "Shipping a package without the 'types' field in package.json — consumers can't find the .d.ts",
              "Using 'declare var' in a module-scoped file when you need 'declare global { }' for global augmentation",
            ],
          },
        },
      ],
    },
    {
      id: "ts-in-practice",
      title: "TypeScript in Practice",
      iconName: "Rocket",
      theory: "TypeScript shines in real-world contexts: typed React components, safe error handling, and bridging the gap between compile-time types and runtime data.",
      theoryDetail: {
        keyConcepts: [
          "TypeScript types don't exist at runtime — JSON from an API is 'unknown' until validated",
          "Runtime validation libraries (Zod, Valibot) parse and validate while inferring TypeScript types",
          "React + TypeScript: ComponentProps, event types, and generic components are the key patterns",
        ],
        whyItMatters:
          "TypeScript's real value is felt in large codebases where you can't hold everything in your head. Typed React props, validated API responses, and narrowed error types catch bugs before users do.",
        commonPitfalls: [
          "Casting API responses to a type with 'as' — this is a lie to the compiler, not a real type guarantee",
          "Skipping runtime validation 'because the API is stable' — schemas change without warning",
          "Not using ErrorBoundary or structured error types, swallowing type information in catch blocks",
        ],
      },
      children: [
        {
          id: "ts-react",
          title: "TypeScript with React",
          iconName: "Layout",
          link: "https://react.dev/learn/typescript",
          theory: "React and TypeScript work together via JSX types, component prop interfaces, and typed hooks. Getting these right eliminates an entire class of React bugs.",
          theoryDetail: {
            keyConcepts: [
              "Props interface: define a Props type and pass it as the function parameter type",
              "React.FC<Props> is supported but rarely needed — annotate the function parameter type directly for clarity",
              "Event handlers: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>",
            ],
            whyItMatters:
              "Typed React components prevent passing wrong props, mistyping event handler signatures, and forgetting required children — all caught at compile time instead of in the browser.",
            commonPitfalls: [
              "Avoid React.FC — since React 18, it no longer adds implicit children; use explicit Props types instead",
              "Typing refs as 'any' instead of the correct HTML element type (HTMLInputElement, etc.)",
              "Not typing generic components explicitly: Component<T> requires the syntax <T,> or <T extends object>",
            ],
          },
        },
        {
          id: "ts-runtime-validation",
          title: "Runtime Validation with Zod",
          iconName: "ShieldCheck",
          link: "https://zod.dev",
          theory: "Zod schemas parse and validate data at runtime while inferring TypeScript types automatically — bridging the gap between compile-time and runtime safety.",
          theoryDetail: {
            keyConcepts: [
              "z.infer<typeof schema> extracts the TypeScript type from a Zod schema",
              "schema.parse() throws on invalid data; schema.safeParse() returns { success, data, error }",
              "Schemas compose: z.object({ user: UserSchema }) nests schemas safely",
            ],
            whyItMatters:
              "TypeScript can't validate data from network requests, localStorage, or user input at runtime. Zod validates the shape and populates correct TypeScript types from a single schema definition.",
            commonPitfalls: [
              "Defining the type and schema separately — use z.infer<> to derive the type from the schema",
              "Using schema.parse in production without a try/catch — ZodError is thrown on failure",
              "Overly strict schemas breaking on minor API additions — use z.object().passthrough() or .strip() intentionally",
            ],
          },
        },
        {
          id: "ts-error-handling",
          title: "Typed Error Handling",
          iconName: "AlertTriangle",
          link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
          theory: "TypeScript 4.0+ infers 'unknown' for catch variables. Typed errors use discriminated unions or Result types to make failure states explicit.",
          theoryDetail: {
            keyConcepts: [
              "catch (e: unknown) — always narrow 'e' before accessing any property",
              "Result pattern: type Result<T> = { ok: true; value: T } | { ok: false; error: string }",
              "Custom error classes with type guards: function isNetworkError(e: unknown): e is NetworkError",
            ],
            whyItMatters:
              "Untyped catch blocks hide the source of errors. Explicit error types force callers to handle both success and failure paths — making error-prone paths visible during code review.",
            commonPitfalls: [
              "Accessing error.message without narrowing — it may not be an Error instance",
              "Using Result<T> everywhere — it makes happy-path code verbose; use for known, recoverable errors only",
              "Throwing plain strings instead of Error objects — stack traces are lost",
            ],
          },
        },
      ],
    },
    {
      id: "ts-interview-questions",
      title: "Interview Questions",
      iconName: "HelpCircle",
      theory:
        "This section covers common TypeScript interview questions with practical, production-oriented answers. Focus on type modeling, safety, and maintainability trade-offs.",
      theoryDetail: {
        keyConcepts: [
          "Prefer clear type modeling over clever type tricks",
          "Explain trade-offs: runtime validation vs compile-time typing",
          "Use examples that show narrowing, generics, and utility types in real code",
        ],
        whyItMatters:
          "TypeScript interviews test whether you can design robust contracts and reduce runtime bugs in large codebases.",
        commonPitfalls: [
          "Using any to silence type errors instead of modeling data shape correctly",
          "Confusing compile-time type safety with runtime data validation",
          "Overusing advanced conditional types where simple unions would be clearer",
        ],
      },
      children: [
        {
          id: "ts-iq-any-vs-unknown",
          title: "any vs unknown",
          iconName: "ShieldAlert",
          theory: "Interviewers often ask this to test whether you understand safe type narrowing.",
          theoryDetail: {
            examples: [
              {
                title: "Q: any vs unknown",
                description:
                  "unknown is safer because it requires narrowing before use, while any disables type checking.",
                code: `function parse(input: unknown) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  return null;
}

// any would allow unsafe operations with no compiler warnings.`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-interface-vs-type",
          title: "interface vs type",
          iconName: "Shapes",
          theory: "Both can model object shapes, but they differ in capabilities and extension patterns.",
          theoryDetail: {
            examples: [
              {
                title: "Q: When to use interface vs type?",
                description:
                  "Use interface for object contracts and extension, type for unions/aliases/complex compositions.",
                code: `interface User {
  id: string;
  name: string;
}

type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-generics",
          title: "Generics in APIs",
          iconName: "Box",
          theory: "A frequent mid/senior question: designing reusable typed APIs without losing inference.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Build a typed fetch helper",
                description:
                  "Show generic return typing and explicit error handling.",
                code: `async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<T>;
}

type User = { id: string; name: string };
const user = await getJson<User>('/api/user/1');`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-discriminated-unions",
          title: "Discriminated Unions",
          iconName: "GitBranch",
          theory: "A common mid-level interview topic: using a shared literal field to narrow between union variants safely.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Model API response states with a discriminated union",
                description:
                  "A 'kind' or 'status' literal field lets TypeScript narrow the union in each branch without casting.",
                code: `type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'loading' };

function renderUser(result: ApiResult<User>) {
  switch (result.status) {
    case 'success': return result.data.name;
    case 'error':   return result.message;
    case 'loading': return 'Loading…';
  }
}`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-utility-types",
          title: "Utility Types in Practice",
          iconName: "Wrench",
          theory: "Interviewers ask about Partial, Pick, Omit, and Record to gauge whether candidates write DRY, maintainable types.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Derive a PATCH DTO type from an entity type",
                description:
                  "Use Partial + Pick to make only the updatable fields optional without duplicating the interface.",
                code: `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Only id is required; name and email are optional patch fields
type PatchUserDto = Pick<User, 'id'> & Partial<Pick<User, 'name' | 'email'>>;`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-type-guard",
          title: "Custom Type Guards",
          iconName: "ShieldCheck",
          theory: "Senior TypeScript questions often involve writing a type guard function to narrow an 'unknown' or union type in a reusable way.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Write a reusable type guard for a discriminated union",
                description:
                  "A function returning 'value is T' acts as a type predicate that narrows the type in the caller's scope.",
                code: `type Circle = { kind: 'circle'; radius: number };
type Rect   = { kind: 'rect';   width: number; height: number };
type Shape  = Circle | Rect;

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle';
}

function area(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2; // shape is Circle here
  }
  return shape.width * shape.height;    // shape is Rect here
}`,
                language: "ts",
              },
            ],
          },
        },
      ],
    },
  ],
};

export default typescript;
