# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte wrapper library for FluentUI web components (version 2.6.x). The project uses SvelteKit with TypeScript, Tailwind CSS, and SCSS for styling. It's packaged as a reusable component library that wraps Microsoft's FluentUI web components.

## Development Commands

- `npm run dev` - Start development server
- `npm run dev -- --open` - Start development server and open in browser
- `npm run build` - Build the production app and package the library
- `npm run preview` - Preview the production build
- `npm run check` - Run TypeScript checking
- `npm run check:watch` - Run TypeScript checking in watch mode
- `npm run lint` - Run linting (Prettier + ESLint)
- `npm run format` - Format code with Prettier
- `npm run prepack` - Package the library for publishing (runs automatically on build)

## Architecture

### Library Structure
- `src/lib/` - Main library code that gets packaged
- `src/lib/components/` - Svelte component wrappers for FluentUI web components
- `src/lib/components/index.ts` - Main component exports
- `src/routes/` - Demo/showcase pages for development and testing

### Component Organization
- Individual components: Button, Checkbox, TextField, etc.
- Layout components: `src/lib/components/layout/` (Stack, Layout, Header, Footer, etc.)
- Navigation components: `src/lib/components/nav/` (AppBar, NavMenu, NavItem, etc.)
- Icons: `src/lib/components/icons/`
- FluentUI utilities: `src/lib/fluent-ui/` (calendar utilities, constants, setup)

### Styling
- Uses SCSS for component-specific styling
- Tailwind CSS for utility classes
- FluentUI web component styles imported via `@fluentui/web-components`
- Main styles: `src/lib/main.scss`
- Component styles: `src/assets/styles/components.scss`
- FluentUI-specific styles: `src/assets/styles/fluent-ui/`

### Key Files
- `src/lib/index.ts` - Main library entry point (exports from components/index.js)
- `src/lib/components/index.ts` - All component exports
- Package exports to `dist/` directory for publishing

## Dependencies

- **Svelte 5.x** - Component framework
- **SvelteKit** - Build tool and framework
- **@fluentui/web-components 2.6.1** - Microsoft FluentUI web components
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **TypeScript** - Type checking
- **SASS** - CSS preprocessing

## Development Notes

- This project wraps FluentUI web components rather than reimplementing them
- Demo pages in `src/routes/components/` show component usage
- Library components should follow existing naming and export patterns
- TypeScript checking is required before commits
- Components are exported both individually and through index files