import { render, fireEvent, screen } from '@testing-library/react';
import TransactionModal from '@/components/transaction-modal';

describe('TransactionModal', () => {
  const mockHandleAmountChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    render(
      <TransactionModal
        title="Deposit"
        transactionType="Deposit"
        inputValue="100"
        handleAmountChange={mockHandleAmountChange}
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        open={true}
      />
    );
  });

  test('renders with correct initial values', () => {
    expect(screen.getByTestId('transaction-modal-deposit')).toBeInTheDocument();
    expect(screen.getByTestId('input-deposit-withdraw')).toHaveValue('100');
  });

  test('calls handleAmountChange when input value changes', () => {
    fireEvent.change(screen.getByTestId('input-deposit-withdraw'), { target: { value: '200' } });
    expect(mockHandleAmountChange).toHaveBeenCalled();
  });

  test('calls handleSubmit when form is submitted', () => {
    fireEvent.submit(screen.getByTestId('transaction-modal-deposit'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('calls handleClose when close button is clicked', () => {
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});