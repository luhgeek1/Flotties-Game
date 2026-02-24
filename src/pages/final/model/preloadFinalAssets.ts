import closeEyesRuImage from "@/shared/assets/closeEyesRu.png";
import doFinalImage from "@/shared/assets/dofinal.png";
import readingLottiImage from "@/shared/assets/izuglalotti.png";
import smileLottiImage from "@/shared/assets/smileLotti.png";

export type FinalFlowStage =
  | "finalprepairing"
  | "finalstarttheme"
  | "finalcloseeyes"
  | "finalbid"
  | "finalcloseeyesquestion"
  | "finalquestion";

type FinalStagePreloadPlan = {
  immediate: string[];
  idle: string[];
};

function uniqueUrls(urls: readonly string[]): string[] {
  return Array.from(new Set(urls.filter(Boolean)));
}

const FINAL_STAGE_PRELOAD: Record<FinalFlowStage, FinalStagePreloadPlan> = {
  finalprepairing: {
    immediate: [doFinalImage],
    idle: [closeEyesRuImage, smileLottiImage],
  },
  finalstarttheme: {
    immediate: [],
    idle: [closeEyesRuImage, smileLottiImage],
  },
  finalcloseeyes: {
    immediate: [closeEyesRuImage],
    idle: [smileLottiImage],
  },
  finalbid: {
    immediate: [smileLottiImage],
    idle: [closeEyesRuImage, readingLottiImage],
  },
  finalcloseeyesquestion: {
    immediate: [closeEyesRuImage],
    idle: [readingLottiImage, smileLottiImage],
  },
  finalquestion: {
    immediate: [readingLottiImage],
    idle: [smileLottiImage],
  },
};

export const FINAL_FLOW_IMAGE_URLS = uniqueUrls([
  doFinalImage,
  closeEyesRuImage,
  smileLottiImage,
  readingLottiImage,
]);

export function getFinalStagePreloadPlan(stage: FinalFlowStage): FinalStagePreloadPlan {
  return FINAL_STAGE_PRELOAD[stage];
}
