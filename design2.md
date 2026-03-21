# Theme 2: Midnight & Saffron

> **How to use this file:** The layout, component structure, spacing, and border-radius values are identical to Theme 1 (defaultDesign.md). Only swap out the color tokens, shadow colors, and glassmorphism values listed here. Every component slot maps 1-to-1 with the default theme.

---

## Color Tokens

| Token | Default (Theme 1) | This Theme (Theme 2) | Usage |
|---|---|---|---|
| `surface` | `#f9f9fb` | `#0f1117` | Page background |
| `surface-container-low` | `#f2f4f6` | `#1a1d27` | Sub-cat headers, placeholders, dividers |
| `surface-container` | `#ebeef2` | `#222638` | Category count badge bg, image placeholder |
| `surface-container-lowest` | `#ffffff` | `#13151e` | Menu item cards, modal bg, inputs |
| `on_surface` | `#2d3338` | `#e8eaf6` | All primary text, icons |
| `on_surface_variant` | `#596065` | `#9197b3` | Secondary text, descriptions, labels |
| `primary` | `#a04100` | `#c8922a` | Buttons, add-to-cart, active states, cart badge |
| `on_primary` | `#fff6f3` | `#1a0f00` | Text on primary buttons |
| `secondary_container` | `#e4e9ee` | `#2a2d3e` | Tag chip backgrounds |
| `on_secondary_container` | `#525154` | `#9197b3` | Neutral tag text |
| `outline_variant` | `rgba(172,179,184,...)` | `rgba(145,151,179,...)` | Ghost borders at 0.05 – 0.3 opacity |
| `inverse_surface` | `#2d3338` | `#e8eaf6` | Cart bar background |
| `on_inverse_surface` | `#f9f9fb` | `#0f1117` | Text on cart bar |
| Veg green | `#15803d` / dot `#16a34a` | `#4ade80` / dot `#22c55e` | Veg label + dot |
| Non-veg red | `#b91c1c` / dot `#dc2626` | `#f87171` / dot `#ef4444` | Non-veg label + dot |
| Veg icon bg | `#f0fdf4` | `#0f2e1a` | Veg icon container (order confirm) |
| Non-veg icon bg | `#fef2f2` | `#2e0f0f` | Non-veg icon container (order confirm) |
| Primary tint | `rgba(160,65,0,0.1)` | `rgba(200,146,42,0.15)` | Active category count badge bg |
| Floating menu btn | `#5c5c63` | `#2a2d3e` | "Menu" floating button background |

---

## Glassmorphism

Same `backdrop-blur` values — only the background color changes:

| Element | Default (Theme 1) | This Theme (Theme 2) |
|---|---|---|
| Preview page header | `bg-[rgba(249,249,251,0.95)]` | `bg-[rgba(15,17,23,0.92)]` |
| Order confirm header | `bg-[rgba(249,249,251,0.8)]` | `bg-[rgba(15,17,23,0.85)]` |
| Category modal overlay | `bg-[rgba(45,51,56,0.2)]` | `bg-[rgba(0,0,0,0.5)]` |
| Order confirm bottom bar | `bg-[rgba(255,255,255,0.8)]` | `bg-[rgba(15,17,23,0.85)]` |
| Sub-cat header | `bg-[rgba(242,244,246,0.95)]` | `bg-[rgba(26,29,39,0.95)]` |
| Items area | `bg-[rgba(255,255,255,0.5)]` | `bg-[rgba(19,21,30,0.5)]` |

---

## Shadows

Same structure and blur values — only the shadow color tint changes:

| Element | Default (Theme 1) | This Theme (Theme 2) |
|---|---|---|
| Menu item card | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.3)` |
| Category select modal | `rgba(45,51,56,0.06)` | `rgba(0,0,0,0.4)` |
| Cart bar | `rgba(0,0,0,0.25)` | `rgba(0,0,0,0.5)` |
| Floating "Menu" button | `rgba(0,0,0,0.1)` | `rgba(0,0,0,0.3)` |
| Primary CTA button (tinted) | `rgba(160,65,0,0.2)` | `rgba(200,146,42,0.25)` |

---

## Typography

Font stays **Inter**. Sizes, weights, tracking, and line-heights are identical to Theme 1. Only text colors change (mapped to new `on_surface` / `on_surface_variant` / `primary` tokens above).

Notable swaps:
- Primary text: `#e8eaf6` instead of `#2d3338`
- Secondary/label text: `#9197b3` instead of `#596065`
- Accent text (links, "Show more", "Clear All"): `#c8922a` instead of `#a04100`

---

## Component-Specific Overrides

### Category Header Row
- Background: `#0f1117` (same as surface)
- Border: `border-b border-[rgba(145,151,179,0.07)]`
- Count badge: `bg-[#222638]`

### Menu Item Card
- `bg-[#13151e] border border-[rgba(145,151,179,0.07)]`
- Image placeholder: `bg-[#222638]`
- Add/remove button: `bg-[#c8922a]`

### Cart Bar
- `bg-[#e8eaf6]` (light bar on dark screen for contrast)
- Cart count badge: `bg-[#c8922a]`
- "Review Order" text: `#0f1117`
- Item preview text: `rgba(15,17,23,0.5)`
- Checkout button: `bg-[#c8922a] text-[#1a0f00]`

### Category Select Modal
- Sheet: `bg-[#13151e]`
- Header border: `border-[rgba(145,151,179,0.12)]`
- Close button: `bg-[#222638]`
- Category row active: name `text-[#c8922a]`, badge `bg-[rgba(200,146,42,0.15)] text-[#c8922a]`
- Sub-categories panel: `bg-[rgba(34,38,56,0.5)]`
- Footer: `bg-[rgba(26,29,39,0.4)]`
- CTA button: `bg-[#c8922a] text-[#1a0f00]`

### Search Screen
- Background: `#0f1117`
- Header border: `border-[rgba(145,151,179,0.15)]`
- Input: `bg-[#13151e] border border-[rgba(145,151,179,0.25)]`
- Back/close icon: `#9197b3`
- Floating "MENU" back btn: `bg-[#e8eaf6]`, text `text-[#0f1117]`

### Order Confirm Screen
- Background: `#0f1117`
- Header border: `border-[#1a1d27]`
- Category cards: `bg-[#13151e] border border-[rgba(145,151,179,0.1)]`
- Category card header border: `border-[#1a1d27]`
- Form input cards: `bg-[#13151e] border border-[rgba(145,151,179,0.1)]`
- Stepper buttons: `bg-[#222638]`
- Bottom action bar border: `border-[#1a1d27]`
- CTA: `bg-[#c8922a] text-[#1a0f00]`
- CTA shadow tinted: `rgba(200,146,42,0.25)`

---

## What stays exactly the same as Theme 1

- All border-radius values (`rounded-[16px]`, `rounded-[12px]`, `rounded-[24px]` etc.)
- All `backdrop-blur` values (`blur-[6px]`, `blur-[12px]`)
- All spacing (`px-4`, `px-6`, `gap-3`, `gap-4`, `gap-8`, `p-[13px]`, `p-[17px]`)
- All component layout (flex direction, image size 96×96, button sizes)
- All typography sizes, weights, and tracking
- All SVG icon dimensions and `strokeWidth` values
- The "No-Line" rule — ghost borders only, no opaque 1px separators
- Veg/non-veg dot + label pattern (only the colors change)
- Glassmorphism pattern (only the base color changes)
