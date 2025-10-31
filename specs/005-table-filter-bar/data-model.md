# Data Model: Table Filter Bar Extension with Bilingual Support

## Core Entities

### Filter Bar (SearchBar Component)
- **Type**: UI Component (React)
- **Fields/Props**:
  - `value`: string - Current filter text input
  - `placeholder`: string - Localized placeholder text based on selected language
  - `onChange`: function - Callback for text input changes
  - `maxLength`: number - Maximum character length (100 characters)
  - `minLength`: number - Minimum activation length (2 characters)

### Filter Criteria
- **Type**: string
- **Validation**:
  - Minimum length: 2 characters (for activation)
  - Maximum length: 100 characters
  - Special character support: umlauts, accents, and other diacritics
  - Case insensitive: true

### Terpene Entity
- **Type**: Interface/Object
- **Fields** (with filtering support):
  - `name`: string - Terpene name (existing filter target)
  - `effects`: string[] - Effects array (existing filter target)
  - `aroma`: string - Aroma descriptor (existing filter target)
  - `taste`: string - Taste profile (new filter target - FR-004)
  - `therapeuticProperties`: string[] - Therapeutic properties array (new filter target - FR-005)
  - `languageVersion`: string - Language version (en/de) for bilingual matching

### Filter Result
- **Type**: Terpene[] (array of filtered terpenes)
- **Validation**:
  - Must match at least one searchable attribute (OR logic)
  - Preserves original table order (no re-sorting)

## Bilingual Data Considerations

### Translation Service Integration
- **Input**: Search term in active language
- **Output**: Matches in both English and German terpene data
- **Performance**: Must complete within 50ms (FR-030)
- **Fallback**: Gracefully degrades to English-only search when translation service fails (FR-031)

### Language-Specific Processing
- **Special Characters**: Supports umlauts, accents, and diacritics for both languages (FR-033)
- **Text Normalization**: Locale-aware comparison methods for accurate matching
- **Placeholder Text**: Different text for each language (English: "Filter terpenes by name, effect, aroma...", German: "Terpene nach Name, Wirkung, Aroma...")

## State Relationships

### Filter State Management
```
[User Input] -> [Filter Criteria] -> [Search Processing] -> [Filtered Results] -> [UI Display]
```

### Language Switching Behavior
```
[Active Filter Preserved] -> [Language Change] -> [Filter Re-applied] -> [Results in New Language]
```

## Validation Rules

1. **Character Limits**: Filter input must be 2-100 characters (FR-021, FR-022)
2. **Search Logic**: OR-based matching across all attributes (FR-006)
3. **Case Insensitive**: Searches ignore case (FR-015)
4. **Partial Matching**: Supports partial string matching (FR-014)
5. **Bilingual Matching**: Matches against both languages when German is selected (FR-024, FR-025, FR-026)
6. **Empty State**: Shows "No match found for your filter" when no results (FR-017)

## Performance Constraints

- **Response Time**: Filter operations <100ms for up to 500 terpenes (FR-020a)
- **Translation Service**: Lookups <50ms (FR-030)
- **Order Preservation**: Results maintain original table order (FR-023)