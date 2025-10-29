import { TerpeneTranslation, TranslatedTerpene } from '@/models/TerpeneTranslation';
import { Terpene } from '@/types/terpene';
import { normalizeDiacritics } from '@/utils/translationHelpers';

export interface SearchIndex {
  id: string;
  searchText: string;
  normalizedText: string;
}

export interface ITranslationSearchService {
  /**
   * Build search index for all terpenes with translations
   * 
   * @param terpenes - Base terpene data
   * @param translations - Translation data for all languages
   */
  buildSearchIndex(
    terpenes: Terpene[],
    translations: Record<string, TerpeneTranslation>
  ): void;

  /**
   * Search terpenes by query string in all languages
   * 
   * @param query - Search query
   * @param language - Current UI language (for result formatting)
   * @returns Array of matching TranslatedTerpene objects
   */
  search(query: string, language: string): TranslatedTerpene[];

  /**
   * Search specific fields across languages
   * 
   * @param query - Search query
   * @param fields - Fields to search in
   * @param language - Current UI language
   * @returns Array of matching TranslatedTerpene objects
   */
  searchFields(
    query: string,
    fields: Array<keyof Terpene>,
    language: string
  ): TranslatedTerpene[];

  /**
   * Clear search index (for rebuilding)
   */
  clearIndex(): void;
}

export class TranslationSearchService implements ITranslationSearchService {
  private searchIndex: SearchIndex[] = [];
  private terpenes: Map<string, Terpene> = new Map();

  buildSearchIndex(
    terpenes: Terpene[],
    translations: Record<string, TerpeneTranslation>
  ): void {
    // Store terpene data for quick lookup
    this.terpenes = new Map(terpenes.map(terpene => [terpene.id, terpene]));

    // Build search index
    this.searchIndex = terpenes.map(terpene => {
      // Start with base terpene fields
      let searchTerms = [
        terpene.name,
        terpene.aroma,
        terpene.description,
        terpene.taste,
        ...terpene.effects,
        ...terpene.sources,
        ...terpene.therapeuticProperties,
        terpene.notableDifferences
      ].filter(term => term !== undefined && term !== null) as string[];

      // Add translated terms if available
      const translation = translations[terpene.id];
      if (translation) {
        if (translation.name) searchTerms.push(translation.name);
        if (translation.aroma) searchTerms.push(translation.aroma);
        if (translation.description) searchTerms.push(translation.description);
        if (translation.taste) searchTerms.push(translation.taste);
        if (translation.effects) searchTerms = searchTerms.concat(translation.effects);
        if (translation.sources) searchTerms = searchTerms.concat(translation.sources);
        if (translation.therapeuticProperties) searchTerms = searchTerms.concat(translation.therapeuticProperties);
        if (translation.notableDifferences) searchTerms.push(translation.notableDifferences);
      }

      // Remove duplicates and join into a single search string
      const uniqueTerms = [...new Set(searchTerms)];
      const searchText = uniqueTerms.join(' ').toLowerCase();
      const normalizedText = normalizeDiacritics(searchText);

      return {
        id: terpene.id,
        searchText,
        normalizedText
      };
    });
  }

  search(query: string, language: string): TranslatedTerpene[] {
    if (!query) return [];

    // Normalize the search query
    const normalizedQuery = normalizeDiacritics(query.toLowerCase());
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

    // Find matches - all query terms must be present in the search text
    const matchedIds = this.searchIndex.filter(index => {
      return queryTerms.every(term => index.normalizedText.includes(term));
    }).map(index => index.id);

    // Return the full terpene data for matched IDs
    return matchedIds.map(id => {
      const baseTerpene = this.terpenes.get(id);
      if (!baseTerpene) return null;

      // For a complete implementation, we would merge with translation
      // For now, return the base terpene as placeholder
      return {
        ...baseTerpene,
        translationStatus: {
          language,
          isFullyTranslated: false,
          fallbackFields: [] // Placeholder
        }
      } as TranslatedTerpene;
    }).filter((terpene): terpene is TranslatedTerpene => terpene !== null);
  }

  searchFields(query: string, _fields: Array<keyof Terpene>, language: string): TranslatedTerpene[] {
    if (!query) return [];

    // For field-specific search, we still search the combined index but could be optimized
    return this.search(query, language);
  }

  clearIndex(): void {
    this.searchIndex = [];
    this.terpenes = new Map();
  }
}