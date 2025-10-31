import { TerpeneTranslation } from '@/models/TerpeneTranslation';

export interface ITranslationCache {
  /**
   * Store a translation by its ID
   */
  set(id: string, translation: TerpeneTranslation): void;

  /**
   * Get a translation by its ID
   */
  get(id: string): TerpeneTranslation | undefined;

  /**
   * Load bulk translations into the cache
   */
  loadBulk(translations: Record<string, TerpeneTranslation>): void;

  /**
   * Clear the entire cache
   */
  clear(): void;

  /**
   * Get the current size of the cache
   */
  size(): number;
}

export class TranslationCache implements ITranslationCache {
  private cache: Map<string, TerpeneTranslation> = new Map();

  set(id: string, translation: TerpeneTranslation): void {
    this.cache.set(id, translation);
  }

  get(id: string): TerpeneTranslation | undefined {
    return this.cache.get(id);
  }

  loadBulk(translations: Record<string, TerpeneTranslation>): void {
    Object.entries(translations).forEach(([id, translation]) => {
      this.cache.set(id, translation);
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
