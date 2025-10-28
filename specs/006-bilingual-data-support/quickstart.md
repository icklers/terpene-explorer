# Quick Start Guide: Bilingual Terpene Data Support

**Feature**: 006-bilingual-data-support  
**Date**: 2025-10-28  
**Audience**: Developers adding or maintaining translations

## Overview

This guide explains how to work with bilingual terpene data in the Terpene Explorer application. It covers adding new translations, testing translation support, and troubleshooting common issues.

## Prerequisites

- Node.js 24+ and pnpm 10+ installed
- Familiarity with TypeScript and React
- Basic understanding of i18next

## Adding a New German Translation

### Step 1: Locate the Translation File

Open `/data/terpene-translations-de.json`:

```json
{
  "language": "de",
  "version": "1.0.0",
  "terpenes": {
    // Translations go here
  }
}
```

### Step 2: Find the Terpene ID

Open `/data/terpene-database.json` and find the terpene you want to translate. Copy its UUID:

```json
{
  "entries": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",  // ← Copy this ID
      "name": "Limonene",
      // ...
    }
  ]
}
```

### Step 3: Add the Translation

Add a new entry to `terpenes` object in the German translation file:

```json
{
  "language": "de",
  "version": "1.0.0",
  "terpenes": {
    "550e8400-e29b-41d4-a716-446655440001": {
      "name": "Limonen",
      "description": "Zitrus-Terpen, verantwortlich für stimmungsaufhellende Eigenschaften",
      "aroma": "Zitrus, Zitrone, Orange",
      "taste": "Helles Zitrusaroma mit leichter Süße",
      "effects": ["Stimmungsaufhellend", "Stressabbau", "Energetisierend"],
      "therapeuticProperties": ["Antidepressiv", "Entzündungshemmend"],
      "sources": ["Zitronenschale", "Orangenschale"],
      "notableDifferences": "D-Form steigert Serotonin"
    }
  }
}
```

**Important Notes:**
- All fields are optional - you can translate just the name if that's all you have
- Array fields (effects, sources, therapeuticProperties) must be arrays in German too
- Keep terminology consistent across translations
- Use proper German grammar and capitalization

### Step 4: Validate the Translation

Run the validation script:

```bash
pnpm run copy-and-validate-data
```

This will:
- Validate JSON syntax
- Check that UUIDs exist in base database
- Verify field types match schema
- Report any errors

### Step 5: Test in the Application

Start the dev server and switch to German:

```bash
pnpm run dev
```

1. Open http://localhost:5173
2. Click the language switcher in the top bar
3. Select "Deutsch"
4. Verify your translations appear correctly
5. Check that untranslated fields show English with "EN" badge

## Partial Translations

You don't need to translate all fields at once. Here's a minimal translation with just the name:

```json
{
  "550e8400-e29b-41d4-a716-446655440001": {
    "name": "Limonen"
  }
}
```

The app will automatically:
- Display "Limonen" as the name
- Show other fields in English with italic text and "EN" badge
- Still allow searching by English and German terms

## Translation Guidelines

### Terpene Names

- Use German botanical nomenclature where it exists
- Keep Greek letters and chemical notation: "β-Myrcen", "α-Pinen"
- Examples:
  - Limonene → Limonen
  - Myrcene → Myrcen
  - Pinene → Pinen
  - Linalool → Linalool (no change)

### Effects and Therapeutic Properties

- Use German medical/pharmacological terminology
- Keep scientific accuracy over literal translation
- Examples:
  - "Sedative" → "Beruhigend" or "Sedierend"
  - "Anti-inflammatory" → "Entzündungshemmend"
  - "Anxiolytic" → "Angstlösend"
  - "Mood enhancing" → "Stimmungsaufhellend"

### Sources (Plant Names)

- Use common German plant names
- Examples:
  - "Lemon peel" → "Zitronenschale"
  - "Orange rind" → "Orangenschale"
  - "Pine needles" → "Kiefernnadeln"
  - "Hops" → "Hopfen"

### Aromas

- Use German aroma descriptors
- Examples:
  - "Citrus" → "Zitrus"
  - "Earthy" → "Erdig"
  - "Floral" → "Blumig"
  - "Spicy" → "Würzig"
  - "Woody" → "Holzig"

## Using Translations in Components

### With the useTerpeneTranslation Hook

