# Design System Document — MenuBuilder Preview

This document describes the exact design system used across all preview menu components in this repo. It is derived directly from the code in `src/components/preview/` and `src/app/preview/`.

---

## 1. Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#f9f9fb` | Page background, header background |
| `surface-container-low` | `#f2f4f6` | Sub-category headers, item placeholder bg, dividers, form input backgrounds |
| `surface-container` | `#ebeef2` | Category count badge bg, image placeholder |
| `surface-container-lowest` | `#ffffff` | Menu item cards, modal background, input fields |
| `on_surface` | `#2d3338` | All primary text, icons, inverse surface (cart bar bg) |
| `on_surface_variant` | `#596065` | Secondary text, descriptions, labels, icon stroke |
| `primary` | `#a04100` | Primary buttons, add-to-cart button, active states, cart badge, CTA |
| `on_primary` | `#fff6f3` | Text on primary buttons |
| `secondary_container` | `#e4e9ee` | Dietary/highlight tag backgrounds |
| `on_secondary_container` | `#525154` | Tag text (neutral) |
| `outline_variant` | `rgba(172,179,184,...)` | Ghost borders at low opacity (0.05 – 0.3) |
| `inverse_surface` | `#2d3338` | Cart bar, floating back button in search |
| `on_inverse_surface` | `#f9f9fb` | Text on dark cart bar |
| Veg green | `#15803d` / dot `#16a34a` | Vegetarian sub-category label + dot |
| Non-veg red | `#b91c1c` / dot `#dc2626` | Non-vegetarian sub-category label + dot |
| Veg icon bg | `#f0fdf4` | Icon container in order confirm screen |
| Non-veg icon bg | `#fef2f2` | Icon container in order confirm screen |
| Primary tint | `rgba(160,65,0,0.1)` | Active category count badge bg in modal |
| Floating menu btn | `#5c5c63` | "Menu" floating button background |

### The "No-Line" Rule
Structural separation is done **only** through background color shifts — never with opaque 1px borders. Any border used is a ghost border: `border border-[rgba(172,179,184,X)]` where X is between `0.05` and `0.3`. The only exception is form input cards in the Order Confirm screen which use `border-[#e4e9ee]` for accessibility.

---

## 2. Typography

Font: **Inter** (system stack)

| Role | Size | Weight | Color | Extras |
|---|---|---|---|---|
| Page/modal title | `20px` | `font-bold` | `#2d3338` | `tracking-[-0.5px]` |
| Category name | `18px` | `font-black` | `#2d3338` | `tracking-[-0.45px] leading-[28px]` |
| Section heading | `20px` | `font-bold` | `#2d3338` | `tracking-[-0.5px]` |
| Search results title | `16px` | `font-bold` | `#2d3338` | `tracking-[-0.4px]` |
| Modal category name | `16px` | `font-semibold` | `#2d3338` | — |
| Item name | `14px` | `font-bold` | `#2d3338` | `leading-[20px]` |
| Item description | `11px` | `font-normal` | `#596065` | `leading-[15.13px]` line-clamp-2 |
| Tag / label | `9px` | `font-bold` | varies | `uppercase` |
| Section label | `10px` | `font-bold` | `#596065` | `uppercase tracking-[1px]` |
| Sub-category label | `10px` | `font-extrabold` | veg/non-veg | `uppercase tracking-[1px]` |
| Count badge | `10px` | `font-medium` | `rgba(89,96,101,0.6)` | `uppercase tracking-[1px]` |
| Cart bar body | `12px` | `font-bold` | `#f9f9fb` | — |
| Cart bar preview | `10px` | `font-normal` | `rgba(221,227,233,0.6)` | `truncate` |
| Checkout label | `12px` | `font-black` | `#fff6f3` | `uppercase tracking-[1.2px]` |
| "Show more" link | `10px` | `font-bold` | `#a04100` | — |
| "Clear All" link | `12px` | `font-semibold` | `#a04100` | — |

---

## 3. Border Radius

| Context | Radius |
|---|---|
| Menu item card | `rounded-[16px]` |
| Cart bar | `rounded-[16px]` |
| Checkout button (in cart bar) | `rounded-[12px]` |
| Item image | `rounded-[12px]` |
| Category count badge | `rounded-[4px]` |
| Tag chips | `rounded-[6px]` |
| Recent search chips | `rounded-full` |
| Stepper buttons | `rounded-full` |
| Modal (bottom sheet) | `rounded-tl-[24px] rounded-tr-[24px]` |
| Primary CTA button (modal footer, confirm) | `rounded-[12px]` to `rounded-[16px]` |
| Floating "Menu" button | `rounded-[16px]` |
| Close button (modal) | `rounded-full` |
| Category row (expanded) | `rounded-[8px] rounded-bl-none rounded-br-none` |
| Sub-categories panel | `rounded-bl-[8px] rounded-br-[8px]` |

