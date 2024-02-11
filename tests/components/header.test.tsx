import { render, screen } from '@testing-library/react';
import Header from '@/components/header';

describe('Header', () => {
  it('renders the header with the bank name and theme toggle', () => {
    render(<Header />);

    // Verifique se o nome do banco está sendo renderizado
    expect(screen.getByText('XYZ Bank')).toBeInTheDocument();

    // Verifique se o ThemeToggle está sendo renderizado
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});