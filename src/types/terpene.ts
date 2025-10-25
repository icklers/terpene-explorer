// Re-export types from schema
export type {
  Terpene,
  TerpeneDatabase,
  MolecularData,
  Reference,
  ResearchTier,
} from '../utils/terpeneSchema';

// UI-specific interfaces
export interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
}

export interface SearchOptions {
  fields?: ('name' | 'aroma' | 'effects' | 'therapeuticProperties')[];
  caseSensitive?: boolean;
}

export interface UseTerpeneDataResult {
  terpenes: Terpene[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}
