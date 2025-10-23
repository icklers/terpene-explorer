import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from './ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme-display">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

test('provides theme and allows toggling', () => {
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  const themeDisplay = screen.getByTestId('theme-display');
  const toggleButton = screen.getByText('Toggle Theme');

  // Initial theme should be light (or system preference, but for test assume light)
  expect(themeDisplay).toHaveTextContent('light');

  fireEvent.click(toggleButton);
  expect(themeDisplay).toHaveTextContent('dark');

  fireEvent.click(toggleButton);
  expect(themeDisplay).toHaveTextContent('light');
});
