# Terpene Explorer

An interactive web application for exploring cannabis terpenes, their effects, and therapeutic properties. Features interactive
visualizations and comprehensive search capabilities.

## Features

### Interactive Visualizations

- **D3.js Visualizations**: Interactive sunburst charts showing terpene profiles
- **Effect Maps**: Visual representation of terpene effects
- **Filter Visualizations**: Real-time updates based on user selections

### Categorized Effect Filters ⭐ NEW

- **4 Therapeutic Categories**:
  - Mood & Energy (⚡) - 4 effects including Energizing, Mood enhancing
  - Cognitive & Mental Enhancement (🧠) - 4 effects including Focus, Memory-enhancement
  - Relaxation & Anxiety Management (😌) - 5 effects including Anxiety relief, Stress relief
  - Physical & Physiological Management (💪) - 6 effects including Anti-inflammatory, Pain relief
- **Category-Level Filtering**: Click category tabs to filter terpenes by therapeutic category
- **Color Coding**: WCAG 2.1 AA compliant colors for quick visual identification
- **Mobile Responsive**: Accordion interface for screens < 600px wide
- **Accessibility**: Full keyboard navigation, ARIA labels, screen reader support

### Search & Filter

- **Multi-language Support**: Internationalization with i18next
- **Real-time Search**: Filter terpenes by name, aroma, and effects
- **Effect Filtering**: Filter by therapeutic effects with AND/OR logic
- **Category Filtering**: Filter by therapeutic categories (new!)

### Data

- **Static JSON Database**: No backend required, data served from `/data` directory
- **Effect Categorization**: Effects grouped into therapeutic categories
- **Terpene Profiles**: Comprehensive terpene information

## Technology Stack

- **TypeScript 5.7+** - Type-safe development
- **Node.js 24 LTS** - Runtime environment
- **React 19.2+** - Component framework
- **Material UI 6.3+** - UI component library
- **Emotion 11.13+** - CSS-in-JS styling
- **D3.js 7.9+** - Data visualization
- **i18next 24/25+** - Internationalization
- **Zod 3.24+** - Schema validation
- **js-yaml 4.1+** - YAML parsing

## Data Sources

Static JSON files in `/data` directory:

- `terpene-database.json` - Main terpene database with effect categorization
- `terpenes.json` - Alternative terpene data format
- `terpenes.yaml` - YAML format terpene data

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Type checking
pnpm type-check

# Format code
pnpm format

# Lint and auto-fix
pnpm lint:fix
```

## Accessibility

The application is WCAG 2.1 Level AA compliant:

- Color contrast ratios ≥4.5:1
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and live regions
- Skip links and focus indicators

See [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) for detailed accessibility documentation.

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.
