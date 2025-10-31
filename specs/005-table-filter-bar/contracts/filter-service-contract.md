# Filter Service API Contract

## Overview
This document specifies the interface for the filter service used in the terpene explorer application. The service provides multi-attribute and bilingual filtering capabilities.

## Service Interface

### Function: matchesSearchQuery
```typescript
function matchesSearchQuery(
  terpene: Terpene, 
  searchQuery: string, 
  language: 'en' | 'de'
): boolean
```

#### Parameters:
- `terpene`: The terpene object to match against
- `searchQuery`: The search term entered by the user (2-100 characters)
- `language`: The active language ('en' for English, 'de' for German)

#### Return:
- `boolean`: True if the terpene matches the search query, false otherwise

#### Behavior:
- Performs case-insensitive, partial matching
- Searches across name, effects, aroma, taste, and therapeutic properties
- When language is 'de', performs cross-language matching using translation service
- Supports special characters including umlauts and diacritics
- Returns true if ANY attribute matches (OR logic)

### Function: applyFilters
```typescript
function applyFilters(
  terpenes: Terpene[], 
  searchQuery: string, 
  language: 'en' | 'de'
): Terpene[]
```

#### Parameters:
- `terpenes`: Array of terpene objects to filter
- `searchQuery`: The search term entered by the user
- `language`: The active language

#### Return:
- `Terpene[]`: Array of terpenes that match the search query, maintaining original order

#### Behavior:
- Applies matchesSearchQuery to each terpene in the array
- Preserves original order of terpenes (no re-sorting)
- Enforces minimum 2-character requirement before filtering
- Handles empty search query by returning all terpenes

## Data Models

### Terpene Interface
```typescript
interface Terpene {
  name: string;
  effects: string[];
  aroma: string;
  taste: string;
  therapeuticProperties: string[];
}
```

## Performance Requirements
- Individual filter operation: <100ms for up to 500 terpenes
- Translation service lookup: <50ms
- Function must handle special characters properly

## Error Handling
- Gracefully degrades to English-only search when translation service fails
- Handles undefined or null values in terpene attributes safely
- Sanitizes input to prevent XSS attacks