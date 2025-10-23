import React from 'react';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainPage from './pages/MainPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Layout>
          <MainPage />
        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
