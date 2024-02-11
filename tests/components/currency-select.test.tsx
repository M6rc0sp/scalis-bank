import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { CurrencySelect } from '@/components/currency-select';

describe('CurrencySelect', () => {
  let setSelectedCurrency: jest.Mock;

  beforeEach(() => {
    setSelectedCurrency = jest.fn();
    render(<CurrencySelect selectedCurrency="USD" setSelectedCurrency={setSelectedCurrency} />);
  });

  test('renderiza corretamente', () => {
    expect(screen.getByTestId('select-currency')).toBeInTheDocument();
  });

  test('chama setSelectedCurrency com o valor correto quando o valor do Select é alterado', async () => {
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = await waitFor(() => screen.getByRole('listbox'));
    fireEvent.click(within(listbox).getByText('Real (BRL)'));
    expect(setSelectedCurrency).toHaveBeenCalledWith('BRL');
  });

  test('verifica se o texto do Select muda quando um novo valor é selecionado', async () => {
    expect(screen.getByTestId('select-currency').textContent).toBe('Dollar (USD)Currency');
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const listbox = await waitFor(() => screen.getByRole('listbox'));
    fireEvent.click(within(listbox).getByText('Real (BRL)'));
    expect(setSelectedCurrency).toHaveBeenCalledWith('BRL');
  });
});