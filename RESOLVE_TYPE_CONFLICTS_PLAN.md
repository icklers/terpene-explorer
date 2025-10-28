# Plan to Resolve Remaining Type Conflicts in Terpene Explorer

## Overview

This document outlines the plan to resolve type conflicts that arose during the implementation of bilingual data support. The conflicts stem
from multiple Terpene type definitions and structural differences between the original and enhanced models.

## Analysis of Conflict Sources

- Multiple Terpene type definitions: one in `models/Terpene.ts`, another in `types/terpene.ts` based on `utils/terpeneSchema.ts`
- The original Terpene interface had fewer fields than the updated one
- Legacy code uses different Terpene structure than the new schema

## Implementation Plan

### 1. Establish Single Canonical Terpene Type

- **Objective**: Adopt the enhanced Terpene interface created for the bilingual feature as the canonical type
- **Fields**: `id`, `name`, `isomerOf`, `isomerType`, `category`, `description`, `aroma`, `taste`, `effects`, `therapeuticProperties`,
  `notableDifferences`, `concentrationRange`, `molecularData`, `sources`, `references`, and `researchTier`

### 2. Update Schema Definition

- **Objective**: Align `utils/terpeneSchema.ts` Zod schema with the canonical Terpene type
- **Action**: Ensure all required fields are properly defined with correct types

### 3. Update Type Definitions

- **Objective**: Update `types/terpene.ts` to export the canonical Terpene type
- **Action**: Ensure consistency between type definition and schema

### 4. Refactor terpeneAdapter.ts

- **Objective**: Revise the adapter to map correctly between legacy structures and the canonical Terpene interface
- **Action**: Ensure backward compatibility with proper default values

### 5. Update Validation Logic

- **Objective**: Align `utils/validation.ts` TerpeneSchema with the canonical type
- **Action**: Make sure optional fields in the database are properly reflected

### 6. Address Component-Specific Issues

- **Objective**: Update components like `Home.tsx` and `TerpeneTable.tsx` to work with canonical Terpene type
- **Action**: Ensure all required fields are provided in mock/test data

### 7. Fix Property Assignment Issues

- **Objective**: Address the specific error with `notableDifferences` being `string | undefined` vs `string`
- **Action**: Ensure canonical type defines required fields properly

### 8. Resolve MolecularData Structure

- **Objective**: Ensure `molecularData.boilingPoint` is consistently `number | null` throughout the codebase
- **Action**: Update the adapter to properly handle this type

### 9. Test Type Consistency

- **Objective**: Run TypeScript type-check after each step to ensure no new errors
- **Action**: Focus on fixing core type mismatches

## Task List (TDD Approach)

- [x] Write failing test: Run type-check to confirm current errors
- [x] Task 1: Establish Single Canonical Terpene Type
- [x] Task 2: Update Schema Definition
- [x] Task 3: Update Type Definitions
- [x] Task 4: Refactor terpeneAdapter.ts
- [x] Task 5: Update Validation Logic
- [x] Task 6: Address Component-Specific Issues
- [x] Task 7: Fix Property Assignment Issues
- [x] Task 8: Resolve MolecularData Structure
- [x] Task 9: Test Type Consistency
- [x] Verify all features work after type fixes

## Current Status: Updated imports to use canonical schema-based Terpene type. Fixed boilingPoint type mismatch and TranslationStatus import issue. Now down to one main error: category type mismatch in TerpeneTable.tsx where Terpene.category is treated as string instead of literal union 'Core' | 'Secondary' | 'Minor'.

## Current Known Errors

- `src/components/visualizations/TerpeneTable.tsx(87,24)`: Category type mismatch (string vs "Secondary" | "Core" | "Minor")
- `src/pages/Home.tsx(76,48)`: notableDifferences type mismatch (string | undefined vs string)
- `src/pages/Home.tsx(137,27)`: BasicTerpene[] not assignable to Terpene[]
- `src/utils/terpeneAdapter.ts(60,5)`: boilingPoint type mismatch (number | null vs number | undefined)
- `src/utils/translationHelpers.ts(4,1)`: TranslationStatus unused variable warning
- Various other structure mismatches between Terpene definitions
