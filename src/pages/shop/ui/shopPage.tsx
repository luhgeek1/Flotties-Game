import { ArrowLeft, Moon, ShoppingBag, Sun } from "lucide-react";
import { PlayerAvatar } from "@/entities/players";
import { ShopPlayerSelectModal, ShopSection } from "@/features/shop";
import { Button } from "@/shared/components/ui/button";
import { useShopPage } from "../model/useShopPage";

type ShopPageProps = {
  onBackToSetup?: () => void;
};

export function ShopPage({ onBackToSetup }: ShopPageProps) {
  const {
    isDark,
    toggleTheme,
    players,
    activePlayer,
    resolvedPlayerName,
    inventoryCount,
    equippedAvatarName,
    equippedThemeName,
    equippedThemeValue,
    isPlayerSelectOpen,
    openPlayerSelect,
    closePlayerSelect,
    selectPlayer,
  } = useShopPage();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Переключить тему"
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-30 rounded-full border border-border bg-card/70 backdrop-blur hover:bg-card md:right-8 md:top-8"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onBackToSetup}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            К настройке
          </Button>

          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Магазин</span>

            <button
              type="button"
              onClick={openPlayerSelect}
              className="ml-2 flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 transition-colors hover:bg-card"
            >
              {activePlayer ? (
                <div className="h-6 w-6 rounded-full overflow-hidden border border-border/80">
                  <PlayerAvatar value={activePlayer.avatarUrl} alt={activePlayer.name} />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border border-border/80" />
              )}
              <span className="text-xs font-semibold text-foreground truncate max-w-30">
                {activePlayer?.name ?? "Выбрать игрока"}
              </span>
            </button>
          </div>
        </div>

        <ShopSection
          playerName={resolvedPlayerName}
          inventoryCount={inventoryCount}
          equippedAvatarName={equippedAvatarName}
          equippedThemeName={equippedThemeName}
          equippedThemeValue={equippedThemeValue}
        />
      </div>

      <ShopPlayerSelectModal
        isOpen={isPlayerSelectOpen}
        players={players}
        onClose={closePlayerSelect}
        onSelectPlayer={selectPlayer}
      />
    </div>
  );
}
