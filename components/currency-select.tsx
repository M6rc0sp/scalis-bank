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
          input={<OutlinedInput label="Currency" />}
        >
          <MenuItem value="USD">Dollar (USD)</MenuItem>
          <MenuItem value="BRL">Real (BRL)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};