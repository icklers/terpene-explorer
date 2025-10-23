import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders search bar and handles input', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  
  const inputElement = screen.getByPlaceholderText('Search terpenes...');
  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: 'myrcene' } });
  expect(onSearch).toHaveBeenCalledWith('myrcene');
});
