# Data Model

## Entities

### Terpene

Represents a single terpene.

**Fields**:

- `name` (string, required): The name of the terpene.
- `description` (string, required): A description of the terpene.
- `aroma` (array of strings, required): A list of aromas associated with the terpene.
- `effects` (array of strings, required): A list of effects associated with the terpene.
- `sources` (array of strings, required): A list of common sources of the terpene.

### Effect

Represents a category of effect that a terpene can have.

**Fields**:

- `name` (string, required): The name of the effect (e.g., "calming", "energetic").
