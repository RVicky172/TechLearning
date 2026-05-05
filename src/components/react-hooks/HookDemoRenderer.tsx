"use client";

import React from "react";
// Import all demo components from organized modules
import { CreateCustomHookGuideDemo, UseStateDemo, UseEffectDemo } from "./demos/basicDemos";
import { UseReducerDemo, UseRefDemo } from "./demos/stateManagement";
import { UseMemoCallbackDemo } from "./demos/performance";
import { UseContextDemo } from "./demos/context";
import { UseLayoutEffectDemo } from "./demos/effects";
import { UseTransitionDeferredDemo, UseDeferredValueDemo } from "./demos/concurrent";
import { UseIdDemo, UseImperativeHandleDemo } from "./demos/imperative";
import { UseSyncExternalStoreDemo, UseDebugValueDemo } from "./demos/external";
import { UseInsertionEffectDemo, UseActionStateDemo, UseOptimisticDemo } from "./demos/serverActions";
import { UseEffectEventDemo, UseStateEventDemo, UseWithProviderDemo } from "./demos/eventUtils";
import { RefAsPropDemo, PortalDemo } from "./demos/refs";

type HookDemoKey =
  | "createCustomHookGuide"
  | "useState"
  | "useEffect"
  | "useReducer"
  | "useRef"
  | "useMemoCallback"
  | "useContext"
  | "useLayoutEffect"
  | "useTransitionDeferred"
  | "useId"
  | "useImperativeHandle"
  | "useDeferredValue"
  | "useSyncExternalStore"
  | "useDebugValue"
  | "useInsertionEffect"
  | "use"
  | "useActionState"
  | "useOptimistic"
  | "useEffectEvent"
  | "useStateEvent"
  | "refAsProp"
  | "portal";

type HookDemoRendererProps = {
  demoKey: string;
};

const demoMap: Record<HookDemoKey, () => React.ReactNode> = {
  createCustomHookGuide: CreateCustomHookGuideDemo,
  useState: UseStateDemo,
  useEffect: UseEffectDemo,
  useReducer: UseReducerDemo,
  useRef: UseRefDemo,
  useMemoCallback: UseMemoCallbackDemo,
  useContext: UseContextDemo,
  useLayoutEffect: UseLayoutEffectDemo,
  useTransitionDeferred: UseTransitionDeferredDemo,
  useId: UseIdDemo,
  useImperativeHandle: UseImperativeHandleDemo,
  useDeferredValue: UseDeferredValueDemo,
  useSyncExternalStore: UseSyncExternalStoreDemo,
  useDebugValue: UseDebugValueDemo,
  useInsertionEffect: UseInsertionEffectDemo,
  use: UseWithProviderDemo,
  useActionState: UseActionStateDemo,
  useOptimistic: UseOptimisticDemo,
  useEffectEvent: UseEffectEventDemo,
  useStateEvent: UseStateEventDemo,
  refAsProp: RefAsPropDemo,
  portal: PortalDemo,
};

export function HookDemoRenderer({ demoKey }: HookDemoRendererProps) {
  const Demo = demoMap[demoKey as HookDemoKey];
  if (!Demo) {
    return null;
  }

  return <Demo />;
}
