export type ThemeId = 'default' | 'midnight'

export interface ThemeTokens {
  // Surfaces
  '--preview-bg': string
  '--preview-surface': string
  '--preview-surface-low': string
  '--preview-surface-muted': string
  // Borders
  '--preview-border': string
  '--preview-border-strong': string
  // Text
  '--preview-text-primary': string
  '--preview-text-secondary': string
  '--preview-text-muted': string
  // Accent
  '--preview-accent': string
  '--preview-accent-text': string
  '--preview-accent-subtle': string
  // Navigation / floating elements
  '--preview-nav-bg': string
  '--preview-nav-border': string
  // Cart bar
  '--preview-cart-bg': string
  '--preview-cart-text': string
  '--preview-cart-subtext': string
  '--preview-cart-badge': string
  '--preview-cart-badge-text': string
  // Misc surfaces
  '--preview-image-placeholder': string
  '--preview-tag-bg': string
  '--preview-overlay-bg': string
  '--preview-confirm-bg': string
  '--preview-confirm-bar-bg': string
  // Layout tokens (allow theme-specific shape/sizing)
  '--preview-card-radius': string
  '--preview-image-radius': string
  '--preview-add-btn-size': string
  '--preview-add-btn-bg': string
  '--preview-add-btn-color': string
  '--preview-add-btn-radius': string
  '--preview-count-radius': string
  '--preview-cat-name-transform': string
  '--preview-cat-name-tracking': string
  '--preview-subcat-tracking': string
  // Scroll area padding (theme-specific layout)
  '--preview-scroll-pt': string
  '--preview-scroll-px': string
  // Typography
  '--preview-font-family': string
}

export const themes: Record<ThemeId, ThemeTokens> = {
  default: {
    '--preview-bg': '#f9f9fb',
    '--preview-surface': '#ffffff',
    '--preview-surface-low': '#f2f4f6',
    '--preview-surface-muted': 'rgba(249,249,251,0.95)',
    '--preview-border': 'rgba(172,179,184,0.1)',
    '--preview-border-strong': '#e4e9ee',
    '--preview-text-primary': '#2d3338',
    '--preview-text-secondary': '#596065',
    '--preview-text-muted': 'rgba(89,96,101,0.6)',
    '--preview-accent': '#a04100',
    '--preview-accent-text': '#fff6f3',
    '--preview-accent-subtle': 'rgba(160,65,0,0.1)',
    '--preview-nav-bg': '#5c5c63',
    '--preview-nav-border': 'transparent',
    '--preview-cart-bg': '#2d3338',
    '--preview-cart-text': '#f9f9fb',
    '--preview-cart-subtext': 'rgba(221,227,233,0.6)',
    '--preview-cart-badge': '#a04100',
    '--preview-cart-badge-text': '#fff6f3',
    '--preview-image-placeholder': '#ebeef2',
    '--preview-tag-bg': '#e4e9ee',
    '--preview-overlay-bg': 'rgba(45,51,56,0.2)',
    '--preview-confirm-bg': '#fdfdfd',
    '--preview-confirm-bar-bg': 'rgba(255,255,255,0.8)',
    // Layout
    '--preview-card-radius': '16px',
    '--preview-image-radius': '12px',
    '--preview-add-btn-size': '20px',
    '--preview-add-btn-bg': '#a04100',
    '--preview-add-btn-color': '#fff6f3',
    '--preview-add-btn-radius': '50%',
    '--preview-count-radius': '4px',
    '--preview-cat-name-transform': 'none',
    '--preview-cat-name-tracking': '-0.45px',
    '--preview-subcat-tracking': '1px',
    '--preview-scroll-pt': '65px',
    '--preview-scroll-px': '0px',
    '--preview-font-family': 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  },

  midnight: {
    // Figma exact values
    '--preview-bg': '#131314',
    '--preview-surface': '#1c1b1c',
    '--preview-surface-low': '#2a2a2b',
    '--preview-surface-muted': 'rgba(19,19,20,0.85)',
    '--preview-border': 'rgba(80,69,50,0.25)',
    '--preview-border-strong': 'rgba(255,255,255,0.08)',
    '--preview-text-primary': '#e5e2e3',
    '--preview-text-secondary': '#d4c5ab',
    '--preview-text-muted': 'rgba(212,197,171,0.5)',
    '--preview-accent': '#ffb95a',
    '--preview-accent-text': '#462a00',
    '--preview-accent-subtle': 'rgba(255,185,90,0.12)',
    '--preview-nav-bg': 'rgba(53,52,54,0.9)',
    '--preview-nav-border': 'rgba(255,185,90,0.3)',
    '--preview-cart-bg': 'linear-gradient(to right, #2a2a2b, #353436)',
    '--preview-cart-text': '#d4c5ab',
    '--preview-cart-subtext': 'rgba(212,197,171,0.6)',
    '--preview-cart-badge': '#ffbd65',
    '--preview-cart-badge-text': '#764b00',
    '--preview-image-placeholder': '#353436',
    '--preview-tag-bg': 'rgba(255,224,190,0.1)',
    '--preview-overlay-bg': 'rgba(0,0,0,0.7)',
    '--preview-confirm-bg': '#131314',
    '--preview-confirm-bar-bg': 'rgba(19,19,20,0.92)',
    // Layout — matches Figma shapes
    '--preview-card-radius': '8px',
    '--preview-image-radius': '4px',
    '--preview-add-btn-size': '32px',
    '--preview-add-btn-bg': 'linear-gradient(135deg, #ffe0be 0%, #ffbd65 100%)',
    '--preview-add-btn-color': '#462a00',
    '--preview-add-btn-radius': '10px',
    '--preview-count-radius': '12px',
    '--preview-cat-name-transform': 'uppercase',
    '--preview-cat-name-tracking': '0.9px',
    '--preview-subcat-tracking': '2.4px',
    '--preview-scroll-pt': '80px',
    '--preview-scroll-px': '16px',
    '--preview-font-family': 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
  },
}

export function getTheme(id: string): { id: ThemeId; tokens: ThemeTokens } {
  const safeId = (id in themes ? id : 'default') as ThemeId
  return { id: safeId, tokens: themes[safeId] }
}

export const THEME_META: Record<ThemeId, { label: string; swatch: string; bg: string }> = {
  default: { label: 'Classic', swatch: '#a04100', bg: '#f9f9fb' },
  midnight: { label: 'Midnight', swatch: '#ffb95a', bg: '#131314' },
}
