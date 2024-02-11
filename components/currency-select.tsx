import { Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';

interface CurrencySelectProps {
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ selectedCurrency, setSelectedCurrency }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          labelId="currency-label"
          sx={{ flexGrow: 1, height: '40px', width: { xs: '100%', sm: 'auto' } }}
          input={<OutlinedInput label="Currency" />}
          data-testid="select-currency"
        >
          <MenuItem
            data-testid="currency-usd"
            value="USD">Dollar (USD)
          </MenuItem>
          <MenuItem
            data-testid="currency-brl"
            value="BRL">Real (BRL)
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};