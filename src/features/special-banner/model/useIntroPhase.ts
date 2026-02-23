import { useEffect, useState } from "react";

import { INTRO_MS } from "./constants";
import type { SpecialBannerPhase } from "./types";

type UseIntroPhaseArgs = {
  introMs?: number;
};

export function useIntroPhase({
  introMs = INTRO_MS,
}: UseIntroPhaseArgs = {}): SpecialBannerPhase {
  const [phase, setPhase] = useState<SpecialBannerPhase>("intro");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPhase("main");
    }, introMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [introMs]);

  return phase;
}
