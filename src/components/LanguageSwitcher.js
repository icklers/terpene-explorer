import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

import styles from './LanguageSwitcher.module.css';

function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className={`${styles.languageSwitcher} ${language === 'dark' ? styles.dark : ''}`}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}

export default LanguageSwitcher;