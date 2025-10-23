import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, LanguageContext } from './LanguageContext';

const TestComponent = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  return (
    <div>
      <span data-testid="language-display">{language}</span>
      <button onClick={() => setLanguage('de')}>Switch to German</button>
    </div>
  );
};

test('provides language and allows switching', () => {
  render(
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  );

  const languageDisplay = screen.getByTestId('language-display');
  const switchButton = screen.getByText('Switch to German');

  // Initial language should be en
  expect(languageDisplay).toHaveTextContent('en');

  fireEvent.click(switchButton);
  expect(languageDisplay).toHaveTextContent('de');
});
