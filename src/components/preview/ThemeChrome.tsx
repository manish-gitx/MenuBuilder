"use client"
import React from "react";
import { ThemeId } from "@/lib/themes";
import { MenuItem } from "@/lib/api";
import DefaultChrome from "./themes/default/PageChrome";
import MidnightChrome from "./themes/midnight/PageChrome";

interface ThemeChromeProps {
  themeId: ThemeId;
  cart: MenuItem[];
  previewText: string;
  onShowConfirm: () => void;
  onShowMenuModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<ThemeId, React.ComponentType<any>> = {
  default: DefaultChrome,
  midnight: MidnightChrome,
};

export default function ThemeChrome(props: ThemeChromeProps) {
  const Chrome = REGISTRY[props.themeId] ?? DefaultChrome;
  return <Chrome {...props} />;
}
