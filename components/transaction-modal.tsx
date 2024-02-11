import { Box, Button, IconButton, Input, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

type TransactionModalProps = {
  title: string;
  transactionType: string;
  inputValue: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClose: () => void;
  open: boolean;
};

const TransactionModal: React.FC<TransactionModalProps> = ({ title, transactionType, inputValue, handleAmountChange, handleSubmit, handleClose, open }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="withdraw-modal-title"
      aria-describedby="withdraw-modal-description"
      data-testid={`transaction-modal-${transactionType.toLowerCase()}`}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--account-card-background)', boxShadow: 24, p: 4, borderRadius: 1 }}>
        <form onSubmit={handleSubmit}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            data-testid="close-button"
            color='error'
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" component="h3" gutterBottom>
            {title}
          </Typography>
          <Input
            type="number"
            value={inputValue}
            onChange={handleAmountChange}
            inputProps={{ 'data-testid': "input-deposit-withdraw" }}
            placeholder='Insert the amount in USD'
            sx={{ flexGrow: 1, height: '40px' }}
          />
          <Button className='button-color' type="submit" variant="contained" color="primary">
            {transactionType}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TransactionModal;