import type { SearchOptions } from '../types/terpene';
import { TerpeneDatabaseSchema, type Terpene } from '../utils/terpeneSchema';

/**
 * Loads and validates the terpene database from static JSON file.
 * @returns Promise resolving to array of validated Terpene objects
 * @throws Error if load or validation fails
 */
export async function loadTerpeneDatabase(): Promise<Terpene[]> {
  try {
    // Dynamic import for code splitting
    const rawData = await import('../../data/terpene-database.json');

    // Extract the actual database from the terpene_database_schema wrapper
    const data = rawData.default?.terpene_database_schema || rawData.terpene_database_schema || rawData;

    // Validate entire database
    const validated = TerpeneDatabaseSchema.parse(data);

    return validated.entries;
  } catch (error) {
    console.error('Failed to load terpene database:', error);
    // Specific error message per clarification (2025-10-25)
    throw new Error(
      'Data format error. Please open an issue on GitHub: https://github.com/icklers/terpene-explorer/issues'
    );
  }
}

/**
 * Retrieves a single terpene by its ID.
 * @param terpenes - Array of terpenes (from loadTerpeneDatabase())
 * @param id - Terpene ID (e.g., "terp-001")
 * @returns Terpene object if found, undefined otherwise
 */
export function getTerpeneById(
  terpenes: Terpene[],
  id: string
): Terpene | undefined {
  return terpenes.find((t) => t.id === id);
}

/**
 * Filters terpenes based on search query.
 * @param terpenes - Array of terpenes to search
 * @param query - Search query (case-insensitive by default)
 * @param options - Optional search configuration
 * @returns Filtered array of terpenes matching query
 */
export function searchTerpenes(
  terpenes: Terpene[],
  query: string,
  options?: SearchOptions
): Terpene[] {
  if (!query.trim()) return terpenes;

  const normalizedQuery = options?.caseSensitive
    ? query
    : query.toLowerCase();

  const searchFields = options?.fields || [
    'name',
    'aroma',
    'effects',
    'therapeuticProperties',
  ];

  return terpenes.filter((terpene) => {
    return searchFields.some((field) => {
      if (field === 'effects' || field === 'therapeuticProperties') {
        return terpene[field].some((item) =>
          (options?.caseSensitive ? item : item.toLowerCase()).includes(
            normalizedQuery
          )
        );
      }
      const value = terpene[field];
      return (options?.caseSensitive ? value : value.toLowerCase()).includes(
        normalizedQuery
      );
    });
  });
}

/**
 * Filters terpenes by category tier.
 * @param terpenes - Array of terpenes to filter
 * @param category - Category to filter by
 * @returns Filtered array of terpenes in specified category
 */
export function filterByCategory(
  terpenes: Terpene[],
  category: 'Core' | 'Secondary' | 'Minor'
): Terpene[] {
  return terpenes.filter((t) => t.category === category);
}

/**
 * Sorts terpenes by specified field and direction.
 * @param terpenes - Array of terpenes to sort
 * @param sortBy - Field to sort by
 * @param direction - Sort direction
 * @returns New sorted array (does not mutate original)
 */
export function sortTerpenes(
  terpenes: Terpene[],
  sortBy: 'name' | 'category' | 'aroma',
  direction: 'asc' | 'desc'
): Terpene[] {
  const sorted = [...terpenes].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return aValue.localeCompare(bValue);
  });

  return direction === 'asc' ? sorted : sorted.reverse();
}
