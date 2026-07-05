"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns false during SSR and the initial client render, then true afterwards.
 * Use to gate client-only/persisted values (e.g. localStorage-backed state) so the
 * first client render matches the server-rendered HTML and avoids hydration mismatches.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
