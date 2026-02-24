import { useEffect, useRef } from "react";

import { preloadImages, preloadImagesWhenIdle } from "@/shared/lib/imagePreload";

import type { AppRoute } from "../lib/route-guard";
import { getRouteImagePreloadPlan } from "./routeImagePreload";

export function useRouteImagePreload(route: AppRoute) {
  const cancelIdleImagePreloadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const { immediate, idle } = getRouteImagePreloadPlan(route);

    if (immediate.length > 0) {
      void preloadImages(immediate, {
        fetchPriority: "high",
      });
    }

    cancelIdleImagePreloadRef.current?.();
    cancelIdleImagePreloadRef.current = preloadImagesWhenIdle(idle, {
      fetchPriority: "low",
      timeoutMs: 2500,
      delayMs: 280,
    });

    return () => {
      cancelIdleImagePreloadRef.current?.();
      cancelIdleImagePreloadRef.current = null;
    };
  }, [route]);
}
