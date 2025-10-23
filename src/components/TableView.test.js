import { render, screen } from '@testing-library/react';
import TableView from './TableView';

test('renders table view with terpenes', () => {
  const terpenes = [
    { id: '1', name: 'Myrcene', aroma: 'Musky, earthy', effects: ['Sedative'], sources: ['Mango'] },
    { id: '2', name: 'Linalool', aroma: 'Floral, lavender', effects: ['Anxiolytic'], sources: ['Lavender'] },
  ];
  render(<TableView terpenes={terpenes} />);

  expect(screen.getByText('Myrcene')).toBeInTheDocument();
  expect(screen.getByText('Linalool')).toBeInTheDocument();
  expect(screen.getByText('Musky, earthy')).toBeInTheDocument();
  expect(screen.getByText('Floral, lavender')).toBeInTheDocument();
  expect(screen.getByText('Sedative')).toBeInTheDocument();
  expect(screen.getByText('Anxiolytic')).toBeInTheDocument();
  expect(screen.getByText('Mango')).toBeInTheDocument();
  expect(screen.getByText('Lavender')).toBeInTheDocument();
});
