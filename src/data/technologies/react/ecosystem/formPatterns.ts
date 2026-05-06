import type { TopicNode } from "@/data/types";

export const formPatterns: TopicNode = {
  id: "react-form-patterns",
  title: "Advanced Form Patterns",
  iconName: "FileInput",
  link: "https://react.dev/reference/react-dom/components/form",
  theory:
    "React 19 introduced native form handling with Server Actions, useActionState, and useFormStatus. For complex client-side forms, React Hook Form remains the go-to library — it minimizes re-renders with uncontrolled inputs and provides powerful validation via Zod/Yup schemas. Understanding both patterns lets you choose the right tool for each form.",
  theoryDetail: {
    keyConcepts: [
      "React 19 <form action={serverAction}> — forms can call server functions directly without manual fetch/useEffect",
      "useActionState(action, initialState) — tracks pending state and returns the server response",
      "useFormStatus() — child components can check if the parent form is submitting (for disable/loading UI)",
      "React Hook Form uses uncontrolled inputs by default — register() connects inputs without re-rendering on every keystroke",
      "Zod schema validation with zodResolver — define validation once, get TypeScript types automatically",
      "Multi-step forms use React Hook Form's FormProvider + useFormContext for shared state across steps",
    ],
    whyItMatters:
      "Forms are the primary way users send data. Poorly built forms frustrate users and introduce bugs. React 19's native form features simplify server mutations (no more manual loading states), while React Hook Form handles complex client-side validation and multi-step flows. Together, they cover every form use case in modern React.",
    commonPitfalls: [
      "Using controlled inputs for every field — causes re-renders on every keystroke; use uncontrolled when possible",
      "Client-side-only validation — always validate on the server too; client validation is for UX, not security",
      "Not showing inline field errors — users shouldn't have to scroll to find what's wrong",
      "Forgetting loading states — always disable the submit button and show feedback during submission",
      "Mixing React Hook Form with manual useState — either use RHF fully or don't use it at all",
    ],
    examples: [
      {
        title: "React 19 Native Form with Server Action",
        description:
          "The simplest form pattern in React 19 — no useState, no useEffect, no fetch. The form calls a server function directly.",
        code: `// app/actions.ts
'use server';

import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'At least 10 characters'),
});

export async function submitContact(prevState: any, formData: FormData) {
  const parsed = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // Save to database, send email, etc.
  await saveContact(parsed.data);
  return { success: true };
}

// ──────────────────────────────────
// app/contact/ContactForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact } from '../actions';

// Extracted so it can use useFormStatus()
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Your name" />
      {state?.errors?.name && <p className="error">{state.errors.name}</p>}

      <input name="email" type="email" placeholder="Email" />
      {state?.errors?.email && <p className="error">{state.errors.email}</p>}

      <textarea name="message" placeholder="Message" />
      {state?.errors?.message && <p className="error">{state.errors.message}</p>}

      <SubmitButton />
      {state?.success && <p className="success">Message sent!</p>}
    </form>
  );
}`,
        language: "tsx",
      },
      {
        title: "React Hook Form with Zod Validation",
        description:
          "Complex client-side form with schema validation, inline errors, and minimal re-renders.",
        code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ── Define schema — validation + TypeScript types in one place ──
const SignupSchema = z.object({
  username: z.string()
    .min(3, 'At least 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// TypeScript type is automatically inferred from the schema
type SignupForm = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const {
    register,       // Connect inputs to form state (uncontrolled)
    handleSubmit,   // Wraps your submit handler with validation
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    // data is fully typed and validated
    console.log(data);
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" {...register('username')} />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('agreeToTerms')} />
          I agree to the terms
        </label>
        {errors.agreeToTerms && <p className="error">{errors.agreeToTerms.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}`,
        language: "tsx",
      },
      {
        title: "Multi-Step Form with React Hook Form",
        description:
          "FormProvider shares form state across step components without prop drilling.",
        code: `import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { useState } from 'react';

interface WizardForm {
  // Step 1
  firstName: string;
  lastName: string;
  // Step 2
  email: string;
  phone: string;
  // Step 3
  plan: 'free' | 'pro' | 'enterprise';
}

function Step1() {
  const { register, formState: { errors } } = useFormContext<WizardForm>();
  return (
    <div>
      <h3>Personal Info</h3>
      <input {...register('firstName', { required: 'Required' })} placeholder="First name" />
      {errors.firstName && <p className="error">{errors.firstName.message}</p>}
      <input {...register('lastName', { required: 'Required' })} placeholder="Last name" />
      {errors.lastName && <p className="error">{errors.lastName.message}</p>}
    </div>
  );
}

function Step2() {
  const { register, formState: { errors } } = useFormContext<WizardForm>();
  return (
    <div>
      <h3>Contact</h3>
      <input {...register('email', { required: 'Required' })} type="email" placeholder="Email" />
      {errors.email && <p className="error">{errors.email.message}</p>}
      <input {...register('phone')} type="tel" placeholder="Phone (optional)" />
    </div>
  );
}

function Step3() {
  const { register } = useFormContext<WizardForm>();
  return (
    <div>
      <h3>Choose a Plan</h3>
      {['free', 'pro', 'enterprise'].map((plan) => (
        <label key={plan}>
          <input type="radio" value={plan} {...register('plan', { required: true })} />
          {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </label>
      ))}
    </div>
  );
}

const STEPS = [Step1, Step2, Step3];
const STEP_FIELDS: Record<number, (keyof WizardForm)[]> = {
  0: ['firstName', 'lastName'],
  1: ['email', 'phone'],
  2: ['plan'],
};

export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const methods = useForm<WizardForm>({ mode: 'onTouched' });
  const StepComponent = STEPS[step];

  const handleNext = async () => {
    // Validate only the current step's fields
    const isValid = await methods.trigger(STEP_FIELDS[step]);
    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: WizardForm) => {
    console.log('Final submission:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="progress">Step {step + 1} of {STEPS.length}</div>
        <StepComponent />
        <div className="actions">
          {step > 0 && <button type="button" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < STEPS.length - 1
            ? <button type="button" onClick={handleNext}>Next</button>
            : <button type="submit">Submit</button>
          }
        </div>
      </form>
    </FormProvider>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
