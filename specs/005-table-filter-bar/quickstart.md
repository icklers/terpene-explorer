# Quickstart: Table Filter Bar Extension with Bilingual Support

## Overview
This guide provides the essential steps for implementing the extended filter functionality that supports multi-attribute and bilingual search capabilities.

## Prerequisites
- Node.js 24+ installed
- pnpm package manager installed
- Project repository cloned and dependencies installed (`pnpm install`)

## Setup

### 1. Environment Verification
```bash
# Clone the repo if you haven't already
git clone <repository-url>
cd <repository-name>

# Install dependencies
pnpm install

# Verify the project builds successfully
pnpm run build

# Start the development server
pnpm dev
```

### 2. Branch Setup
```bash
# Switch to the feature branch
git checkout 005-table-filter-bar
```

## Implementation Steps

### Step 1: Extend Filter Service
1. Update `src/services/filterService.ts`
   - Modify `matchesSearchQuery()` to include taste and therapeuticProperties
   - Add bilingual search capability using translation service
   - Implement special character handling

### Step 2: Update UI Components
1. Update `src/components/filters/SearchBar.tsx`
   - Implement maxLength={100} prop
   - Ensure proper internationalization

### Step 3: Update Translation Files
1. Update `src/i18n/locales/en/translation.json`
   - Add new placeholder text for enhanced filtering
2. Update `src/i18n/locales/de/translation.json`
   - Add German translation of placeholder text

### Step 4: Add Tests
1. Update `tests/unit/services/filterService.test.ts`
   - Add tests for new filter attributes
   - Add tests for bilingual functionality
2. Update `tests/unit/components/SearchBar.test.tsx`
   - Add tests for character limits

## Key Features to Test

### Multi-attribute Filtering
- Search by terpene name
- Search by effects
- Search by aroma
- Search by taste (new)
- Search by therapeutic properties (new)
- Combined searches across multiple attributes

### Bilingual Support
- Switch between English and German
- Verify search works with language-specific terms
- Test special characters (umlauts, etc.)
- Ensure filter persists when language changes

### UI/UX Improvements
- Filter bar location in filter area
- Updated placeholder text
- 2-character minimum enforcement
- 100-character maximum enforcement
- Proper empty state message ("No match found for your filter")

## Running Tests
```bash
# Run all unit tests
pnpm vitest

# Run specific filter service tests
pnpm vitest tests/unit/services/filterService.test.ts

# Run end-to-end tests
pnpm playwright test

# Run accessibility tests
pnpm run check-a11y
```

## Performance Validation
- Filter operations complete in <100ms for up to 500 terpenes
- Translation service lookups complete in <50ms
- UI remains responsive during filtering

## Troubleshooting

### Common Issues:
1. **Search not working for new attributes** - Ensure you've updated the `matchesSearchQuery()` function
2. **Bilingual search not working** - Verify the translation service integration
3. **Special characters not matching** - Check Unicode normalization implementation
4. **Performance degradation** - Review the efficiency of the search algorithm with bilingual support

## Next Steps
1. Complete all implementation tasks in `tasks.md`
2. Run full test suite
3. Verify performance metrics
4. Update documentation
5. Prepare for code review