import { useAtom } from "jotai";

import { adminModeEnabledAtom } from "@/features/admin/store/adminModeAtom";

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useAtom(adminModeEnabledAtom);

  return {
    isAdminMode,
    setIsAdminMode,
  };
}
