import { useAtom, useSetAtom } from "jotai";

import {
  auctionBidInputAtom,
  auctionBidsByPlayerIdAtom,
  auctionModalOpenAtom,
  auctionOpenerPlayerIdAtom,
  auctionPassedPlayerIdsAtom,
  auctionPendingQuestionIdAtom,
  auctionTurnCursorAtom,
  auctionWinningBidByQuestionIdAtom,
  auctionWinningPlayerByQuestionIdAtom,
  resetAuctionFlowAtom,
} from "@/shared/store/specialAuctionAtom";

export function useAuctionState() {
  const [isModalOpen, setIsModalOpen] = useAtom(auctionModalOpenAtom);
  const [pendingQuestionId, setPendingQuestionId] = useAtom(auctionPendingQuestionIdAtom);
  const [openerPlayerId, setOpenerPlayerId] = useAtom(auctionOpenerPlayerIdAtom);
  const [turnCursor, setTurnCursor] = useAtom(auctionTurnCursorAtom);
  const [bidInput, setBidInput] = useAtom(auctionBidInputAtom);
  const [bidsByPlayerId, setBidsByPlayerId] = useAtom(auctionBidsByPlayerIdAtom);
  const [passedPlayerIds, setPassedPlayerIds] = useAtom(auctionPassedPlayerIdsAtom);
  const setWinningBidByQuestionId = useSetAtom(auctionWinningBidByQuestionIdAtom);
  const setWinningPlayerByQuestionId = useSetAtom(auctionWinningPlayerByQuestionIdAtom);
  const resetFlow = useSetAtom(resetAuctionFlowAtom);

  return {
    isModalOpen,
    setIsModalOpen,
    pendingQuestionId,
    setPendingQuestionId,
    openerPlayerId,
    setOpenerPlayerId,
    turnCursor,
    setTurnCursor,
    bidInput,
    setBidInput,
    bidsByPlayerId,
    setBidsByPlayerId,
    passedPlayerIds,
    setPassedPlayerIds,
    setWinningBidByQuestionId,
    setWinningPlayerByQuestionId,
    resetFlow,
  };
}

