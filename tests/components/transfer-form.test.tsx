import { render, fireEvent, screen } from '@testing-library/react';
import { TransferForm } from '@/components/transfer-form';

describe('TransferForm', () => {
  it('calls the appropriate handlers when the form controls are interacted with', () => {
    const setTransferDirection = jest.fn();
    const handleAmountChange = jest.fn();
    const handleTransfer = jest.fn();

    render(
      <TransferForm
        transferDirection="toSavings"
        setTransferDirection={setTransferDirection}
        inputValue="100"
        handleAmountChange={handleAmountChange}
        handleTransfer={handleTransfer}
      />
    );

    // Verifique se o valor inicial do Select é 'toSavings'
    expect(screen.getByTestId('select-transfer-direction')).toHaveValue('toSavings');

    // Verifique se o valor inicial do Input é '100'
    expect(screen.getByPlaceholderText('Insert the amount in USD')).toHaveValue(100);

    // Simule a mudança de valor do Select
    fireEvent.change(screen.getByTestId('select-transfer-direction'), { target: { value: 'toChecking' } });
    expect(setTransferDirection).toHaveBeenCalledWith('toChecking');

    // Simule a mudança de valor do Input
    fireEvent.change(screen.getByPlaceholderText('Insert the amount in USD'), { target: { value: '200' } });
    expect(handleAmountChange).toHaveBeenCalled();

    // Simule o clique no botão
    fireEvent.click(screen.getByRole('button', { name: /transfer/i }));
    expect(handleTransfer).toHaveBeenCalled();
  });
});