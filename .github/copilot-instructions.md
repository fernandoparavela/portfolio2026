# Copilot Instructions for portfolio26

## Project Overview
**portfolio26** is a Next.js 16 portfolio application using React 19, TypeScript, Tailwind CSS v4, and modern ESLint. It's a minimal boilerplate with a single entry page ready for portfolio customization.

## Architecture & Key Files

### App Directory Structure (`app/`)
- **`layout.tsx`**: Root layout using Next.js metadata API. Imports custom fonts (Geist Sans/Mono via Google Fonts) and applies CSS variables for typography.
- **`page.tsx`**: Default home page component. Uses Tailwind classes with dark mode support (`dark:*` prefix).
- **`globals.css`**: Tailwind CSS configuration with inline theme. Defines CSS variables for colors (background/foreground) and fonts, with automatic dark mode detection via `prefers-color-scheme`.

### Configuration Files
- **`tsconfig.json`**: Strict TypeScript mode enabled. Path alias `@/*` maps to project root. Target is ES2017 with JSX support.
- **`next.config.ts`**: Minimal Next.js config (empty object placeholder).
- **`eslint.config.mjs`**: ESM-based ESLint using Next.js recommended presets (core-web-vitals + typescript). Explicitly ignores `.next/`, `out/`, `build/`, and `next-env.d.ts`.

## Development Workflow

### Available Scripts
```json
"dev": "next dev"         // Start dev server (http://localhost:3000)
"build": "next build"     // Production build
"start": "next start"     // Start production server
"lint": "eslint"          // Run linter
```

### Key Dependencies
- **Next.js 16.0.6**: App Router-only (no pages directory)
- **React 19.2.0**: Latest React version
- **Tailwind CSS v4**: Via `@tailwindcss/postcss` and `postcss.config.mjs`
- **TypeScript 5**: Strict mode enforced

## Coding Conventions

### Styling Approach
- **Tailwind-first**: Use inline Tailwind classes in JSX (`className` prop). All custom styles in `globals.css`.
- **Dark mode**: Use `dark:` prefix for dark-mode variants. Respects `prefers-color-scheme` system preference.
- **CSS variables**: Define color/font tokens in `globals.css` using `:root` selector and reference via `var(--name)`.

### Component Patterns
- **Server Components by default**: Components in `app/` are Server Components unless marked with `"use client"`.
- **Image optimization**: Use `next/image` component with `priority` prop for above-fold images (see `page.tsx` for examples).
- **Type safety**: Explicitly type React props (e.g., `children: React.ReactNode`). Use `Readonly<{}>` wrapper for object props.

### File Organization
- `.tsx` for React components, `.mts` for module files (both compiled by Next.js).
- Keep page-specific content in route-specific files (`app/page.tsx`, `app/posts/page.tsx`, etc.).

## Integration Points & External Dependencies

- **Google Fonts API**: Imported in `layout.tsx` via Next.js font optimization. Declare font variables and pass to `<body>` className.
- **PostCSS**: Configured for Tailwind; see `postcss.config.mjs`.
- **Vercel Platform**: Deployment target (referenced in README and starter templates).

## Linting & Code Quality
- Run `npm run lint` to check TypeScript and Next.js best practices.
- ESLint ignores generated files (`.next/`, `next-env.d.ts`).
- Fix linter issues before committing.

## Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Run linter | `npm run lint` |
| Edit homepage | Modify `app/page.tsx` (auto-refresh in dev mode) |
| Add new page | Create `app/[route]/page.tsx` |
| Update global styles | Edit `app/globals.css` |
| Add dependencies | `npm install <package>` |
