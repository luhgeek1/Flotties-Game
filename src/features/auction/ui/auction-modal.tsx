import { AlertCircle, Gavel } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

import { PlayerAvatar } from "@/entities/players";
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
  isSinglePlayerMode: boolean;
  excludedPlayersCount: number;
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
  isSinglePlayerMode,
  excludedPlayersCount,
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
  const isOnePlayerLeft = !isSinglePlayerMode && passedPlayerIdSet.size >= Math.max(0, players.length - 1);

  return (
    <AnimatePresence mode="wait" initial={false}>
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
          <div className="absolute inset-0 z-[-1] bg-background/80 backdrop-blur-md" />

          <div className="relative flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center rounded-[34px] border border-border bg-card px-6 py-10 text-card-foreground shadow-2xl shadow-black/15 sm:px-10">
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-4xl font-black uppercase tracking-tight text-foreground">
                  ВОПРОС-АУКЦИОН
                </h2>
                <div className="inline-block rounded-full bg-muted px-4 py-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Номинал: <span className="font-bold text-foreground">{nominal}</span>
                  </p>
                </div>
              </div>

              <div className="w-full mb-12 flex flex-col items-center gap-8 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="flex flex-col items-center md:items-start md:justify-self-start min-w-200px">
                  <span className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    ТЕКУЩАЯ СТАВКА
                  </span>
                  <span className="text-7xl font-black text-foreground tabular-nums tracking-tighter">
                    {currentBidLabel}
                  </span>

                  {leaderPlayer ? (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        ЛИДЕР
                      </span>
                      <div className="flex items-center space-x-2 rounded-full bg-muted py-0.5 pl-1 pr-3">
                        <div className="w-5 h-5 rounded-full overflow-hidden">
                          <PlayerAvatar value={leaderPlayer.avatarUrl} alt={leaderPlayer.name} />
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {leaderPlayer.name}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="hidden items-center justify-center text-muted-foreground/40 md:flex md:justify-self-center">
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
                            isCurrent ? "z-10 scale-125 border-foreground shadow-lg" : "border-border",
                            isFolded ? "opacity-20 grayscale" : "",
                          )}
                        >
                          <PlayerAvatar value={player.avatarUrl} alt={player.name} />
                        </div>
                        <div
                          className={cn(
                            "mt-3 text-xs font-bold px-2 py-0.5 rounded transition-colors",
                            isCurrent ? "bg-foreground text-background" : "text-muted-foreground",
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
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {isSinglePlayerMode ? "СТАВКА ИГРОКА" : "ВАШ ХОД"}
                      </span>
                      <h3 className="mt-1 text-3xl font-black leading-none text-foreground">
                        {turnPlayerName ?? "Игрок"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        БАЛАНС
                      </span>
                      <p className="mt-1 text-2xl font-black leading-none text-foreground">
                        {turnPlayerBalance}
                      </p>
                    </div>
                  </div>

                  {canAffordBid ? (
                    <div className="space-y-3 bg-card p-2">
                      {isSinglePlayerMode ? (
                        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                          <span className="font-bold text-foreground">К торгам допущен только этот игрок.</span>
                          {excludedPlayersCount > 0 ? ` Остальные (${excludedPlayersCount}) не допущены.` : ""}
                        </div>
                      ) : null}

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
                          className="grow rounded-xl border-2 border-border bg-muted/40 px-4 py-4 text-xl font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:bg-card"
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
                          className="h-auto flex-1 border-border py-3 text-foreground hover:border-ring hover:bg-muted"
                          disabled={minBid === null}
                          onClick={onMinBid}
                        >
                          Мин ({minBidLabel})
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto flex-1 border-border py-3 text-foreground hover:border-ring hover:bg-muted"
                          disabled={!turnPlayerId || turnPlayerBalance <= 0}
                          onClick={onAllIn}
                        >
                          Ва-банк ({turnPlayerBalance})
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto w-auto border-2 border-transparent px-5 py-3 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900/40 dark:hover:bg-red-900/20"
                          disabled={!turnPlayerId}
                          onClick={onPass}
                          hidden={isSinglePlayerMode}
                        >
                          Пас
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border bg-muted/40 py-8 text-center">
                      <div className="mb-6 flex flex-col items-center text-muted-foreground">
                        <AlertCircle size={40} className="mb-2 opacity-50" />
                        <p className="font-bold text-foreground">Ставка невозможна</p>
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
