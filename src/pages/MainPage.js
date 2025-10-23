import React, { useState, useEffect, useContext } from 'react';
import { loadTerpenes } from '../services/dataService';
import TerpeneGrid from '../components/TerpeneGrid';
import EffectFilter from '../components/EffectFilter';
import ViewSwitcher from '../components/ViewSwitcher';
import SearchBar from '../components/SearchBar';
import SunburstChart from '../components/SunburstChart';
import TableView from '../components/TableView';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import NoResults from '../components/NoResults';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../locales/en.json';
import de from '../locales/de.json';

const translations = {
  en,
  de,
};

function MainPage() {
  const [terpenes, setTerpenes] = useState([]);
  const [filteredTerpenes, setFilteredTerpenes] = useState([]);
  const [selectedEffect, setSelectedEffect] = useState('');
  const [allEffects, setAllEffects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('Grid'); // Default view
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    console.log('MainPage: Initial data loading effect running');
    async function getTerpenes() {
      setIsLoading(true);
      const { data, error } = await loadTerpenes();
      if (error) {
        setError(error);
        console.error('MainPage: Error loading terpenes:', error);
      } else {
        setTerpenes(data);
        setFilteredTerpenes(data);
        console.log('MainPage: Loaded terpenes:', data);

        const effects = [...new Set(data.flatMap(t => t.effects))];
        setAllEffects(effects);
      }
      setIsLoading(false);
    }
    getTerpenes();
  }, []);

  useEffect(() => {
    console.log('MainPage: Filtering effect running');
    console.log('MainPage: Current terpenes (unfiltered):', terpenes);
    console.log('MainPage: Selected effect:', selectedEffect);
    console.log('MainPage: Search term:', searchTerm);

    let newFilteredTerpenes = terpenes;

    if (selectedEffect) {
      newFilteredTerpenes = newFilteredTerpenes.filter(terpene => terpene.effects.includes(selectedEffect));
    }

    if (searchTerm) {
      newFilteredTerpenes = newFilteredTerpenes.filter(
        terpene =>
          terpene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          terpene.aroma.toLowerCase().includes(searchTerm.toLowerCase()) ||
          terpene.effects.some(effect => effect.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    console.log('MainPage: New filtered terpenes:', newFilteredTerpenes);
    setFilteredTerpenes(newFilteredTerpenes);
  }, [selectedEffect, searchTerm, terpenes]);

  const handleSliceClick = (data) => {
    console.log('MainPage: handleSliceClick received data:', data);
    // Assuming data from sunburst slice has an effect or name to filter by
    if (data.effects && data.effects.length > 0) {
      setSelectedEffect(data.effects[0]); // Filter by the first effect in the slice
    } else if (data.name) {
      setSearchTerm(data.name); // Search by the name if it's a terpene slice
    }
  };

  const renderView = (t) => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (filteredTerpenes.length === 0) {
      console.log('MainPage: Displaying NoResults. filteredTerpenes is empty.');
      return <NoResults />;
    }
    switch (currentView) {
      case 'Grid':
        return <TerpeneGrid terpenes={filteredTerpenes} />;
      case 'Sunburst':
        return <SunburstChart data={filteredTerpenes} onSliceClick={handleSliceClick} />;
      case 'Table':
        return <TableView terpenes={filteredTerpenes} />;
      default:
        return <TerpeneGrid terpenes={filteredTerpenes} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <EffectFilter effects={allEffects} onFilterChange={setSelectedEffect} />
        <SearchBar onSearch={setSearchTerm} />
        <ViewSwitcher views={['Grid', 'Sunburst', 'Table']} onViewChange={setCurrentView} />
      </div>
      {renderView(t)}
    </div>
  );
}

export default MainPage;
