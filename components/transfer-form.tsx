import { Box, Select, MenuItem, Input, Button } from '@mui/material';

interface TransferFormProps {
  transferDirection: string;
  setTransferDirection: (value: string) => void;
  inputValue: string;
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTransfer: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({ transferDirection, setTransferDirection, inputValue, handleAmountChange, handleTransfer }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
      <Select
        value={transferDirection}
        onChange={(e) => setTransferDirection(e.target.value)}
        sx={{ height: '40px', width: { xs: '100%', sm: 'auto' } }}
        inputProps={{ 'data-testid': "select-transfer-direction" }}
      >
        <MenuItem value="toSavings">Checking to Savings</MenuItem>
        <MenuItem value="toChecking">Savings to Checking</MenuItem>
      </Select>
      <Input
        type="number"
        value={inputValue}
        onChange={handleAmountChange}
        placeholder='Insert the amount in USD'
        sx={{ flexGrow: 1, height: '40px', width: { xs: '100%', sm: 'auto' } }}
      />
      <Button className='transfer-button'
        variant="contained"
        onClick={handleTransfer}
        sx={{ flexGrow: 1, height: '40px', width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '0.75rem', sm: '1rem' } }}
      >
        Transfer
      </Button>
    </Box>
  );
};

export default TransferForm;