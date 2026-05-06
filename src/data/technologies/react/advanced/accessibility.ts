import type { TopicNode } from "@/data/types";

export const accessibility: TopicNode = {
  id: "react-accessibility",
  title: "Accessibility (a11y)",
  iconName: "Accessibility",
  link: "https://react.dev/reference/react-dom/components#form-components",
  theory:
    "Accessibility means building interfaces that everyone can use — including people who navigate with keyboards, use screen readers, or have visual/motor impairments. React's component model makes it straightforward to build accessible UIs: use semantic HTML, manage focus programmatically, and add ARIA attributes where HTML semantics fall short.",
  theoryDetail: {
    keyConcepts: [
      "Use semantic HTML first (<button>, <nav>, <main>, <form>) — they come with built-in keyboard and screen reader support",
      "Every interactive element must be keyboard-accessible: focusable, operable with Enter/Space, and have a visible focus indicator",
      "ARIA attributes (aria-label, aria-expanded, aria-live, role) add meaning when native HTML isn't sufficient",
      "Focus management: move focus programmatically after route changes, modal opens, or dynamic content updates",
      "Screen reader announcements: use aria-live regions for async updates, toasts, and form validation errors",
      "Color contrast: WCAG AA requires 4.5:1 for normal text, 3:1 for large text — test with browser DevTools",
    ],
    whyItMatters:
      "15-20% of users have some form of disability. Accessibility isn't optional — it's required by law in many jurisdictions (ADA, EAA) and it improves UX for everyone. Keyboard shortcuts help power users, semantic HTML improves SEO, and focus management prevents confusion. Building accessibility in from the start is 10x cheaper than retrofitting.",
    commonPitfalls: [
      "Using <div onClick> instead of <button> — divs aren't focusable or keyboard-operable by default",
      "Forgetting to label form inputs — every <input> needs a visible <label> or aria-label",
      "Removing focus outlines (outline: none) without providing a visible alternative",
      "Not managing focus after route changes in SPAs — screen readers announce nothing",
      "Using aria-label when visible text already describes the element — aria-label overrides visible text for screen readers",
      "Color-only indicators (red = error, green = success) — always include text or icons too",
    ],
    examples: [
      {
        title: "Accessible Modal with Focus Trap",
        description:
          "A modal must trap focus, close on Escape, and return focus to the trigger when dismissed.",
        code: `import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Remember what was focused before opening
      triggerRef.current = document.activeElement as HTMLElement;
      dialog.showModal();  // Native <dialog> traps focus automatically!
    } else {
      dialog.close();
      // Return focus to the element that opened the modal
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="modal"
    >
      <header>
        <h2 id="modal-title">{title}</h2>
        <button onClick={onClose} aria-label="Close modal">✕</button>
      </header>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}

// Usage:
// <button onClick={() => setOpen(true)}>Open Settings</button>
// <Modal isOpen={open} onClose={() => setOpen(false)} title="Settings">
//   <SettingsForm />
// </Modal>`,
        language: "tsx",
      },
      {
        title: "Accessible Form with Live Validation",
        description:
          "Form errors are announced to screen readers via aria-describedby and aria-invalid.",
        code: `import { useState, type FormEvent } from 'react';

interface FieldError { field: string; message: string }

export function SignupForm() {
  const [errors, setErrors] = useState<FieldError[]>([]);

  const validate = (formData: FormData): FieldError[] => {
    const errs: FieldError[] = [];
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email.includes('@')) errs.push({ field: 'email', message: 'Enter a valid email' });
    if (password.length < 8) errs.push({ field: 'password', message: 'At least 8 characters' });
    return errs;
  };

  const getError = (field: string) => errors.find(e => e.field === field);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      console.log('Submit!');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Announce errors to screen readers */}
      <div aria-live="polite" className="sr-only">
        {errors.length > 0 && \`\${errors.length} errors found\`}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          aria-invalid={!!getError('email')}
          aria-describedby={getError('email') ? 'email-error' : undefined}
        />
        {getError('email') && (
          <p id="email-error" className="error" role="alert">
            {getError('email')!.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-invalid={!!getError('password')}
          aria-describedby={getError('password') ? 'password-error' : undefined}
        />
        {getError('password') && (
          <p id="password-error" className="error" role="alert">
            {getError('password')!.message}
          </p>
        )}
      </div>

      <button type="submit">Create Account</button>
    </form>
  );
}`,
        language: "tsx",
      },
      {
        title: "Skip Navigation & Focus Management",
        description:
          "SPA route changes don't trigger page reloads, so you must manage focus manually for screen reader users.",
        code: `import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ── Skip Link: lets keyboard users skip repetitive nav ──
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      // CSS: position: absolute; left: -9999px;
      //      &:focus { left: 50%; transform: translateX(-50%); z-index: 1000; }
    >
      Skip to main content
    </a>
  );
}

// ── Focus on route change ──
function RouteAnnouncer() {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Focus main content after route change so screen readers
    // start reading from the new page, not the nav
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <main ref={mainRef} id="main-content" tabIndex={-1}>
      {/* Page content */}
    </main>
  );
}

// ── ARIA Live Region for dynamic updates ──
function Notifications({ messages }: { messages: string[] }) {
  return (
    // "polite" = announced after current speech finishes
    // "assertive" = interrupts immediately (use sparingly)
    <div aria-live="polite" aria-atomic="true">
      {messages.length > 0 && (
        <p>New notification: {messages[messages.length - 1]}</p>
      )}
    </div>
  );
}

// ── Common semantic HTML mistakes ──
// ❌ <div onClick={handleClick}>Submit</div>
// ✅ <button onClick={handleClick}>Submit</button>
//
// ❌ <div className="nav">...</div>
// ✅ <nav aria-label="Main navigation">...</nav>
//
// ❌ <span className="heading">Title</span>
// ✅ <h1>Title</h1>`,
        language: "tsx",
      },
    ],
  },
};
