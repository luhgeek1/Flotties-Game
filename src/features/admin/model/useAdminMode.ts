import { useAtom } from "jotai";

import { adminModeEnabledAtom } from "@/shared/store/adminModeAtom";

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useAtom(adminModeEnabledAtom);

  return {
    isAdminMode,
    setIsAdminMode,
  };
}
