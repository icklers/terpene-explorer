import yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

async function loadTerpenes() {
  try {
    const [jsonResponse, yamlResponse] = await Promise.all([
      fetch('/data/terpenes.json'),
      fetch('/data/terpenes.yaml'),
    ]);

    if (!jsonResponse.ok) {
      throw new Error(`Failed to load terpenes.json: ${jsonResponse.statusText}`);
    }
    if (!yamlResponse.ok) {
      throw new Error(`Failed to load terpenes.yaml: ${yamlResponse.statusText}`);
    }

    const jsonData = await jsonResponse.json();
    const yamlText = await yamlResponse.text();
    const yamlData = yaml.load(yamlText);

    const allTerpenesMap = new Map();

    const processCategory = (categoryData) => {
      for (const categoryKey in categoryData) {
        categoryData[categoryKey].terpenes.forEach(terpene => {
          // Ensure each terpene has a unique ID and merge data
          const existingTerpene = allTerpenesMap.get(terpene.name);
          if (existingTerpene) {
            // Merge properties if terpene already exists (e.g., from JSON and YAML)
            Object.assign(existingTerpene, {
              ...terpene,
              key_effects: [...new Set([...(existingTerpene.key_effects || []), ...(terpene.key_effects || [])])],
              category_name: existingTerpene.category_name || categoryData[categoryKey].category_name,
            });
          } else {
            allTerpenesMap.set(terpene.name, {
              id: uuidv4(), // Generate a unique ID
              name: terpene.name,
              description: terpene.notable_differences || '',
              aroma: terpene.aroma || '',
              effects: terpene.key_effects || [],
              sources: [], // Still a placeholder, as it's not in the data
              category: categoryData[categoryKey].category_name,
            });
          }
        });
      }
    };

    processCategory(jsonData);
    processCategory(yamlData);

    return { data: Array.from(allTerpenesMap.values()), error: null };
  } catch (error) {
    console.error("Error loading terpenes:", error);
    return { data: [], error: error.message };
  }
}

export { loadTerpenes };
