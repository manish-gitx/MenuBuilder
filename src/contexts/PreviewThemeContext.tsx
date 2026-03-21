"use client"
import { createContext, useContext } from 'react'
import { ThemeId } from '@/lib/themes'

interface PreviewThemeContextValue {
  themeId: ThemeId
}

export const PreviewThemeContext = createContext<PreviewThemeContextValue>({
  themeId: 'default',
})

export function usePreviewTheme() {
  return useContext(PreviewThemeContext)
}
