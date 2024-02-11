import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import fetchMock from 'jest-fetch-mock';
import AccountCard from '@/components/account-card';
import React from 'react';

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

describe('AccountCard', () => {
  const mockUpdateData = jest.fn();
  let transactionType = '';

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  beforeEach(() => {
    transactionType = 'Deposit';
    renderWithToastify(
      <AccountCard
        title="Checking"
        type="checking"
        balance={100}
        selectedCurrency="USD"
        displayBalance={(balance) => balance.toFixed(2)}
        updateData={mockUpdateData}
      />
    );
  });

  test('renders with correct initial values', async () => {
    expect(screen.getByTestId('account-title')).toHaveTextContent('Checking');
    const balance = await screen.findByTestId('checking-account-balance');
    expect(balance).toHaveTextContent(/balance: \$\s*100\.00/i);
    expect(screen.getByTestId('deposit-button')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-button')).toBeInTheDocument();
  });

  test('handleAmountChange updates inputValue and amount correctly', () => {
    fireEvent.click(screen.queryAllByTestId('deposit-button')[0]);
    const oninput = screen.getByTestId(`input-${transactionType.toLowerCase()}`) as HTMLInputElement;
    fireEvent.change(oninput, { target: { value: '200' } });
    expect(oninput?.value).toBe('200');
  });

  test('handleDeposit makes a POST request to /api/deposit when form is submitted', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true, newBalance: 500 }));
    fireEvent.click(screen.getByTestId('deposit-button'));
    expect(screen.getByTestId(`transaction-modal-${transactionType.toLowerCase()}`)).toBeInTheDocument();
    const input = await screen.findByTestId(`input-${transactionType.toLowerCase()}`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /deposit/i });
      fireEvent.click(button);
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        accountType: 'checking',
        amount: 200,
      }),
    });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(mockUpdateData).toHaveBeenCalled();
  });

  test('handleWithdraw makes a POST request to /api/withdraw when form is submitted', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true, newBalance: 500 }));
    transactionType = 'Withdraw';
    fireEvent.click(screen.getByTestId('withdraw-button'));
    expect(screen.getByTestId(`transaction-modal-${transactionType.toLowerCase()}`)).toBeInTheDocument();
    const input = await screen.findByTestId(`input-${transactionType.toLowerCase()}`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '50' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /withdraw/i });
      fireEvent.click(button);
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        accountType: 'checking',
        amount: 50,
      }),
    });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(mockUpdateData).toHaveBeenCalled();
  });

  test('displays a warning when the withdraw amount is 0', async () => {
    transactionType = 'Withdraw';
    fireEvent.click(screen.getByTestId('withdraw-button'));
    expect(screen.getByTestId(`transaction-modal-${transactionType.toLowerCase()}`)).toBeInTheDocument();
    const input = await screen.findByTestId(`input-${transactionType.toLowerCase()}`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /withdraw/i });
      fireEvent.click(button);
    });
    expect(await screen.findByText('Please enter a value before withdrawing.')).toBeInTheDocument();
  });

  test('displays a warning when the withdraw amount is negative', async () => {
    transactionType = 'Withdraw';
    fireEvent.click(screen.getByTestId('withdraw-button'));
    expect(screen.getByTestId(`transaction-modal-${transactionType.toLowerCase()}`)).toBeInTheDocument();
    const input = await screen.findByTestId(`input-${transactionType.toLowerCase()}`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '-200' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /withdraw/i });
      fireEvent.click(button);
    });
    expect(await screen.findByText('Please enter a positive value.')).toBeInTheDocument();
  });

  test('displays a warning when the deposit amount is 0', async () => {
    fireEvent.click(screen.getByTestId('deposit-button'));
    expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument();
    const input = await screen.findByTestId('input-deposit') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /deposit/i });
      fireEvent.click(button);
    });
    expect(await screen.findByText('Please enter a value before depositing.')).toBeInTheDocument();
  });

  test('displays a warning when the deposit amount is negative', async () => {
    fireEvent.click(screen.getByTestId('deposit-button'));
    expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument();
    const input = await screen.findByTestId('input-deposit') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '-200' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /deposit/i });
      fireEvent.click(button);
    });
    expect(await screen.findByText('Please enter a positive value.')).toBeInTheDocument();
  });

  ['Deposit', 'Withdraw'].forEach((type) => {
    test(`opens ${type.toLowerCase()} modal when ${type.toLowerCase()} button is clicked`, async () => {
      transactionType = type;
      fireEvent.click(screen.getByTestId(`${type.toLowerCase()}-button`));
      await waitFor(() => expect(screen.getByTestId(`transaction-modal-${type.toLowerCase()}`)).toBeInTheDocument());
    });

    test(`closes ${type.toLowerCase()} modal when close button is clicked`, async () => {
      transactionType = type;
      fireEvent.click(screen.getByTestId(`${type.toLowerCase()}-button`));
      await waitFor(() => expect(screen.getByTestId(`transaction-modal-${type.toLowerCase()}`)).toBeInTheDocument());
      fireEvent.click(screen.getByTestId(`close-modal-${type.toLowerCase()}`));
      await waitFor(() => expect(screen.queryByTestId(`transaction-modal-${type.toLowerCase()}`)).not.toBeInTheDocument());
    });

    test(`displays an error when the API call fails`, async () => {
      fetchMock.mockRejectOnce(new Error('API error'));
      jest.spyOn(console, 'error').mockImplementation(() => { });
      fireEvent.click(screen.getByTestId(`${type.toLowerCase()}-button`));
      expect(screen.getByTestId(`transaction-modal-${type.toLowerCase()}`)).toBeInTheDocument();
      const input = await screen.findByTestId(`input-${type.toLowerCase()}`) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '200' } });
      await act(async () => {
        const button = screen.getByRole('button', { name: new RegExp(type, 'i') });
        fireEvent.click(button);
      });
      jest.spyOn(console, 'error').mockRestore();
      expect(await screen.findByText(`Error ${type.toLowerCase()}ing.`)).toBeInTheDocument();
    });
  });

  test('displays an error toast when the API call fails', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));
    jest.spyOn(console, 'error').mockImplementation(() => { });
    fireEvent.click(screen.getByTestId('deposit-button'));
    const input = await screen.findByTestId('input-deposit') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200' } });
    await act(async () => {
      const button = screen.getByRole('button', { name: /deposit/i });
      fireEvent.click(button);
    });
    jest.spyOn(console, 'error').mockRestore();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  test('displayBalance is called with the correct value', () => {
    const mockDisplayBalance = jest.fn();
    renderWithToastify(
      <AccountCard
        title="Checking"
        type="checking"
        balance={100}
        selectedCurrency="USD"
        displayBalance={mockDisplayBalance}
        updateData={mockUpdateData}
      />
    );
    expect(mockDisplayBalance).toHaveBeenCalledWith(100);
  });
});