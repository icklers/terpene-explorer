import { render, screen } from '@testing-library/react';
import TerpeneGrid from './TerpeneGrid';

test('renders terpene grid', () => {
  const terpenes = [
    { id: '1', name: 'Myrcene', aroma: 'Musky, earthy', effects: ['Sedative', 'Muscle relaxant'] },
    { id: '2', name: 'Linalool', aroma: 'Floral, lavender', effects: ['Anxiolytic', 'Sedative'] },
  ];
  render(<TerpeneGrid terpenes={terpenes} />);
  const myrceneElement = screen.getByText(/Myrcene/i);
  const linaloolElement = screen.getByText(/Linalool/i);
  expect(myrceneElement).toBeInTheDocument();
  expect(linaloolElement).toBeInTheDocument();
});
