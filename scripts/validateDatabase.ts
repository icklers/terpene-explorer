import fs from 'fs';
import path from 'path';
import { TerpeneDatabaseSchema } from '../src/utils/terpeneSchema';

const masterDatabasePath = path.resolve(__dirname, '../data/terpene-database.json');
const publicDatabasePath = path.resolve(__dirname, '../public/data/terpene-database.json');

function validateDatabaseSchema(database: unknown, databasePath: string): void {
  try {
    TerpeneDatabaseSchema.parse(database);
    console.log(`Schema validation passed for ${databasePath}`);
  } catch (error: any) {
    console.error(`Schema validation failed for ${databasePath}:`, error.errors);
    process.exit(1);
  }
}

function validateDatabaseConsistency(): void {
  try {
    const masterDatabase = JSON.parse(fs.readFileSync(masterDatabasePath, 'utf-8'));
    const publicDatabase = JSON.parse(fs.readFileSync(publicDatabasePath, 'utf-8'));

    // Validate schema for both databases
    validateDatabaseSchema(masterDatabase, 'Master Database');
    validateDatabaseSchema(publicDatabase, 'Public Database');

    if (JSON.stringify(masterDatabase) !== JSON.stringify(publicDatabase)) {
      console.error('Validation failed: Master and public databases are not synchronized.');
      process.exit(1);
    }

    console.log('Validation passed: Master and public databases are synchronized.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation error:', error.message);
    } else {
      console.error('Validation error:', error);
    }
    process.exit(1);
  }
}

validateDatabaseConsistency();
