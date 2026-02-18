import { AlertCircle, Gavel } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

import type { AuctionPlayer } from "../model";

type AuctionModalProps = {
  open: boolean;
  nominal: number;
  currentBid: number | null;
  leaderPlayerId: string | null;
  players: AuctionPlayer[];
  turnPlayerId: string | null;
  turnPlayerName: string | null;
  turnPlayerBalance: number;
  bidInput: string;
  minBid: number | null;
  passedPlayerIds: string[];
  isInputBidValid: boolean;
  onBidInputChange: (value: string) => void;
  onSubmitBid: () => void;
  onMinBid: () => void;
  onAllIn: () => void;
  onPass: () => void;
};

export function AuctionModal({
  open,
  nominal,
  currentBid,
  leaderPlayerId,
  players,
  turnPlayerId,
  turnPlayerName,
  turnPlayerBalance,
  bidInput,
  minBid,
  passedPlayerIds,
  isInputBidValid,
  onBidInputChange,
  onSubmitBid,
  onMinBid,
  onAllIn,
  onPass,
}: AuctionModalProps) {
  const passedPlayerIdSet = useMemo(
    () => new Set(passedPlayerIds),
    [passedPlayerIds],
  );
  const minBidLabel = useMemo(
    () => (minBid === null ? "—" : String(minBid)),
    [minBid],
  );
  const currentBidLabel = useMemo(
    () => (currentBid === null ? "—" : String(currentBid)),
    [currentBid],
  );
  const leaderPlayer = useMemo(
    () => (leaderPlayerId ? players.find(player => player.id === leaderPlayerId) ?? null : null),
    [leaderPlayerId, players],
  );
  const canAffordBid = turnPlayerId !== null && minBid !== null;
  const isOnePlayerLeft = passedPlayerIdSet.size >= Math.max(0, players.length - 1);

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="auction-betting"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-60 flex flex-col items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-slate-200/80 backdrop-blur-md z-[-1]" />

          <div className="w-full max-w-5xl min-h-[70vh] flex flex-col items-center justify-center relative bg-white shadow-2xl shadow-slate-200/50 rounded-[34px] border border-slate-200 px-6 py-10 sm:px-10">
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-2">
                  ВОПРОС-АУКЦИОН
                </h2>
                <div className="inline-block bg-slate-100 px-4 py-1 rounded-full">
                  <p className="text-slate-500 font-medium text-sm">
                    Номинал: <span className="text-slate-900 font-bold">{nominal}</span>
                  </p>
                </div>
              </div>

              <div className="w-full mb-12 flex flex-col items-center gap-8 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="flex flex-col items-center md:items-start md:justify-self-start min-w-200px">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    ТЕКУЩАЯ СТАВКА
                  </span>
                  <span className="text-7xl font-black text-slate-900 tabular-nums tracking-tighter">
                    {currentBidLabel}
                  </span>

                  {leaderPlayer ? (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ЛИДЕР
                      </span>
                      <div className="flex items-center space-x-2 bg-slate-100 pr-3 pl-1 py-0.5 rounded-full">
                        <img
                          src={leaderPlayer.avatarUrl}
                          className="w-5 h-5 rounded-full"
                          alt={leaderPlayer.name}
                        />
                        <span className="text-sm font-bold text-slate-900">
                          {leaderPlayer.name}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="hidden md:flex items-center justify-center text-slate-200 md:justify-self-center">
                  <Gavel size={48} strokeWidth={1.5} />
                </div>

                <div className="flex space-x-6 md:justify-self-end">
                  {players.map(player => {
                    const isFolded = passedPlayerIdSet.has(player.id);
                    const isCurrent = player.id === turnPlayerId && !isOnePlayerLeft;

                    return (
                      <div key={player.id} className="relative flex flex-col items-center group">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-full border-2 transition-all duration-300 relative overflow-hidden",
                            isCurrent ? "border-slate-900 scale-125 shadow-lg z-10" : "border-slate-100",
                            isFolded ? "opacity-20 grayscale" : "",
                          )}
                        >
                          <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div
                          className={cn(
                            "mt-3 text-xs font-bold px-2 py-0.5 rounded transition-colors",
                            isCurrent ? "bg-slate-900 text-white" : "text-slate-400",
                          )}
                        >
                          {player.score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isOnePlayerLeft ? (
                <div className="w-full max-w-lg">
                  <div className="flex items-end justify-between mb-4 px-1">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        ВАШ ХОД
                      </span>
                      <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">
                        {turnPlayerName ?? "Игрок"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        БАЛАНС
                      </span>
                      <p className="text-2xl font-black text-slate-900 leading-none mt-1">
                        {turnPlayerBalance}
                      </p>
                    </div>
                  </div>

                  {canAffordBid ? (
                    <div className="bg-white p-2 space-y-3">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder={`Мин: ${minBidLabel}`}
                          value={bidInput}
                          onChange={event => onBidInputChange(event.target.value)}
                          onKeyDown={event => {
                            if (event.key !== "Enter") return;
                            event.preventDefault();
                            onSubmitBid();
                          }}
                          className="grow bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 text-xl font-bold outline-none focus-visible:border-slate-900 focus-visible:bg-white transition-all placeholder:text-slate-300 text-slate-900"
                        />
                        <Button
                          type="button"
                          size="lg"
                          className="px-8 h-auto py-4 text-lg font-bold"
                          disabled={!bidInput || !isInputBidValid}
                          onClick={onSubmitBid}
                        >
                          Ставка
                        </Button>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 py-3 h-auto text-slate-900 border-slate-200 hover:border-slate-900"
                          disabled={minBid === null}
                          onClick={onMinBid}
                        >
                          Мин ({minBidLabel})
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 py-3 h-auto text-slate-900 border-slate-200 hover:border-slate-900"
                          disabled={!turnPlayerId || turnPlayerBalance <= 0}
                          onClick={onAllIn}
                        >
                          Ва-банк ({turnPlayerBalance})
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-auto px-5 h-auto py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-red-100"
                          disabled={!turnPlayerId}
                          onClick={onPass}
                        >
                          Пас
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex flex-col items-center text-slate-400 mb-6">
                        <AlertCircle size={40} className="mb-2 opacity-50" />
                        <p className="font-bold text-slate-900">Ставка невозможна</p>
                        <p className="text-sm">Недостаточно средств для повышения</p>
                      </div>
                      <Button type="button" variant="outline" onClick={onPass} className="w-48">
                        Пас
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
