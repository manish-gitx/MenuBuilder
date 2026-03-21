"use client"
import React from "react";
import { usePreviewTheme } from "@/contexts/PreviewThemeContext";
import { ThemeId } from "@/lib/themes";
import { MenuItem } from "../../lib/api";
import DefaultCard from "./themes/default/PreviewMenuItemCard";
import MidnightCard from "./themes/midnight/PreviewMenuItemCard";

interface PreviewMenuItemCardProps {
  item: MenuItem;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (item: MenuItem) => void;
  isInCart: (item: MenuItem) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<ThemeId, React.ComponentType<any>> = {
  default: DefaultCard,
  midnight: MidnightCard,
};

export default function PreviewMenuItemCard(props: PreviewMenuItemCardProps) {
  const { themeId } = usePreviewTheme();
  const Card = REGISTRY[themeId] ?? DefaultCard;
  return <Card {...props} />;
}
