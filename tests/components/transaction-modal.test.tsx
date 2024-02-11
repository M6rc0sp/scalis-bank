import { render, fireEvent, screen } from '@testing-library/react';
import TransactionModal from '@/components/transaction-modal';

describe('TransactionModal', () => {
  const mockHandleAmountChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleClose = jest.fn();
  const transactionType = 'Deposit';

  beforeEach(() => {
    render(
      <TransactionModal
        title="Deposit"
        transactionType={transactionType}
        inputValue="100"
        handleAmountChange={mockHandleAmountChange}
        handleTransactionSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        open={true}
      />
    );
  });

  test('renders with correct initial values', () => {
    expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument();
    expect(screen.getByTestId('input-deposit')).toHaveValue(100);
  });

  test('calls handleAmountChange when input value changes', () => {
    fireEvent.change(screen.getByTestId('input-deposit'), { target: { value: '200' } });
    expect(mockHandleAmountChange).toHaveBeenCalled();
  });

  test('calls handleSubmit when form is submitted', async () => {
    expect(screen.getByTestId(`transaction-modal-${transactionType.toLowerCase()}`)).toBeInTheDocument();
    fireEvent.submit(screen.getByTestId('transaction-submit'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('calls handleClose when close button is clicked', () => {
    fireEvent.click(screen.getByTestId('close-modal-deposit'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});