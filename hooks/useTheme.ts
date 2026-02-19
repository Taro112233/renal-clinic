// hooks/useTheme.ts
"use client";

import { useState, useEffect } from "react";
import {
  applyTheme,
  getInitialTheme,
  MEDICAL_THEMES,
  type ThemeId,
  type ThemeMode,
  type Theme,
} from "@/lib/theme-manager";

export function useTheme() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("medical");
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const { theme, mode: initialMode } = getInitialTheme();
    setActiveTheme(theme);
    setMode(initialMode);
    setIsInitialized(true);
    applyTheme(theme, initialMode);
  }, []);

  const changeTheme = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    applyTheme(themeId, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    applyTheme(activeTheme, newMode);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    applyTheme(activeTheme, newMode);
  };

  const currentTheme: Theme =
    MEDICAL_THEMES.find((theme) => theme.id === activeTheme) ||
    MEDICAL_THEMES[0];

  return {
    activeTheme,
    mode,
    isDark: mode === "dark",
    isInitialized,
    currentTheme,
    themes: MEDICAL_THEMES,
    changeTheme,
    toggleMode,
    setThemeMode,
  };
}