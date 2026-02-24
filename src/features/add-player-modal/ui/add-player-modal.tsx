import { Palette, Plus, UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  CosmeticsAvatarPicker,
  CosmeticsBannerPicker,
  type AddPlayerValues,
  type AvatarOption,
  type BannerOption,
} from "@/entities/cosmetics";
import type { PlayerId } from "@/entities/players";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import { useTheme } from "@/app/lib/use-theme";
import { cn } from "@/shared/lib/utils";

import { useAddPlayerModal } from "../model/use-add-player-modal";

type AddPlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: AddPlayerValues, editingPlayerId: PlayerId | null) => void;
  presetAvatars: AvatarOption[];
  bannerOptions: BannerOption[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function AddPlayerModal({
  isOpen,
  onClose,
  onSave,
  presetAvatars,
  bannerOptions,
}: AddPlayerModalProps) {
  const {
    nickname,
    avatar,
    banner,
    editingPlayerId,
    error,
    fileRef,
    inputRef,
    setAvatar,
    setBanner,
    close,
    triggerUpload,
    onFileChange,
    submit,
    onNicknameChange,
  } = useAddPlayerModal({
    isOpen,
    onClose,
    onSave,
  });
  const { isDark } = useTheme();

  const modalTitle = editingPlayerId ? "Редактирование игрока" : "Новый игрок";
  const isDefaultBanner = banner === "bg-white";
  const isDarkDefaultBanner = isDark && isDefaultBanner;
  const resolvedBannerClassName = banner
    ? isDefaultBanner ? `${banner} dark:bg-slate-800` : banner
    : "bg-background";

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={modalTitle}
      contentClassName={cn(
        resolvedBannerClassName,
        isDarkDefaultBanner ? "border-slate-700 text-slate-100" : "border-slate-200 text-slate-900",
      )}
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex flex-col items-center gap-6 pt-2">
          <div className="relative">
            <motion.button
              type="button"
              onClick={triggerUpload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all border-4 overflow-hidden shadow-sm relative",
                isDarkDefaultBanner ? "border-slate-200 bg-slate-900/40" : "border-slate-900 bg-slate-50",
              )}
            >
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </motion.button>

            <motion.button
              type="button"
              onClick={triggerUpload}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg border-4",
                isDarkDefaultBanner
                  ? "bg-slate-100 text-slate-900 border-slate-800"
                  : "bg-slate-900 text-white border-white",
              )}
            >
              <Plus size={16} strokeWidth={3} />
            </motion.button>
          </div>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            onChange={onFileChange}
          />

          <CosmeticsAvatarPicker
            options={presetAvatars}
            selectedValue={avatar}
            onSelect={setAvatar}
            isDarkSurface={isDarkDefaultBanner}
          />
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <label htmlFor="nickname" className="text-sm font-semibold text-current block">
            Никнейм
          </label>

          <div className="relative">
            <UserCircle2 className={cn(
              "absolute left-3 top-2.5 h-5 w-5",
              isDarkDefaultBanner ? "text-slate-300" : "text-slate-400",
            )}
            />
            <Input
              ref={inputRef}
              id="nickname"
              placeholder="Введите имя..."
              value={nickname}
              onChange={event => onNicknameChange(event.target.value)}
              className={cn(
                "pl-10",
                isDarkDefaultBanner
                  ? "border-slate-600 bg-slate-900/45 text-slate-100 placeholder:text-slate-300 focus-visible:border-slate-100 focus-visible:ring-slate-100/20"
                  : "border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-900/20",
              )}
              onKeyDown={event => {
                if (event.key === "Enter") {
                  submit();
                }
              }}
            />
          </div>

          <AnimatePresence initial={false}>
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="text-sm text-red-500 font-medium"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <label className="text-sm font-semibold text-current flex items-center gap-2">
            <Palette size={16} />
            Оформление
          </label>

          <CosmeticsBannerPicker
            options={bannerOptions}
            selectedValue={banner}
            onSelect={setBanner}
            isDarkTheme={isDark}
            selectedIndicatorLayoutId="add-player-selected-banner-dot"
          />
        </motion.div>

        <motion.div variants={item} className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className={cn(
              "flex-1",
              isDarkDefaultBanner ? "border-slate-500 text-slate-100 hover:bg-slate-700/50 hover:text-slate-100" : "",
            )}
            onClick={close}
          >
            Отмена
          </Button>

          <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Button
              className={cn(
                "w-full",
                isDarkDefaultBanner
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              )}
              onClick={submit}
            >
              Сохранить
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Modal>
  );
}