---

## 4. Elevation & Shadows

Shadows are used sparingly and are always soft/atmospheric:

| Element | Shadow |
|---|---|
| Menu item card | `0px 1px 2px 0px rgba(0,0,0,0.05)` |
| Category select modal | `0px 24px 48px 0px rgba(45,51,56,0.06)` |
| Cart bar | `0px 25px 50px -12px rgba(0,0,0,0.25)` |
| Floating "Menu" button | `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)` |
| Primary CTA button (tinted) | `0px 10px 15px -3px rgba(160,65,0,0.2), 0px 4px 6px -4px rgba(160,65,0,0.2)` |

---

## 5. Glassmorphism

| Element | Style |
|---|---|
| Preview page header | `backdrop-blur-[6px] bg-[rgba(249,249,251,0.95)]` |
| Order confirm header | `backdrop-blur-[6px] bg-[rgba(249,249,251,0.8)]` |
| Category modal overlay | `backdrop-blur-[6px] bg-[rgba(45,51,56,0.2)]` |
| Order confirm bottom bar | `backdrop-blur-[12px] bg-[rgba(255,255,255,0.8)]` |

---

## 6. Component Specs

### Preview Page Header
- Fixed top, `z-40`
- `bg-[rgba(249,249,251,0.95)] backdrop-blur-[6px]`
- `border-b border-[rgba(172,179,184,0.1)]`
- `py-4 px-6`
- Left: hamburger icon (18×12 SVG, `fill="#2d3338"`) + menu name (`20px font-bold tracking-[-0.5px]`)
- Right: search icon (18×18 magnifying glass SVG, `stroke="#2d3338" strokeWidth="1.5"`)

### Category Header Row
- Full-width `<button>`, `bg-[#f9f9fb]`
- `border-b border-[rgba(172,179,184,0.05)]`
- `py-3 px-6`, `flex items-center justify-between`
- Name: `18px font-black #2d3338 tracking-[-0.45px]`
- Count badge: `bg-[#ebeef2] rounded-[4px] px-2 py-[2px] text-[10px] font-medium uppercase tracking-[1px] text-[rgba(89,96,101,0.6)]`
- Chevron: 12×8 SVG, `stroke="#596065" strokeWidth="1.5"`
- 8px `bg-[#f9f9fb]` spacer between categories

### Sub-Category Label
- `backdrop-blur-[2px] bg-[rgba(242,244,246,0.95)]`
- `border-b border-[rgba(172,179,184,0.05)]`
- `py-2 px-6`
- 6px colored dot + `10px font-extrabold uppercase tracking-[1px]`
- Veg: dot `#16a34a`, text `#15803d`
- Non-veg: dot `#dc2626`, text `#b91c1c`
- Items area: `bg-[rgba(255,255,255,0.5)] p-4 flex flex-col gap-4`

### Menu Item Card (`PreviewMenuItemCard`)
- `bg-white border border-[rgba(172,179,184,0.05)] rounded-[16px]`
- `shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[13px]`
- Layout: `flex gap-4 items-start`
- Image: `96×96px rounded-[12px] bg-[#ebeef2]` — shows placeholder SVG if no image
- Item name: `14px font-bold #2d3338 leading-[20px]`
- Add/remove button: `size-[20px] rounded-full bg-[#a04100]` with Plus/Check icon (12×12, white)
- Description: `11px #596065 leading-[15.13px] line-clamp-2`, expands via "Show more" `10px font-bold #a04100`
- Tags: `bg-[#e4e9ee] rounded-[6px] px-[8px] py-[2px] text-[9px] font-bold uppercase`
  - Dietary: colored text (veg `#15803d`, non-veg `#b91c1c`, neutral `#596065`)
  - Highlight: `text-[#596065]`

### Floating "Menu" Button
- Position: `fixed bottom-[88px] right-4 z-40`
- `bg-[#5c5c63] rounded-[16px] px-5 py-3`
- `shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]`
- Fork icon (15×15, `stroke="white" strokeWidth="2"`) + `"Menu"` label (`14px font-bold text-white`)

### Cart Bar
- Position: `fixed bottom-4 left-4 right-4 z-40`
- `bg-[#2d3338] border border-[rgba(255,255,255,0.05)] rounded-[16px] p-[17px]`
- `shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]`
- Left side: orange badge `size-[32px] rounded-[8px] bg-[#a04100]` + item count + item preview text
- Right: checkout button `bg-[#a04100] rounded-[12px] px-5 py-2 text-[12px] font-black uppercase tracking-[1.2px] text-[#fff6f3]`

