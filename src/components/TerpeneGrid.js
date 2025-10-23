import React from 'react';
import TerpeneCard from './TerpeneCard';

import styles from './TerpeneGrid.module.css';

function TerpeneGrid({ terpenes }) {
  return (
    <div className={styles.terpeneGrid}>
      {terpenes.map(terpene => (
        <TerpeneCard key={terpene.id} terpene={terpene} />
      ))}
    </div>
  );
}

export default TerpeneGrid;