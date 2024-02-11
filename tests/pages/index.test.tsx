import { render, fireEvent, screen, waitFor, act, within } from '@testing-library/react';
import { ToastContainer } from "react-toastify";
import React from 'react';
import AccountCard from '@/components/account-card';
import Home from '@/pages/index';

const renderWithToastify = (component: React.ReactNode) => {
  return (
    render(
      <div>
        <ToastContainer />
        {component}
      </div>
    )
  );
};

describe('Home', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
    },
  }));

  test('renders user accounts with default values', async () => {
    const mockResponse = { checking_balance: 1000, savings_balance: 500 };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText('Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/insert the amount in usd/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument();
  });

  test('test if the buttons from cards is here', async () => {
    const updateData = jest.fn();

    render(
      <AccountCard
        title="Checking"
        type="checking"
        balance={100}
        selectedCurrency="USD"
        displayBalance={(balance) => balance.toFixed(2)}
        updateData={updateData}
      />
    );

    await act(async () => {
      expect(screen.getByTestId("deposit-button")).toBeInTheDocument();
      expect(screen.getByTestId("withdraw-button")).toBeInTheDocument();
    });
  });

  test('updates the exchange rate correctly when the selected currency is changed', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ checking_balance: 1000, savings_balance: 500 }));

    render(<Home />);

    const combobox = await screen.findByRole('combobox', { name: /currency/i });

    fireEvent.mouseDown(combobox);
    const listbox = await waitFor(() => screen.getByRole('listbox'));
    fireEvent.click(within(listbox).getByText('Real (BRL)'));

    await waitFor(() => {
      expect(screen.getByTestId('checking-account-balance')).toHaveTextContent('R$ 5000.00');
    });
  });

  test('updates the input value and amount state correctly when the input value changes', async () => {
    render(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '200' } });

    expect(input.value).toBe('200');
  });

  test('makes a POST request to /api/transfer when the transfer button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ checking_balance: 1000, savings_balance: 500 }));
    const mockResponse = { success: true, newCheckingBalance: 800, newSavingsBalance: 700 };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    renderWithToastify(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });

    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        from: 'checking',
        to: 'savings',
        amount: 200,
      }),
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const saldoElement = await screen.findByTestId('checking-account-balance');
    expect(await screen.findByText('Transfer successful!')).toBeInTheDocument();
  });

  test('displays a warning when the transfer amount is 0', async () => {
    renderWithToastify(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(button);

    expect(await screen.findByText('Please enter a value before transferring.')).toBeInTheDocument();
  });

  test('displays a warning when the transfer amount is negative', async () => {
    renderWithToastify(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });

    fireEvent.change(input, { target: { value: '-200' } });
    fireEvent.click(button);

    expect(await screen.findByText('Please enter a positive value.')).toBeInTheDocument();
  });

  test('displays an error when the API call fails', async () => {
    fetchMock.mockRejectOnce(new Error('API error'));

    renderWithToastify(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });

    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.click(button);

    expect(await screen.findByText('Error performing transfer.')).toBeInTheDocument();
  });

  test('exibe um erro quando a chamada de API falha', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ checking_balance: 1000, savings_balance: 500 }));
    const mockResponse = { success: false, message: 'Insufficient balance in the checking account' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    renderWithToastify(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });

    fireEvent.change(input, { target: { value: '1200' } });
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        from: 'checking',
        to: 'savings',
        amount: 1200,
      }),
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    // Verifique se o toast de  é exibido
    const toast = await screen.findByRole('alert');
    expect(toast).toBeInTheDocument()
  });

  test('handleTransfer makes the correct API call for both options', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    render(<Home />);

    const input = await screen.findByPlaceholderText(/insert the amount in usd/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /transfer/i });
    const select = screen.getByTestId('select-transfer-direction');

    // Testa a opção padrão (from: 'checking', to: 'savings')
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        from: 'checking',
        to: 'savings',
        amount: 200,
      }),
    });

    // Altera a direção da transferência
    fireEvent.change(select, { target: { value: 'toChecking' } });

    // Testa a outra opção (from: 'savings', to: 'checking')
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        from: 'savings',
        to: 'checking',
        amount: 200,
      }),
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));
  });
});