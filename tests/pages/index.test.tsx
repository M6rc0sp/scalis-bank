import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import AccountCard from '@/components/account-card';
import Home from '@/pages/index';

describe('Home', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders user accounts with default values', async () => {
    const mockResponse = { checking_balance: 1000, savings_balance: 500 };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    await act(async () => {
      render(<Home />);
    });

    // Verificar se os títulos das contas são renderizados
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();

    // Verificar se os campos de input e botões estão presentes
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
});