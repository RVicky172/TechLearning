"use client";

import { useState, useInsertionEffect, useActionState, useOptimistic } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

export function UseInsertionEffectDemo() {
  const renderCount = useRenderCount();
  const [tone, setTone] = useState<"warm" | "cool">("warm");

  useInsertionEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.dataset.dynamicTone = "true";
    styleTag.textContent =
      tone === "warm"
        ? ":root { --dynamic-accent: #ce5a1f; --dynamic-soft: #ffe6c7; }"
        : ":root { --dynamic-accent: #006d5b; --dynamic-soft: #d7fff4; }";
    document.head.appendChild(styleTag);

    return () => styleTag.remove();
  }, [tone]);

  return (
    <DemoCard title="useInsertionEffect">
      <RenderBadge count={renderCount} />
      <p>Injects dynamic CSS before layout effects run.</p>
      <button
        type="button"
        onClick={() => setTone(value => (value === "warm" ? "cool" : "warm"))}
        className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
      >
        Toggle tone ({tone})
      </button>
    </DemoCard>
  );
}

export function UseActionStateDemo() {
  const renderCount = useRenderCount();
  const [status, submitForm, isPending] = useActionState(
    async (_prevState: string, formData: FormData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const feedback = String(formData.get("feedback") ?? "").trim();
      if (!feedback) {
        return "Please enter feedback first.";
      }
      return `Saved: ${feedback}`;
    },
    "No feedback submitted yet."
  );

  return (
    <DemoCard title="useActionState">
      <RenderBadge count={renderCount} />
      <p>Handles async form actions with pending state.</p>
      <form action={submitForm} className="space-y-3">
        <label htmlFor="feedback" className="block text-(--text-1)">
          Feedback
        </label>
        <input
          id="feedback"
          name="feedback"
          placeholder="Share a note"
          className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated) disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
        <small className="block">{status}</small>
      </form>
    </DemoCard>
  );
}

export function UseOptimisticDemo() {
  const renderCount = useRenderCount();
  const [likes, setLikes] = useState(5);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (state, amount: number) => state + amount);

  return (
    <DemoCard title="useOptimistic">
      <RenderBadge count={renderCount} />
      <p>Shows immediate optimistic UI before confirmation.</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            addOptimisticLike(1);
            setTimeout(() => setLikes(value => value + 1), 700);
          }}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Like ({optimisticLikes})
        </button>
        <small>Confirmed: {likes}</small>
      </div>
    </DemoCard>
  );
}
