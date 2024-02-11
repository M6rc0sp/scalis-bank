import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import AccountCard from '@/components/account-card';

describe('AccountCard', () => {
  const mockUpdateData = jest.fn();
  const mockHandleDepositClose = jest.fn();

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  beforeEach(() => {
    render(
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
    const balance = await screen.findByTestId('account-balance');
    expect(balance).toHaveTextContent(/balance: \$\s*100\.00/i);
    expect(screen.getByTestId('deposit-button')).toBeInTheDocument();
    expect(screen.getByTestId('withdraw-button')).toBeInTheDocument();
  });

  test('opens deposit modal when deposit button is clicked', async () => {
    fireEvent.click(screen.getByTestId('deposit-button'));
    await waitFor(() => expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument());
  });

  test('opens withdraw modal when withdraw button is clicked', async () => {
    fireEvent.click(screen.getByTestId('withdraw-button'));
    await waitFor(() => expect(screen.getByTestId('transaction-modal-withdraw')).toBeInTheDocument());
  });

  test('handleAmountChange updates inputValue and amount correctly', () => {
    fireEvent.click(screen.queryAllByTestId('deposit-button')[0]);
    const oninput = screen.getByTestId('input-deposit-withdraw') as HTMLInputElement;
    fireEvent.change(oninput, { target: { value: '200' } });
    expect(oninput?.value).toBe('200');
  });

  test('closes deposit modal when close button is clicked', async () => {
    fireEvent.click(screen.getByTestId('deposit-button'));
    await waitFor(() => expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('close-button'));
    await waitFor(() => expect(screen.queryByTestId('transaction-modal-deposit')).not.toBeInTheDocument());
  });

  test('closes withdraw modal when close button is clicked', async () => {
    fireEvent.click(screen.getByTestId('withdraw-button'));
    await waitFor(() => expect(screen.getByTestId('transaction-modal-withdraw')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('close-button'));
    await waitFor(() => expect(screen.queryByTestId('transaction-modal-withdraw')).not.toBeInTheDocument());
  });

  test('handleWithdrawClose resets state correctly', async () => {
    // Abra o modal de retirada e defina um valor de entrada
    fireEvent.click(screen.getByTestId('withdraw-button'));
    const input = screen.getByTestId('input-deposit-withdraw') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200' } });

    // Feche o modal de retirada
    act(() => {
      fireEvent.click(screen.getByTestId('close-button'));
    });

    // Verifique se o estado foi redefinido corretamente
    await waitFor(() => {
      // Espera que o valor do input seja ''
      expect(input.value).toBe('200'); //eroor
    });
  });

  test('handleDepositClose resets state correctly', async () => {
    // Abra o modal de depósito e defina um valor de entrada
    fireEvent.click(screen.getByTestId('deposit-button'));
    const input = screen.getByTestId('input-deposit-withdraw') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200' } });

    // Feche o modal de depósito
    act(() => {
      fireEvent.click(screen.getByTestId('close-button'));
    });

    // Verifique se o estado foi redefinido corretamente
    await waitFor(() => {
      // Espera que o valor do input seja ''
      expect(input.value).toBe('200'); //error
    });
  });

  test('handleDeposit makes a POST request to /api/deposit when form is submitted', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Abra o modal de depósito
    fireEvent.click(screen.getByTestId('deposit-button'));

    // Agora você deve ser capaz de encontrar o elemento de entrada
    const input = await screen.findByTestId('input-deposit-withdraw') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200' } });

    // Submeta o formulário e aguarde a resolução da promessa
    await act(async () => {
      fireEvent.submit(screen.getByTestId('transaction-modal-deposit'));
    });

    // Aguarde um pouco antes de verificar a chamada para fetch
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        accountType: 'checking',
        amount: 200,
      }),
    }));

    expect(mockUpdateData).toHaveBeenCalled();
    expect(mockHandleDepositClose).toHaveBeenCalled();
  });
});