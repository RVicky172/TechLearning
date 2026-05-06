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
import { ThrottlingDebouncingDemo } from "./demos/throttlingDebouncing";
// Basics
import {
  ConditionalRenderingDemo,
  ReactEventsDemo,
  ReactFormsDemo,
  ReactListsDemo,
  ReactPropsDemo,
  PropDrillingDemo,
} from "./demos/basicInteraction";
// Advanced
import {
  ReactPerformanceDemo,
  ReactBatchingDemo,
  AdvancedContextDemo,
  UseReducerCartDemo,
  OptimisticUpdatesDemo,
  ErrorBoundaryDemo,
} from "./demos/advancedDemos";
// Patterns
import {
  CompoundComponentsDemo,
  HOCDemo,
  RenderPropsDemo,
  CustomHooksRealDemo,
} from "./demos/patternDemos";

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
  | "portal"
  | "throttlingDebouncing"
  // Basics
  | "conditionalRendering"
  | "reactEvents"
  | "reactForms"
  | "reactLists"
  | "reactProps"
  | "propDrilling"
  // Advanced
  | "reactPerformance"
  | "reactBatching"
  | "advancedContext"
  | "useReducerCart"
  | "reactOptimistic"
  | "errorBoundary"
  // Patterns
  | "compoundComponents"
  | "hocDemo"
  | "renderPropsDemo"
  | "customHooksReal";

type HookDemoRendererProps = {
  demoKey: string;
};

const demoMap: Record<HookDemoKey, () => React.ReactNode> = {
  // Existing hooks
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
  throttlingDebouncing: ThrottlingDebouncingDemo,
  // Basics
  conditionalRendering: ConditionalRenderingDemo,
  reactEvents: ReactEventsDemo,
  reactForms: ReactFormsDemo,
  reactLists: ReactListsDemo,
  reactProps: ReactPropsDemo,
  propDrilling: PropDrillingDemo,
  // Advanced
  reactPerformance: ReactPerformanceDemo,
  reactBatching: ReactBatchingDemo,
  advancedContext: AdvancedContextDemo,
  useReducerCart: UseReducerCartDemo,
  reactOptimistic: OptimisticUpdatesDemo,
  errorBoundary: ErrorBoundaryDemo,
  // Patterns
  compoundComponents: CompoundComponentsDemo,
  hocDemo: HOCDemo,
  renderPropsDemo: RenderPropsDemo,
  customHooksReal: CustomHooksRealDemo,
};

export function HookDemoRenderer({ demoKey }: HookDemoRendererProps) {
  const Demo = demoMap[demoKey as HookDemoKey];
  if (!Demo) {
    return null;
  }

  return <Demo />;
}