### Category Select Modal (Bottom Sheet)
- Overlay: `backdrop-blur-[6px] bg-[rgba(45,51,56,0.2)]` full screen, `flex items-end justify-center`
- Sheet: `bg-white rounded-tl-[24px] rounded-tr-[24px] max-h-[80vh]`
- `shadow-[0px_24px_48px_0px_rgba(45,51,56,0.06)]`
- Header: `border-b border-[rgba(172,179,184,0.15)] py-5 px-6`
  - Title: `20px font-bold #2d3338 tracking-[-0.5px]`
  - Close btn: `bg-[#f2f4f6] rounded-full size-[40px]`
- Category row active: `bg-[#f2f4f6]`, name `text-[#a04100]`, count badge `bg-[rgba(160,65,0,0.1)] text-[#a04100]`
- Sub-categories panel: `bg-[rgba(242,244,246,0.5)] rounded-bl-[8px] rounded-br-[8px] pl-16 pr-4`
  - Sub-item count: `bg-[#ebeef2] rounded-full`
- Footer: `bg-[rgba(242,244,246,0.3)] p-6`
  - CTA button: `w-full bg-[#a04100] rounded-[12px] py-4 text-[#fff6f3] 18px font-bold`
  - Shadow: `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)`

### Search Screen
- Full screen, `bg-[#f9f9fb]`
- Header: `border-b border-[rgba(228,233,238,0.5)] px-4 py-2`
  - Back arrow (9×15 SVG) + search input + clear (X)
  - Input: `bg-white border border-[rgba(172,179,184,0.3)] rounded-[8px] px-[13px] py-[9px] text-[14px]`
- Results: `px-4 py-6 gap-8`
  - Category label: `10px font-extrabold uppercase tracking-[1.2px] text-[#596065]`
  - Grouped results use `PreviewMenuItemCard` with `gap-3`
- Recent search chips: `bg-white border border-[rgba(172,179,184,0.2)] rounded-full px-[13px] py-[7px]`
- Floating "MENU" back btn (in search): `bg-[#2d3338] rounded-full px-4 py-2` — centered, `fixed bottom-6`

### Order Confirm Screen
- Full screen, `bg-[#fdfdfd]`
- Header: `backdrop-blur-[6px] bg-[rgba(249,249,251,0.8)] border-b border-[#ebeef2] px-4 py-4`
  - Back button: `size-[40px] rounded-full`
- Category cards: `bg-white border border-[#e4e9ee] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]`
  - Header row: `border-b border-[#f2f4f6] px-4 py-4`
  - Count badge: `bg-[#f2f4f6] rounded-[4px] text-[10px] font-bold #596065 uppercase tracking-[1px]`
- Confirm item row image: `size-[80px] rounded-[12px] bg-[#f2f4f6]`
- Event detail section labels: `10px font-bold uppercase tracking-[1px] text-[#596065]`
- Form input cards: `bg-white border border-[#e4e9ee] rounded-[16px] p-[17px]`
  - Stepper buttons: `size-[32px] rounded-full bg-[#f2f4f6]`
  - Veg icon container: `size-[32px] rounded-full bg-[#f0fdf4]`
  - Non-veg icon container: `size-[32px] rounded-full bg-[#fef2f2]`
- Bottom action bar: `backdrop-blur-[12px] bg-[rgba(255,255,255,0.8)] border-t border-[#f2f4f6] px-4 pt-[17px] pb-8`
  - CTA: `bg-[#a04100] rounded-[16px] w-full py-4 18px font-bold text-white`
  - Tinted shadow: `0px 10px 15px -3px rgba(160,65,0,0.2), 0px 4px 6px -4px rgba(160,65,0,0.2)`

---

## 7. Spacing Conventions

- Page horizontal padding: `px-4` (16px) or `px-6` (24px) for headers/category rows
- Gap between menu items within a section: `gap-3` to `gap-4`
- Gap between major sections: `gap-6` to `gap-8`
- Category items container padding: `p-4`
- Cart bar clearance from bottom: `pb-32` on scroll content when cart is visible

---

## 8. Do's and Don'ts

### Do
- Use `#2d3338` for all primary text — never pure `#000000`
- Use background color shifts (surface tiers) to separate sections — no solid borders
- Use `rounded-[16px]` for cards, `rounded-[12px]` for image thumbnails and buttons
- Use tinted shadows (orange-tinted) on primary action buttons for depth
- Use glassmorphism (`backdrop-blur` + translucent bg) for fixed/floating bars
- Use colored dots (6px rounded-full) + colored uppercase labels for veg/non-veg subcategory headers

### Don't
- Don't use any 1px opaque solid borders for section separation
- Don't use `rounded` (default 0.25rem) or `rounded-md` on large cards — use `rounded-[16px]` minimum
- Don't use standard drop shadows on cards — use the soft `0px 1px 2px rgba(0,0,0,0.05)` only
- Don't use `#000000` black anywhere
- Don't add horizontal divider lines between list items — use vertical whitespace (`gap-3` / `gap-4`)
