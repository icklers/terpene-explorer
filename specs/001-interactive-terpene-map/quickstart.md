# Quickstart Guide: Interactive Terpene Map

**Feature**: 001-interactive-terpene-map
**Date**: 2025-10-23
**Version**: 1.0.0

## Overview

This guide provides step-by-step instructions to set up, develop, and deploy the Interactive Terpene Map application built with React, TypeScript, Material UI, and D3.js.

---

## Prerequisites

### Required Software

- **Node.js**: v24 LTS or higher ([Download](https://nodejs.org/))
- **pnpm**: v9 or higher (recommended) or npm 11+
- **Git**: For version control

### Verify Installation

```bash
node --version   # Should show v24.x.x or higher
pnpm --version   # Should show 9.x.x or higher (or npm --version for npm 11+)
git --version    # Any recent version
```

### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

---

## Quick Start (TL;DR)

```bash
# Clone the repository
git clone <repository-url>
cd terpene-map-claude

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:5173
```

---

## Detailed Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd terpene-map-claude
```

### 2. Install Dependencies

**Using pnpm (recommended):**

```bash
pnpm install
```

**Using npm:**

```bash
npm install
```

This will install all dependencies defined in `package.json`, including:
- React 18.3+
- Material UI 5.16+
- D3.js 7.9+
- TypeScript 5.7+
- Vite 6+
- i18next 24+
- Vitest (latest)
- Playwright (latest)

**Installation time:** ~30 seconds with pnpm, ~2 minutes with npm

### 3. Prepare Data Files

Ensure terpene data files exist:

```bash
# Check if data files exist
ls data/terpenes.json
ls data/terpenes.yaml
```

If data files don't exist, create sample data or import your own. See [Data Contract](./contracts/data-contract.md) for the expected format.

---

## Development

### Start Development Server

```bash
pnpm dev
```

This command:
- Starts Vite development server on port 5173
- Enables Hot Module Replacement (HMR)
- Opens browser automatically to http://localhost:5173
- Watches for file changes and rebuilds instantly

**Development server features:**
- ⚡ Near-instant startup (< 500ms)
- 🔥 Hot Module Replacement (HMR)
- 🎨 Material UI theme live updates
- 🌐 i18next hot reload for translations
- 📊 D3.js visualizations update on save

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev --host       # Expose server on network (for mobile testing)
pnpm dev --port 3000  # Use custom port

# Building
pnpm build            # Create production build
pnpm preview          # Preview production build locally

# Testing
pnpm test             # Run unit/integration tests (Vitest)
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run end-to-end tests (Playwright)
pnpm test:e2e:ui      # Run Playwright tests with UI

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm type-check       # Run TypeScript compiler check

# Accessibility
pnpm test:a11y        # Run accessibility tests (jest-axe)
```

### Development Workflow

1. **Make Changes**: Edit files in `src/`
2. **View Changes**: Browser updates automatically via HMR
3. **Run Tests**: `pnpm test` to verify functionality
4. **Check Linting**: `pnpm lint` to ensure code quality
5. **Commit**: Use conventional commit messages

---

## Building for Production

### Create Production Build

```bash
pnpm build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles code with Vite (Rollup)
- Optimizes Material UI components (tree-shaking)
- Minifies JavaScript and CSS
- Generates source maps
- Outputs to `dist/` directory

**Build output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js     # Main bundle (~150-200KB gzipped)
│   ├── vendor-[hash].js    # Dependencies (~250-300KB gzipped)
│   └── index-[hash].css    # Styles (~20-30KB gzipped)
└── data/
    └── terpenes.json       # Static data
```

**Expected build time:** 10-20 seconds

**Expected bundle sizes:**
- Main bundle: ~150-200KB (gzipped)
- Vendor bundle (React, Material UI, D3): ~250-300KB (gzipped)
- Total: ~400-500KB (gzipped)

### Preview Production Build

```bash
pnpm preview
```

Opens production build at http://localhost:4173 for testing before deployment.

---

## Testing

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode (recommended during development)
pnpm test:watch

# Coverage report
pnpm test:coverage
```

**Test structure:**
```
tests/
├── unit/
│   ├── components/
│   ├── services/
│   └── hooks/
├── integration/
│   └── dataFlow.test.ts
└── e2e/
    ├── terpene-explorer.spec.ts
    └── accessibility.spec.ts
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run with UI (visual debugger)
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e tests/e2e/accessibility.spec.ts
```

### Accessibility Testing

```bash
pnpm test:a11y
```

Runs jest-axe to verify WCAG 2.1 Level AA compliance.

---

## Deployment

### Static Hosting (Recommended)

The application is a static site and can be deployed to any static hosting provider:

#### Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Build and deploy
pnpm build
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
# Build
pnpm build

# Deploy to gh-pages branch
pnpm add -D gh-pages
pnpm gh-pages -d dist
```

### Environment Variables

No environment variables required (static data application).

For custom API endpoints (future), create `.env` file:

```bash
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Project Structure

```
/
├── data/                      # Static terpene data files
│   ├── terpenes.json
│   └── terpenes.yaml
│
├── public/                    # Static assets
│   └── assets/
│
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component
│   ├── components/           # React components
│   ├── pages/                # Route pages
│   ├── services/             # Business logic
│   ├── models/               # TypeScript types
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization
│   ├── theme/                # Material UI themes
│   └── utils/                # Utility functions
│
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── specs/                     # Feature specifications
│   └── 001-interactive-terpene-map/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md (this file)
│       └── contracts/
│
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
├── .prettierrc               # Prettier configuration
└── package.json
```

---

## Configuration Files

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'd3-vendor': ['d3-hierarchy', 'd3-scale', 'd3-shape'],
        },
      },
    },
  },
});
```

---

## Troubleshooting

### Common Issues

**Issue: Port 5173 already in use**
```bash
# Use different port
pnpm dev --port 3000
```

**Issue: Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: TypeScript errors**
```bash
# Run type check
pnpm type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
```

**Issue: Material UI styles not applied**
```bash
# Ensure CssVarsProvider is used in App.tsx
# Check browser console for errors
```

**Issue: Build fails**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
pnpm build
```

### Performance Issues

**Development server slow:**
- Reduce number of browser extensions
- Close other applications
- Increase Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096 pnpm dev`

**Build time too long:**
- Check bundle size: `pnpm build --analyze`
- Ensure tree-shaking is working (named imports only)

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

**Minimum Requirements:**
- ES2024 support
- CSS Grid and Flexbox
- SVG support (for D3.js charts)
- LocalStorage API

---

## Accessibility Testing

### Manual Testing Checklist

- [ ] Keyboard navigation works (Tab, Enter, Space, Arrows)
- [ ] Screen reader announces content (test with NVDA/JAWS/VoiceOver)
- [ ] Color contrast meets WCAG AA (use browser DevTools)
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Semantic HTML used throughout

### Automated Testing

```bash
# Run axe accessibility tests
pnpm test:a11y

# Run Lighthouse audit
npx lighthouse http://localhost:5173 --view
```

**Target Scores:**
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

---

## Internationalization (i18n)

### Add New Translation

1. Edit translation files in `src/i18n/locales/`
2. Add keys in both `en.json` and `de.json`
3. Use in components: `const { t } = useTranslation();`
4. Access translation: `{t('key.path')}`

**Example:**
```json
// en.json
{
  "search": {
    "placeholder": "Search terpenes..."
  }
}

// de.json
{
  "search": {
    "placeholder": "Terpene suchen..."
  }
}
```

```tsx
// Component
const { t } = useTranslation();
<TextField placeholder={t('search.placeholder')} />
```

---

## Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `pnpm test`
3. Lint and format: `pnpm lint && pnpm format`
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and create pull request

### Commit Message Format

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Scope: component name or feature area
Subject: imperative, lowercase, no period

Example: feat(search): add debouncing to search input
```

---

## Performance Monitoring

### Lighthouse CI (Recommended)

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
pnpm build
lhci autorun --upload.target=temporary-public-storage
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build --analyze

# Or use rollup-plugin-visualizer
pnpm add -D rollup-plugin-visualizer
```

---

## Resources

### Documentation

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [Research Findings](./research.md)
- [Component Contracts](./contracts/component-contract.md)
- [Data Contract](./contracts/data-contract.md)

### External Links

- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/)
- [D3.js Documentation](https://d3js.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [i18next Documentation](https://www.i18next.com/)

### Support

- GitHub Issues: [Link to repository issues]
- Project Wiki: [Link to wiki]
- Developer Slack: [Link to Slack workspace]

---

## Next Steps

After setup, consider:

1. ✅ Review the [Feature Specification](./spec.md)
2. ✅ Understand the [Data Model](./data-model.md)
3. ✅ Explore the [Component Contracts](./contracts/component-contract.md)
4. ✅ Run tests to ensure everything works: `pnpm test`
5. ✅ Start building features following the [Implementation Plan](./plan.md)

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
