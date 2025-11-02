// Import types from schema first
import type {
  Terpene as TerpeneType,
  TerpeneDatabase as TerpeneDatabaseType,
  MolecularData as MolecularDataType,
  Reference as ReferenceType,
  ResearchTier as ResearchTierType,
  Effect as EffectType,
  TherapeuticProperty as TherapeuticPropertyType,
} from '../utils/terpeneSchema';

// Re-export types
export type Terpene = TerpeneType;
export type TerpeneDatabase = TerpeneDatabaseType;
export type MolecularData = MolecularDataType;
export type Reference = ReferenceType;
export type ResearchTier = ResearchTierType;
export type Effect = EffectType;
export type TherapeuticProperty = TherapeuticPropertyType;

// UI-specific interfaces
export interface TerpeneDetailModalProps {
  open: boolean;
  terpene: Terpene | null;
  onClose: () => void;
  onTherapeuticPropertyClick?: (property: string) => void;
  onEffectClick?: (effect: string) => void;
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
