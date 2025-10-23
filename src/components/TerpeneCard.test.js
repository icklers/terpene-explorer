import { render, screen } from '@testing-library/react';
import TerpeneCard from './TerpeneCard';

test('renders terpene card', () => {
  const terpene = {
    name: 'Myrcene',
    aroma: 'Musky, earthy',
    effects: ['Sedative', 'Muscle relaxant'],
  };
  render(<TerpeneCard terpene={terpene} />);
  const nameElement = screen.getByText(/Myrcene/i);
  expect(nameElement).toBeInTheDocument();
});
