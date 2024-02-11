import { render, fireEvent, screen } from '@testing-library/react';
import ThemeToggle from '@/components/theme-toggle';

describe('ThemeToggle', () => {
  it('toggles the theme between light and dark when clicked', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    // Verifique se o tema inicial é 'light'
    expect(document.documentElement.className).toBe('light');

    fireEvent.click(button);

    // Verifique se o tema muda para 'dark' quando o botão é clicado
    expect(document.documentElement.className).toBe('dark');

    fireEvent.click(button);

    // Verifique se o tema muda de volta para 'light' quando o botão é clicado novamente
    expect(document.documentElement.className).toBe('light');
  });
});