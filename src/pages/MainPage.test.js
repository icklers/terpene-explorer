import { render, screen, fireEvent } from '@testing-library/react';
import MainPage from './MainPage';
import { loadTerpenes } from '../services/dataService';

jest.mock('../services/dataService');
jest.mock('../components/SunburstChart', () => {
  return function DummySunburstChart(props) {
    return <svg role="img" data-testid="sunburst-chart" />;
  };
});
jest.mock('../components/TableView', () => {
  return function DummyTableView(props) {
    return <table role="table" data-testid="table-view" />;
  };
});

const mockTerpenes = [
  { id: '1', name: 'Myrcene', aroma: 'Musky, earthy', effects: ['Sedative', 'Muscle relaxant'] },
  { id: '2', name: 'Linalool', aroma: 'Floral, lavender', effects: ['Anxiolytic', 'Sedative'] },
  { id: '3', name: 'Limonene', aroma: 'Citrus', effects: ['Anti-stress', 'Mood-enhancing'] },
];

test('filters terpenes by effect', async () => {
  loadTerpenes.mockResolvedValue(mockTerpenes);
  render(<MainPage />);

  // Wait for the terpenes to be loaded and displayed
  expect(await screen.findByText('Myrcene')).toBeInTheDocument();

  // Filter by effect
  const selectElement = screen.getByRole('combobox');
  fireEvent.change(selectElement, { target: { value: 'Anxiolytic' } });

  // Check that only the correct terpene is displayed
  expect(screen.getByText('Linalool')).toBeInTheDocument();
  expect(screen.queryByText('Myrcene')).not.toBeInTheDocument();
  expect(screen.queryByText('Limonene')).not.toBeInTheDocument();
});

test('searches terpenes by name, aroma, and effects', async () => {
  loadTerpenes.mockResolvedValue(mockTerpenes);
  render(<MainPage />);

  // Wait for the terpenes to be loaded and displayed
  expect(await screen.findByText('Myrcene')).toBeInTheDocument();

  // Search by name
  const searchInput = screen.getByPlaceholderText('Search terpenes...');
  fireEvent.change(searchInput, { target: { value: 'myrcene' } });
  expect(screen.getByText('Myrcene')).toBeInTheDocument();
  expect(screen.queryByText('Linalool')).not.toBeInTheDocument();

  // Clear search and search by aroma
  fireEvent.change(searchInput, { target: { value: 'lavender' } });
  expect(screen.getByText('Linalool')).toBeInTheDocument();
  expect(screen.queryByText('Myrcene')).not.toBeInTheDocument();

  // Clear search and search by effect
  fireEvent.change(searchInput, { target: { value: 'mood-enhancing' } });
  expect(screen.getByText('Limonene')).toBeInTheDocument();
  expect(screen.queryByText('Myrcene')).not.toBeInTheDocument();
});

test('switches between views', async () => {
  loadTerpenes.mockResolvedValue(mockTerpenes);
  render(<MainPage />);

  // Wait for the terpenes to be loaded and displayed
  expect(await screen.findByText('Myrcene')).toBeInTheDocument();

  // Switch to Sunburst view
  fireEvent.click(screen.getByText('Sunburst'));
  expect(screen.getByTestId('sunburst-chart')).toBeInTheDocument();

  // Switch to Table view
  fireEvent.click(screen.getByText('Table'));
  expect(screen.getByTestId('table-view')).toBeInTheDocument();

  // Switch back to Grid view
  fireEvent.click(screen.getByText('Grid'));
  expect(screen.getByText('Myrcene')).toBeInTheDocument();
});
