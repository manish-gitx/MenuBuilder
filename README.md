# MenuBuilder

A full-stack SaaS web application for catering businesses to create, manage, and share digital menus. Customers browse menus, build a cart, and place orders — which are saved to the database, converted to a PDF, and sent to the business via WhatsApp.

**Live Demo:** [https://buildmenu.vercel.app/preview/sn64vygw3psncwgvz3uf?ref=govind-6666](https://buildmenu.vercel.app/preview/sn64vygw3psncwgvz3uf?ref=govind-6666)

> The link above includes referral code `govind-6666`. Opening it attributes any order placed to the referrer "Govind" and includes their code in the WhatsApp notification and order PDF.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
  - [Menu Editor](#menu-editor)
  - [Customer Preview & Ordering](#customer-preview--ordering)
  - [Referral System](#referral-system)
  - [WhatsApp Integration](#whatsapp-integration)
  - [Themes](#themes)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Features

- **Hierarchical menus** — Categories nest into subcategories; items live in leaf categories
- **Rich menu items** — Name, description, ingredients, image (uploaded to S3), dietary/highlight tags
- **Tag system** — Predefined dietary and highlight tags (Vegetarian, Non-Veg, Chef Special, Spicy, Jain) with colors
- **Drag-and-drop reordering** — Reorder categories and items with dnd-kit
- **Public sharing** — Each menu has a unique share token; no login needed to browse
- **Two themes** — "Classic" (light) and "Midnight" (dark gold) with CSS variable-based tokens
- **Cart & ordering** — Customers add items, fill event details (veg/non-veg guests, date, phone), and confirm
- **PDF generation** — jsPDF generates a formatted order invoice; uploaded to S3 and downloaded by customer
- **WhatsApp notifications** — MSG91 WhatsApp Business API sends order + PDF link to the business
- **Referral tracking** — URL-based referral codes (`?ref=code`) attribute orders to referrers
- **Admin panel** — Manage referrers, view all orders, download PDFs, track earnings per referrer
- **Demo menu** — One-click seed of a sample Indian wedding catering menu

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 15.3.8 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Auth | Clerk | 6.24.0 |
| Database | PostgreSQL via Neon | — |
| ORM | Prisma | 6.11.1 |
| Storage | AWS S3 (via aws-sdk + multer-s3) | 2.1692.0 |
| Validation | Zod | 4.0.5 |
| PDF Generation | jsPDF + jsPDF AutoTable | 3.0.1 / 5.0.2 |
| Drag & Drop | dnd-kit (core + sortable) | 6.3.1 / 10.0.0 |
| WhatsApp | MSG91 WhatsApp Business API | — |
| UI Primitives | Headless UI, Lucide React, Heroicons | 2.2.4 / 0.525.0 / 2.2.0 |
| Notifications | React Hot Toast | 2.5.2 |
| File Input | React Dropzone | 14.3.8 |

---

## How It Works

### Menu Editor

Authenticated users create menus at `/menus`. Each menu has a name, optional description, visibility toggle (public/private), and a theme. Menus are edited at `/menus/[id]/edit`:

- **Categories** are created as root-level groups (e.g., "Starters") or subcategories under a root (e.g., "Veg Starters")
- A category can have either subcategories **or** menu items — not both (enforced in UI and backend)
- **Menu items** belong to a leaf category and carry a name, description, ingredients, image, and tags
- Images are uploaded to AWS S3 via multipart form; old images are deleted automatically on replace
- Items and categories can be reordered with drag-and-drop or arrow buttons

### Customer Preview & Ordering

Anyone with a share link (no login needed) can browse at `/preview/[shareToken]`:

1. **Browse** — Scrollable category list; click category to expand items
2. **Search** — Full-screen search overlay with recent searches persisted in localStorage
3. **Cart** — Add/remove items; cart is persisted in localStorage per menu
4. **Order Confirmation** — Customer fills in phone, veg guest count, non-veg guest count, and event date
5. **Submit** — App generates a PDF order invoice, uploads it to S3, saves the order to the database, sends a WhatsApp notification to the business, and downloads the PDF to the customer's device
6. **Cart cleared** — Cart and event details are wiped from localStorage after order

### Referral System

Allows businesses to track who referred customers (e.g., sales agents, event planners).

**Setup (Admin):**
1. Go to `/admin` → "Referrers" tab → "+ Add Referrer"
2. Fill in name, phone, a unique code (auto-generated as `name-last4digits`), and reward per order (₹)
3. Select a menu from the dropdown and click "Copy Link" — generates:
   ```
   https://buildmenu.vercel.app/preview/<shareToken>?ref=<code>
   ```

**Customer flow:**
1. Customer opens referral link — `?ref=code` is read from URL and saved to `localStorage` at key `mb_ref_<shareToken>`
2. App fetches `/api/referrers/<code>` to get the referrer's phone (displayed in the order form)
3. On order submission, `referralCode` is sent with the order and stored in the `Order` record

**Admin visibility:**
- Orders table shows a green referrer badge for referred orders
- Referrers table shows total order count and total earned (`orderCount × rewardAmount`) per referrer

### WhatsApp Integration

After an order is placed, a WhatsApp message is sent to configured business numbers via the **MSG91 WhatsApp Business API**.

**Flow:**
1. Customer confirms order → PDF uploaded to S3
2. `POST /api/orders/send-whatsapp` fires (non-blocking) with: `pdfUrl`, `menuName`, `date`, `phone`, `referralCode`
3. Backend selects template components based on `MSG91_TEMPLATE` env var:
   - `order_pdf` — sends customer phone + PDF link
   - `order_confirmation` — sends customer phone, menu name, event date, referral code, PDF link
4. Request sent to MSG91 bulk WhatsApp API with pre-approved template
5. Message delivered to all numbers in `WHATSAPP_RECIPIENTS`

If MSG91 credentials are missing, the system logs a warning and skips silently — orders still save normally.

**Template variables (`order_confirmation`):**

| Variable | Value |
|---|---|
| `customer_phone` | Customer's 10-digit phone |
| `menu_name` | Catering menu name |
| `event_date` | Event date (or `—` if not provided) |
| `referral_code` | Referral code (or `—` if direct visit) |
| `pdf_url` | Public S3 URL of the order PDF |

### Themes

Each menu has a `theme` field. Two themes are available:

| Theme ID | Label | Background | Accent | Style |
|---|---|---|---|---|
| `default` | Classic | `#f9f9fb` (light) | `#a04100` (warm brown) | Rounded cards, soft shadows |
| `midnight` | Midnight | `#131314` (dark) | `#ffb95a` (gold) | Sharp corners, gold gradient buttons, gold-shine title |

Themes are defined in `src/lib/themes.ts` as CSS custom property maps (`--preview-bg`, `--preview-accent`, etc.). The entire preview page applies tokens as inline CSS variables on the root container, so all child components use `var(--preview-*)` — no theme-specific conditionals in most components.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── orders/route.ts          # Admin: list all orders
│   │   │   └── referrers/
│   │   │       ├── route.ts             # Admin: list/create referrers
│   │   │       └── [id]/route.ts        # Admin: delete referrer
│   │   ├── categories/
│   │   │   ├── route.ts                 # List/create categories
│   │   │   └── [id]/route.ts            # Get/update/delete category
│   │   ├── menu-items/
│   │   │   ├── route.ts                 # List/create items
│   │   │   └── [id]/
│   │   │       ├── route.ts             # Get/update/delete item
│   │   │       └── upload-image/route.ts # Upload item image to S3
│   │   ├── menus/
│   │   │   ├── route.ts                 # List/create menus
│   │   │   ├── seed-demo/route.ts       # Seed demo Indian wedding menu
│   │   │   ├── [id]/route.ts            # Get/update/delete menu
│   │   │   └── share/[token]/route.ts   # Public: get menu by share token
│   │   ├── orders/
│   │   │   ├── route.ts                 # Create order
│   │   │   ├── upload-pdf/route.ts      # Upload generated PDF to S3
│   │   │   └── send-whatsapp/route.ts   # Send WhatsApp via MSG91
│   │   ├── referrers/[code]/route.ts    # Public: lookup referrer by code
│   │   ├── tags/route.ts                # List/create tags
│   │   └── health/route.ts              # Health check with DB stats
│   ├── menus/
│   │   ├── page.tsx                     # Dashboard: menu grid
│   │   └── [id]/edit/page.tsx           # Menu editor
│   ├── preview/[id]/page.tsx            # Public menu preview + cart + order
│   ├── admin/page.tsx                   # Admin: orders + referrers
│   ├── layout.tsx                       # Root layout with ClerkProvider
│   └── page.tsx                         # Landing page
├── components/
│   ├── dashboard/
│   │   ├── MenuCard.tsx                 # Menu card (edit/preview/delete/theme)
│   │   └── CreateMenuModal.tsx          # Create menu modal
│   ├── preview/
│   │   ├── ThemeRenderer.tsx            # Renders categories/items in active theme
│   │   ├── ThemeChrome.tsx              # Bottom nav (menu button + cart bar)
│   │   ├── OrderConfirmScreen.tsx       # Order review + PDF + submit
│   │   ├── CategorySelectModal.tsx      # Category navigation modal
│   │   ├── SearchScreen.tsx             # Full-screen item search
│   │   └── themes/
│   │       ├── default/                 # Classic theme components
│   │       └── midnight/                # Midnight theme components
│   ├── landing-page/                    # Hero, features, testimonials, CTA, footer
│   └── ui/                              # Button, Input, Textarea, Modal, LoadingScreen, etc.
├── contexts/
│   └── PreviewThemeContext.tsx          # Provides themeId to preview subtree
├── hooks/
│   └── useRequireAuth.ts               # Redirect unauthenticated users
├── lib/
│   ├── api.ts                           # Typed client-side API wrappers
│   ├── prisma.ts                        # Prisma singleton
│   ├── s3.ts                            # AWS S3 helpers + multer-s3 config
│   ├── themes.ts                        # Theme definitions (CSS variable maps)
│   ├── utils.ts                         # API response helpers, sort utils
│   ├── validations.ts                   # Zod schemas for all API inputs
│   └── constants/tags.ts               # Predefined tag list with colors/emojis
├── assets/
└── middleware.ts                        # Clerk auth middleware (route protection)
prisma/
├── schema.prisma                        # Full database schema
└── seed.ts                              # Seeds predefined tags
```

---

## Database Schema

```
Menu (userId, shareToken, theme)
 └── Category (sortOrder, parentCategoryId, hasSubcategories)
      └── Category [subcategory] (self-referential)
           └── MenuItem (sortOrder, imageUrl)
                └── MenuItemTag ──→ Tag (type: dietary|highlight)
 └── Order (phone, vegGuests, nonVegGuests, date, menuSnapshot, pdfUrl)
          └── Referrer (code, rewardAmount, phone)
```

**Cascade deletes:**
- Menu deleted → all Categories, MenuItems, MenuItemTags, Orders deleted
- Category deleted → child Categories and MenuItems deleted
- MenuItem deleted → MenuItemTags deleted

**Key constraints:**
- `shareToken` is unique per menu
- `Referrer.code` is unique
- `MenuItemTag` uses composite PK `(menuItemId, tagId)`
- Phone numbers validated as Indian 10-digit (`/^[6-9]\d{9}$/`)
- Category hierarchy is max 2 levels deep (enforced in API)
- A category cannot have both subcategories and menu items

---

## API Reference

### Public (no auth required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check; returns DB stats |
| GET | `/api/menus/share/[token]` | Get full menu by share token (categories + items + tags) |
| GET | `/api/referrers/[code]` | Lookup referrer name and phone by code |
| GET | `/api/tags` | List all tags (supports `?search=` and `?page=`) |

### Protected (Clerk auth required)

| Method | Path | Description |
|---|---|---|
| GET | `/api/menus` | List authenticated user's menus (paginated, filterable) |
| POST | `/api/menus` | Create new menu |
| GET | `/api/menus/[id]` | Get single menu |
| PUT | `/api/menus/[id]` | Update menu (name, description, theme, isPublic) |
| DELETE | `/api/menus/[id]` | Delete menu and all related data |
| POST | `/api/menus/seed-demo` | Seed a demo Indian wedding menu (idempotent) |
| GET | `/api/categories` | List categories for a menu |
| POST | `/api/categories` | Create category or subcategory |
| GET/PUT/DELETE | `/api/categories/[id]` | Get / update / delete category |
| GET | `/api/menu-items` | List items (filterable by category, tag, search) |
| POST | `/api/menu-items` | Create menu item |
| GET/PUT/DELETE | `/api/menu-items/[id]` | Get / update / delete item |
| POST | `/api/menu-items/[id]/upload-image` | Upload item image to S3 (multipart, 5MB max) |
| POST | `/api/tags` | Create tag |
| POST | `/api/orders` | Create order with menuSnapshot + referralCode |
| POST | `/api/orders/upload-pdf` | Upload order PDF to S3; returns public URL |
| POST | `/api/orders/send-whatsapp` | Send WhatsApp notification via MSG91 |

### Admin only (`ADMIN_USER_IDS` check)

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/orders` | List all orders with referrer info |
| GET | `/api/admin/referrers` | List referrers with order count and total earned |
| POST | `/api/admin/referrers` | Create referrer |
| DELETE | `/api/admin/referrers/[id]` | Delete referrer |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Clerk account
- AWS S3 bucket (`ap-south-2` region by default)
- MSG91 account (optional — WhatsApp notifications)

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Run database migrations
npm run db:migrate

# Seed predefined tags (Vegetarian, Non-Veg, Chef Special, Spicy, Jain)
npm run db:seed

# Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Commands

```bash
npm run db:migrate    # Run pending migrations
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:seed       # Seed predefined tags
npm run db:studio     # Open Prisma Studio (visual DB editor)
```

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

```env
# ── Database ──────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# ── Clerk Authentication ───────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# ── AWS S3 ────────────────────────────────────────────────────────────
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=menubuilder123
AWS_REGION=ap-south-2

# ── Application ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── MSG91 WhatsApp (optional) ─────────────────────────────────────────
MSG91_AUTH_KEY=...
MSG91_INTEGRATED_NUMBER=91XXXXXXXXXX        # WhatsApp Business number
WHATSAPP_RECIPIENTS=91XXXXXXXXXX,91XXXXXXXXXX  # Comma-separated recipients
MSG91_TEMPLATE=order_confirmation           # "order_pdf" or "order_confirmation"

# ── Admin Access ──────────────────────────────────────────────────────
ADMIN_USER_IDS=clerk_user_id_1,clerk_user_id_2
# Leave empty to allow any authenticated user to access /admin
```

See [S3_SETUP.md](./S3_SETUP.md) for S3 bucket and CORS configuration details.
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full API request/response reference.

---

## License

MIT
