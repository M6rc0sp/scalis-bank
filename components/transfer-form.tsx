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
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        value={transferDirection}
        onChange={(e) => setTransferDirection(e.target.value)}
        sx={{ flexGrow: 1, height: '40px' }}
      >
        <MenuItem value="toSavings">Checking to Savings</MenuItem>
        <MenuItem value="toChecking">Savings to Checking</MenuItem>
      </Select>
      <Input
        type="number"
        value={inputValue}
        onChange={handleAmountChange}
        sx={{ flexGrow: 1, height: '40px' }}
      />
      <Button className='transfer-button'
        variant="contained"
        onClick={handleTransfer}
        sx={{ flexGrow: 1, height: '40px' }}
      >
        Transfer
      </Button>
    </Box>
  );
};