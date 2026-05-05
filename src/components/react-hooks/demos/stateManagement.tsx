"use client";

import { useState, useReducer, useRef, useEffect } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

type Todo = { id: number; text: string; done: boolean };
type TodoAction = { type: "add"; text: string } | { type: "toggle"; id: number } | { type: "remove"; id: number };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "toggle":
      return state.map(todo => (todo.id === action.id ? { ...todo, done: !todo.done } : todo));
    case "remove":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

export function UseReducerDemo() {
  const renderCount = useRenderCount();
  const [input, setInput] = useState("");
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: 1, text: "Build reducer demo", done: true },
    { id: 2, text: "Dispatch actions", done: false },
  ]);

  return (
    <DemoCard title="useReducer">
      <RenderBadge count={renderCount} />
      <div className="flex flex-wrap gap-2">
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Add task"
          className="min-w-60 flex-1 rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
        />
        <button
          type="button"
          onClick={() => {
            if (!input.trim()) {
              return;
            }
            dispatch({ type: "add", text: input.trim() });
            setInput("");
          }}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => dispatch({ type: "toggle", id: todo.id })}
              />
              <span className={todo.done ? "line-through" : ""}>{todo.text}</span>
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: "remove", id: todo.id })}
              className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}

export function UseRefDemo() {
  const renderCount = useRenderCount();
  const [draft, setDraft] = useState("React refs are useful for imperative DOM access.");
  const [lastRead, setLastRead] = useState("Nothing read yet.");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DemoCard title="useRef">
      <RenderBadge count={renderCount} />
      <input
        ref={inputRef}
        value={draft}
        onChange={event => setDraft(event.target.value)}
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Focus input
        </button>
        <button
          type="button"
          onClick={() => {
            if (!inputRef.current) {
              return;
            }
            inputRef.current.value = draft.toUpperCase();
            inputRef.current.focus();
          }}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Modify with ref
        </button>
        <button
          type="button"
          onClick={() => setLastRead(inputRef.current?.value ?? "Input is not available.")}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Read current value
        </button>
      </div>
      <p>Last value read from ref: {lastRead}</p>
    </DemoCard>
  );
}