```tsx
import { useTerpeneTranslation } from '@/hooks/useTerpeneTranslation';

function TerpeneCard({ terpeneId }: Props) {
  const { getTerpene, isFullyTranslated } = useTerpeneTranslation();
  
  const terpene = getTerpene(terpeneId);
  const isComplete = isFullyTranslated(terpeneId);
  
  return (
    <Card>
      <Typography variant="h5">{terpene.name}</Typography>
      <Typography>{terpene.description}</Typography>
      {!isComplete && <Chip label="Partial Translation" size="small" />}
    </Card>
  );
}
```

### With TranslatedText Component

```tsx
import { TranslatedText } from '@/components/common/TranslatedText';

function TerpeneDescription({ terpene }: Props) {
  const isFallback = terpene.translationStatus.fallbackFields.includes('description');
  
  return (
    <TranslatedText isFallback={isFallback} fallbackLanguage="en">
      {terpene.description}
    </TranslatedText>
  );
}
```

The component automatically applies italic styling and adds the "EN" badge when `isFallback` is true.

## Testing Translations

### Unit Tests

Test that your translation loads correctly:

```bash
pnpm run test:unit -- translationService
```

### Integration Tests

Test the full translation flow:

```bash
pnpm run test:integration -- terpene-translation
```

### E2E Tests

Test user-facing translation features:

```bash
pnpm run test:e2e -- bilingual-support
```

### Manual Testing Checklist

- [ ] Translation file validates without errors
- [ ] Terpene name appears in German
- [ ] Untranslated fields show "EN" badge
- [ ] Search works with German terms
- [ ] Effects filter shows German labels
- [ ] Language switching preserves app state
- [ ] No console errors when viewing translated terpenes

## Troubleshooting

### Translation Not Appearing

**Problem**: You added a translation but it still shows English.

**Solutions**:
1. Check that the terpene ID matches exactly (UUIDs are case-sensitive)
2. Clear browser cache and hard reload (Ctrl+Shift+R)
3. Check browser console for validation errors
4. Verify JSON syntax is valid (no trailing commas)

### Validation Errors

**Problem**: `pnpm run copy-and-validate-data` reports errors.

**Common Issues**:
- **"Invalid UUID"**: Check that you copied the full UUID from the base database
- **"Invalid type"**: Ensure arrays are arrays, strings are strings
- **"Required field missing"**: The `language` and `version` fields must be present at the top level
- **"Invalid language code"**: Must be exactly "de" (lowercase)

### Search Not Finding German Terms

**Problem**: Searching for German words doesn't return results.

**Solutions**:
1. Ensure the dev server was restarted after adding translations
2. Check that the search index was rebuilt (see console logs)
3. Verify the German term is actually in the translation file

### EN Badge Not Showing

**Problem**: Untranslated fields don't show the "EN" badge.

**Solutions**:
1. Check that `TranslatedText` component is being used
2. Verify `isFallback` prop is set correctly
3. Check browser console for React component errors
4. Ensure the `LanguageBadge` component is imported correctly

## File Structure Reference

```text
/data/
├── terpene-database.json           # Base English data (do not edit for translations)
└── terpene-translations-de.json    # German translations (edit this)

/src/
├── services/
│   ├── translationService.ts       # Core translation logic
│   └── terpeneDataService.ts       # Data loading
├── hooks/
│   └── useTerpeneTranslation.ts    # React hook for translations
└── components/
    └── common/
        ├── TranslatedText.tsx      # Wrapper with fallback styling
        └── LanguageBadge.tsx       # "EN" badge component
```

## Translation Workflow Summary

```text
1. Find terpene in terpene-database.json
   ↓
2. Copy UUID
   ↓
3. Add translation to terpene-translations-de.json
   ↓
4. Run validation: pnpm run copy-and-validate-data
   ↓
5. Test in browser: pnpm run dev
   ↓
6. Commit changes
```

## Best Practices

1. **Translate high-priority terpenes first**: Start with the most common terpenes (Core category)
2. **Keep translations consistent**: Use the same German term for the same English concept
3. **Validate early and often**: Run validation after each translation batch
4. **Test in context**: View translations in the actual UI, not just in the JSON file
5. **Commit incrementally**: Don't wait to translate everything - commit partial progress
6. **Document ambiguities**: If a term is ambiguous, add a comment in the PR

## Getting Help

- **Documentation**: See `specs/006-bilingual-data-support/` directory
- **Code Examples**: Check existing German translations in `terpene-translations-de.json`
- **Issues**: Open GitHub issue with "translation" label
- **Questions**: Ask in project Discord/Slack

## Next Steps

After adding translations:
1. Run full test suite: `pnpm run test:all`
2. Check accessibility: `pnpm run test:a11y`
3. Create pull request with descriptive title
4. Request review from maintainer

Happy translating! 🌿
