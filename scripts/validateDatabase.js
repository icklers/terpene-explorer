import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const masterDatabasePath = path.resolve(__dirname, '../data/terpene-database.json');
const publicDatabasePath = path.resolve(__dirname, '../public/data/terpene-database.json');

function validateDatabaseConsistency() {
  try {
    const masterDatabase = JSON.parse(fs.readFileSync(masterDatabasePath, 'utf-8'));
    const publicDatabase = JSON.parse(fs.readFileSync(publicDatabasePath, 'utf-8'));

    if (JSON.stringify(masterDatabase) !== JSON.stringify(publicDatabase)) {
      console.error('Validation failed: Master and public databases are not synchronized.');
      process.exit(1);
    }

    console.log('Validation passed: Master and public databases are synchronized.');
  } catch (error) {
    console.error('Validation error:', error.message);
    process.exit(1);
  }
}

validateDatabaseConsistency();
