import { atomWithStorage } from "jotai/utils";

const ADMIN_MODE_ENABLED_STORAGE_KEY = "admin-mode-enabled";

export const adminModeEnabledAtom = atomWithStorage<boolean>(
  ADMIN_MODE_ENABLED_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);
