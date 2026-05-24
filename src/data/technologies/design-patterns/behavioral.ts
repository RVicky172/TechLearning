import type { TopicNode } from "@/data/types";

export const patternsBehavioral: TopicNode = {
  id: "patterns-behavioral",
  title: "Structural & Behavioral Patterns",
  iconName: "GitBranch",
  link: "https://refactoring.guru/design-patterns",
  theory:
    "Structural patterns deal with object composition (how objects relate to each other), while behavioral patterns deal with object communication (how objects interact and delegate responsibilities). Together they cover the most-asked design pattern interview questions.",
  theoryDetail: {
    keyConcepts: [
      "Adapter: wraps an incompatible interface so it can be used as an expected interface — e.g. wrapping a third-party API to match your own interface",
      "Decorator: attaches additional responsibilities to an object dynamically — e.g. adding logging/caching/auth around a service",
      "Facade: provides a simplified interface to a complex subsystem — e.g. a NotificationService that internally orchestrates email, SMS, and push",
      "Observer: defines a one-to-many dependency so that when one object changes, all dependents are notified — foundation of event emitters, React state, and RxJS",
      "Strategy: defines a family of algorithms and makes them interchangeable — e.g. payment processing with multiple providers selectable at runtime",
      "Command: encapsulates a request as an object — enables undo/redo, queueing, logging of operations",
      "Middleware (Pipeline): chain of handlers where each can process/pass-on a request — core pattern of Express, Koa, Redux",
    ],
    whyItMatters:
      "You use behavioral patterns every day without realising it. Event listeners = Observer. Express middleware = Chain of Responsibility. Redux reducers = Command. Understanding the pattern names and intent lets you communicate clearly in code reviews and interviews, and helps you recognise the right pattern to reach for when solving a new problem.",
    commonPitfalls: [
      "Confusing Decorator with inheritance — Decorator composes, inheritance extends; Decorators can be stacked at runtime, inheritance cannot",
      "Over-using Observer — too many event listeners without cleanup causes memory leaks; always remove listeners when a component unmounts or a service shuts down",
      "Making Strategy classes stateful — Strategy objects should be stateless (pure behaviour); stateful strategies cause bugs when instances are shared",
    ],
    examples: [
      {
        title: "Observer pattern and Strategy pattern",
        description:
          "TypeScript Observer (event emitter) and Strategy (payment provider) implementations.",
        code: `// ── Observer (EventEmitter) ───────────────────────────────
type Listener<T> = (event: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as Listener<unknown>);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
    return this;
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }
}

// Usage
type OrderEvents = { placed: { orderId: string }; shipped: { trackingId: string } };
const orders = new EventEmitter<OrderEvents>();
orders.on("placed", ({ orderId }) => console.log("Order placed:", orderId));
orders.emit("placed", { orderId: "ORD-001" });

// ── Strategy pattern — payment provider ───────────────────
interface PaymentStrategy {
  charge(amount: number, currency: string): Promise<{ transactionId: string }>;
}

class StripeStrategy implements PaymentStrategy {
  async charge(amount: number, currency: string) {
    // Call Stripe API
    return { transactionId: "stripe_" + Math.random().toString(36).slice(2) };
  }
}

class PayPalStrategy implements PaymentStrategy {
  async charge(amount: number, currency: string) {
    // Call PayPal API
    return { transactionId: "paypal_" + Math.random().toString(36).slice(2) };
  }
}

class PaymentService {
  constructor(private strategy: PaymentStrategy) {}

  // Swap strategy at runtime without changing PaymentService code
  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  async checkout(amount: number, currency = "USD") {
    return this.strategy.charge(amount, currency);
  }
}

const payments = new PaymentService(new StripeStrategy());
await payments.checkout(4999);  // charged via Stripe
payments.setStrategy(new PayPalStrategy());
await payments.checkout(9999);  // charged via PayPal`,
        language: "typescript",
      },
    ],
  },
};
