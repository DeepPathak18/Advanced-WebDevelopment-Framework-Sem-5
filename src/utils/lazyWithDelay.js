import { lazy } from "react";

export const LAZY_ROUTE_DELAY_MS = 300;

// The minimum delay makes the loading fallback visible for demonstrations.
export function lazyWithDelay(importer) {
  return lazy(() =>
    Promise.all([
      importer(),
      new Promise((resolve) => setTimeout(resolve, LAZY_ROUTE_DELAY_MS)),
    ]).then(([module]) => module)
  );
}
