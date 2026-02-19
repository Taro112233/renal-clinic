// lib/theme-manager.ts
"use client";

import {
  Stethoscope,
  Syringe,
  Leaf,
  Microscope,
  type LucideIcon,
} from "lucide-react";

export type ThemeId = "medical" | "clinical" | "wellness" | "research";
export type ThemeMode = "light" | "dark";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: [string, string];
  preview: LucideIcon;
  accent: string;
}

export const MEDICAL_THEMES: Theme[] = [
  {
    id: "medical",
    name: "Medical Teal",
    description: "Professional medical teal",
    colors: ["oklch(0.65 0.15 200)", "oklch(0.70 0.15 190)"],
    preview: Stethoscope,
    accent: "oklch(0.65 0.15 200)",
  },
  {
    id: "clinical",
    name: "Clinical Blue",
    description: "Hospital standard blue",
    colors: ["oklch(0.60 0.18 250)", "oklch(0.55 0.20 240)"],
    preview: Syringe,
    accent: "oklch(0.60 0.18 250)",
  },
  {
    id: "wellness",
    name: "Wellness Green",
    description: "Healing green vibes",
    colors: ["oklch(0.60 0.15 158)", "oklch(0.50 0.18 165)"],
    preview: Leaf,
    accent: "oklch(0.60 0.15 158)",
  },
  {
    id: "research",
    name: "Research Purple",
    description: "Scientific purple",
    colors: ["oklch(0.65 0.20 300)", "oklch(0.70 0.18 290)"],
    preview: Microscope,
    accent: "oklch(0.65 0.20 300)",
  },
];

export function applyTheme(themeId: ThemeId, mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  const fullTheme = `${themeId}-${mode}`;
  document.documentElement.setAttribute("data-theme", fullTheme);

  // Store preferences
  localStorage.setItem("nextjs-starter-theme", themeId);
  localStorage.setItem("nextjs-starter-mode", mode);

  // Smooth transition logic
  document.documentElement.style.transition =
    "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

  const timer = setTimeout(() => {
    document.documentElement.style.transition = "";
    clearTimeout(timer);
  }, 400);
}

export function getInitialTheme(): { theme: ThemeId; mode: ThemeMode } {
  if (typeof window === "undefined") {
    return { theme: "medical", mode: "dark" };
  }

  const savedTheme = localStorage.getItem("nextjs-starter-theme") as ThemeId;
  const validTheme = MEDICAL_THEMES.find((t) => t.id === savedTheme)
    ? savedTheme
    : "medical";

  const savedMode = localStorage.getItem("nextjs-starter-mode") as ThemeMode;
  const mode = savedMode || "light";
  
  return { theme: validTheme, mode };
}