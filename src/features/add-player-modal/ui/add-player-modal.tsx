import { Palette, Plus, UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { PlayerId } from "@/entities/players";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import type { AddPlayerValues, AvatarOption, BannerOption } from "../model/defaults";
import { useAddPlayerModal } from "../model/use-add-player-modal";
import { Modal } from "./modal";

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

  const modalTitle = editingPlayerId ? "Редактирование игрока" : "Новый игрок";

  return (
    <Modal isOpen={isOpen} onClose={close} title={modalTitle} contentClassName={banner}>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex flex-col items-center gap-6 pt-2">
          <div className="relative">
            <motion.button
              type="button"
              onClick={triggerUpload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all border-4 overflow-hidden shadow-sm relative
                border-slate-900 bg-slate-50
              `}
            >
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </motion.button>

            <motion.button
              type="button"
              onClick={triggerUpload}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-2 -right-2 bg-slate-900 text-white rounded-full p-2 shadow-lg border-4 border-white"
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

          <div className="flex justify-center gap-3 w-full">
            {presetAvatars.map(option => {
              const isSelected = avatar === option.value;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setAvatar(option.value)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 relative overflow-hidden
                    ${isSelected ? "border-slate-900 ring-1 ring-slate-900 scale-110 z-10" : "border-transparent hover:bg-slate-100"}
                    bg-transparent
                  `}
                >
                  <img src={option.value} alt="Preset avatar" className="h-full w-full object-cover rounded-full" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <label htmlFor="nickname" className="text-sm font-semibold text-slate-900 block">
            Никнейм
          </label>

          <div className="relative">
            <UserCircle2 className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              ref={inputRef}
              id="nickname"
              placeholder="Введите имя..."
              value={nickname}
              onChange={event => onNicknameChange(event.target.value)}
              className="pl-10 border-slate-200 bg-white/90 focus-visible:border-slate-900 focus-visible:ring-slate-900/20"
              onKeyDown={event => {
                if (event.key === "Enter") {
                  submit();
                }
              }}
            />
          </div>

          <AnimatePresence>
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
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Palette size={16} />
            Оформление
          </label>

          <div className="grid grid-cols-5 gap-2">
            {bannerOptions.map(option => {
              const isSelected = banner === option.value;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  title={option.label}
                  onClick={() => setBanner(option.value)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    h-10 rounded-lg border-2 transition-all
                    ${option.value}
                    ${isSelected ? "border-slate-900 ring-1 ring-slate-900 shadow-sm" : "border-transparent hover:border-slate-300"}
                  `}
                >
                  {isSelected ? (
                    <motion.div
                      layoutId="selectedBannerDot"
                      className="w-full h-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-slate-900 rounded-full" />
                    </motion.div>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={close}>
            Отмена
          </Button>

          <motion.div className="flex-1" whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={submit}>
              Сохранить
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Modal>
  );
}
