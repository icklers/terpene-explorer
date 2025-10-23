import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

import styles from './SearchBar.module.css';

const translations = {
  en,
  de,
};

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const sanitizeInput = (input) => {
    // Remove special characters, keeping only letters, numbers, and spaces
    return input.replace(/[^a-zA-Z0-9\s]/g, '');
  };

  const handleChange = (event) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    setSearchTerm(sanitizedValue);
    onSearch(sanitizedValue);
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        placeholder={t.search_terpenes}
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SearchBar;