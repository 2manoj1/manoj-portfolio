"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useHydratedThemeMode() {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme } = useTheme();

  return isHydrated && resolvedTheme === "light" ? "light" : "dark";
}
