# Data Model

This document outlines the data model for the Interactive Terpene Map.

## Entities

### Terpene

Represents a single terpene. It has the following attributes:

- `id` (string): A unique identifier for the terpene (e.g., a UUID).
- `name` (string): The name of the terpene.
- `description` (string): A brief description of the terpene.
- `aroma` (string): The characteristic aroma of the terpene.
- `effects` (array of strings): A list of effects associated with the terpene.
- `sources` (array of strings): A list of natural sources where the terpene can be found.

### Effect

Represents a category of effect that a terpene can have (e.g., "calming", "energetic").
