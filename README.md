# MenuBuilder

A full-stack web application for creating, managing, and sharing digital catering menus. Built with Next.js 15, PostgreSQL, Clerk authentication, and AWS S3 image storage.

## Features

- **Hierarchical menu structure** — Categories can nest infinitely with subcategories
- **Menu items** — With descriptions, ingredients, tags, and image uploads to AWS S3
- **Tag system** — Dietary, highlight, cuisine, and spice level tags
- **Public sharing** — Share menus via unique share tokens (no login required to view)
- **Authentication** — Clerk-based user auth; each user manages their own menus
- **Cart view** — Preview mode with cart functionality for customers

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth | Clerk |
| Database | PostgreSQL via Neon |
| ORM | Prisma 6 |
| Storage | AWS S3 |
| Validation | Zod 4 |
| Drag & Drop | dnd-kit |
| PDF Export | jsPDF |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (e.g. Neon)
- Clerk account
- AWS S3 bucket

### Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=menu-catering

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk (from your Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed predefined tags
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Management

```bash
npm run db:studio     # Open Prisma Studio GUI
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Run pending migrations
npm run db:seed       # Seed predefined tags
```

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/                    # REST API routes
│   │   ├── menus/              # Menu CRUD + share token
│   │   ├── categories/         # Category CRUD
│   │   ├── menu-items/         # Item CRUD + image upload
│   │   ├── tags/               # Tag CRUD
│   │   └── health/             # Health check
│   ├── menus/                  # Dashboard & editor pages
│   ├── preview/[id]/           # Public menu preview
│   └── page.tsx                # Landing page
├── components/
│   ├── dashboard/              # Menu cards, create modal
│   ├── preview/                # Customer-facing preview UI
│   ├── landing-page/           # Marketing page sections
│   └── ui/                     # Shared UI components
├── hooks/
│   └── useRequireAuth.ts
├── lib/
│   ├── api.ts                  # API client helpers
│   ├── prisma.ts               # Prisma singleton
│   ├── s3.ts                   # S3 + multer config
│   ├── utils.ts                # Response helpers, validation utils
│   └── validations.ts          # Zod schemas
├── assets/
└── middleware.ts               # Clerk auth middleware
prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Predefined tags seed
```

## Database Schema

```
Menu
 └─ Category (hierarchical, self-referential)
     └─ MenuItem
         └─ Tag (M:N via MenuItemTag)
```

All deletes cascade: deleting a menu removes all its categories, items, and images.

## API

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for the full REST API reference.

Quick overview:

| Resource | Endpoints |
|---|---|
| Menus | `GET/POST /api/menus`, `GET/PUT/DELETE /api/menus/[id]`, `GET /api/menus/share/[token]` |
| Categories | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/[id]` |
| Menu Items | `GET/POST /api/menu-items`, `GET/PUT/DELETE /api/menu-items/[id]`, `POST /api/menu-items/[id]/upload-image` |
| Tags | `GET/POST /api/tags`, `GET/PUT/DELETE /api/tags/[id]` |
| Health | `GET /api/health` |

## S3 Image Storage

See [S3_SETUP.md](./S3_SETUP.md) for AWS S3 setup instructions.

Images are stored at:
```
s3://your-bucket/menu-items/<uuid>.<ext>
```

Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB.

## License

MIT
