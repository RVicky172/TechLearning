import type { TopicNode } from "@/data/types";

export const htmlForms: TopicNode = {
  id: "html-forms",
  title: "Forms & Accessibility",
  iconName: "Input",
  theoryDetail: {
    keyConcepts: [
      "Form elements: <input>, <textarea>, <select>, <button>",
      "Labels: <label> associates text with inputs for better UX and a11y",
      "Input types: email, password, number, date, checkbox, radio, file",
      "Validation: HTML5 attributes (required, pattern, min/max) + server validation",
      "Accessibility: fieldset/legend, aria-labels, error messages",
      "Submit handling: form.onsubmit or button.onclick with preventDefault()",
    ],
    whyItMatters:
      "Forms are critical for user interaction. Accessible, properly validated forms improve user experience and reduce errors.",
    examples: [
      {
        title: "Accessible Form",
        description: "Well-structured form with labels and validation.",
        code: `<form id="signup-form" novalidate>
  <fieldset>
    <legend>Create Account</legend>

    <div>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        aria-describedby="email-error"
      />
      <span id="email-error" class="error" role="alert"></span>
    </div>

    <div>
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        minlength="8"
        required
        aria-describedby="password-hint"
      />
      <small id="password-hint">At least 8 characters</small>
    </div>

    <div>
      <label for="newsletter">
        <input
          id="newsletter"
          type="checkbox"
          name="newsletter"
        />
        Subscribe to newsletter
      </label>
    </div>

    <button type="submit">Sign Up</button>
  </fieldset>
</form>`,
        language: "html",
      },
    ],
  },
};
