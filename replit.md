# T-Shirt Inventory Management Application

## Overview

This is a full-stack t-shirt inventory management application built with React, Express, and PostgreSQL. The application allows users to create, read, update, and delete t-shirt records with size and color information. It features a clean, modern UI inspired by Linear and Notion's design principles, with support for both light and dark themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) v5 for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation

**Design System**
- Uses shadcn/ui's "new-york" style variant
- Custom color system supporting light/dark modes with CSS variables
- Design philosophy emphasizes efficiency, minimal distractions, and clear visual hierarchy
- Inter font family for clean, modern typography
- Responsive design with mobile-first approach

**Component Structure**
- Modular UI components in `client/src/components/ui/` (shadcn/ui components)
- Feature components for t-shirt management (dialog, table, filters, empty states)
- Single-page application with home route and 404 fallback
- Theme toggle for dark/light mode switching

### Backend Architecture

**Technology Stack**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless driver)
- **Build Tool**: esbuild for production builds

**API Design**
- RESTful API endpoints under `/api/tshirts`
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Input validation using Zod schemas
- Error handling with appropriate HTTP status codes

**Data Layer**
- Abstracted storage interface (`IStorage`) for flexibility
- In-memory storage implementation (`MemStorage`) for development
- Database schema defined with Drizzle ORM in `shared/schema.ts`
- PostgreSQL table with `id`, `size`, and `color` fields
- UUID primary keys generated via PostgreSQL's `gen_random_uuid()`

**Development Architecture**
- Vite dev server integrated with Express in development
- Hot module replacement (HMR) for rapid development
- Custom middleware for request logging
- Separate client and server build processes

### Database Schema

**T-Shirts Table** (`tshirts`)
- `id`: VARCHAR (primary key, auto-generated UUID)
- `size`: TEXT (required) - stores size values like XS, S, M, L, XL, XXL
- `color`: TEXT (required) - stores color names or hex values

**Migration Strategy**
- Drizzle Kit for schema migrations
- Migrations stored in `/migrations` directory
- Push-based deployment via `db:push` script

### Shared Code

**Type Safety**
- Shared schema definitions in `shared/schema.ts`
- Zod schemas for runtime validation
- TypeScript types inferred from Drizzle schema
- `InsertTshirt` and `Tshirt` types exported for use across client/server

**Path Aliases**
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`

### Build & Deployment

**Development**
- `npm run dev`: Runs Express server with Vite middleware
- TypeScript compilation via tsx for server
- Vite handles client-side HMR and bundling

**Production**
- `npm run build`: Builds both client (Vite) and server (esbuild)
- Client output: `dist/public/`
- Server output: `dist/index.js`
- `npm start`: Runs production server from compiled code

**Type Checking**
- `npm run check`: Runs TypeScript compiler in noEmit mode
- Strict mode enabled for maximum type safety

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database (@neondatabase/serverless)
- Connection managed via `DATABASE_URL` environment variable
- Drizzle ORM for query building and schema management

### UI Component Library
- **Radix UI**: Headless UI primitives for accessible components
  - Dialogs, popovers, selects, dropdowns, accordions, etc.
  - 20+ Radix UI packages for comprehensive component coverage
- **shadcn/ui**: Pre-styled components built on Radix UI primitives
  - Configured with "new-york" style variant
  - Custom color system and Tailwind integration

### Styling & CSS
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: CVA for component variant styling
- **clsx & tailwind-merge**: Class name management utilities
- **PostCSS & Autoprefixer**: CSS processing

### Form & Validation
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation
- **@hookform/resolvers**: Integrates Zod with React Hook Form

### Development Tools
- **Vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production builds
- **Drizzle Kit**: Database migration tool

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Code mapping (development only)
- **@replit/vite-plugin-dev-banner**: Development banner (development only)

### Utilities
- **date-fns**: Date manipulation and formatting
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality
- **lucide-react**: Icon library
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library

### Session Management
- **connect-pg-simple**: PostgreSQL session store (included but not actively used in current implementation)