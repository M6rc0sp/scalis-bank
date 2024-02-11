import { Box, Button, Grid, IconButton, Input, Modal, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import TransactionModal from './transaction-modal';

type AccountCardProps = {
	title: string;
	type: 'checking' | 'savings';
	balance: number;
	selectedCurrency: string;
	displayBalance: (balance: number) => string;
	updateData: () => void;
};

const DEPOSIT = 'Deposit';
const WITHDRAW = 'Withdraw';

type TransactionType = 'Deposit' | 'Withdraw';

const AccountCard: React.FC<AccountCardProps> = ({ title, type, balance, selectedCurrency, displayBalance, updateData }) => {
	const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
	const [inputValue, setInputValue] = useState('');
	const [amount, setAmount] = useState(0);

	const handleOpenModal = (type: TransactionType) => {
		setTransactionType(type);
	};

	const handleCloseModal = () => {
		setTransactionType(null);
	};

	const handleDepositClose = () => {
		setInputValue('');
		setAmount(0);
		handleCloseModal();
	};

	const handleWithdrawClose = () => {
		setInputValue('');
		setAmount(0);
		handleCloseModal();
	};

	const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		const numberValue = Number(value);
		if (!isNaN(numberValue)) {
			setAmount(numberValue);
		}
	}, []);

	const handleDeposit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (amount === 0) {
			toast.warn('Please enter a value before depositing.');
			handleDepositClose();
			return;
		} else if (amount < 0) {
			toast.warn('Please enter a positive value.');
			handleDepositClose();
			return;
		}

		fetch('/api/deposit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				accountId: 1,
				accountType: type,
				amount: amount,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					toast.success('Deposit successful!');
				} else {
					toast.error(data.message);
				}
				handleDepositClose();
				updateData();
			})
			.catch(error => {
				console.error('Error depositing:', error);
				toast.error('Error depositing.');
				handleDepositClose();
			});
	};

	const handleWithdraw = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (amount === 0) {
			toast.warn('Please enter a value before withdrawing.');
			handleWithdrawClose();
			return;
		} else if (amount < 0) {
			toast.warn('Please enter a positive value.');
			handleWithdrawClose();
			return;
		}

		fetch('/api/withdraw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				accountId: 1,
				accountType: type,
				amount: amount,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					toast.success('Withdrawal successful!');
				} else {
					toast.error(data.message);
				}
				handleWithdrawClose();
				updateData();
			})
			.catch(error => {
				console.error('Error withdrawing:', error);
				toast.error('Error withdrawing.');
				handleWithdrawClose();
			});
	};

	const handleTransactionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (transactionType === 'Deposit') {
			handleDeposit(event);
		} else if (transactionType === 'Withdraw') {
			handleWithdraw(event);
		}
	};

	return (
		<Box sx={{ p: 4, boxShadow: 3, borderRadius: 1, display: 'flex', flexDirection: 'column', bgcolor: 'var(--account-card-background)' }}>
			<Typography variant="h5" component="h3" gutterBottom data-testid="account-title">
				{title}
			</Typography>
			<Typography data-testid="account-balance">
				Balance: {selectedCurrency === 'USD' ? '$' : 'R$'} {displayBalance(balance)}
			</Typography>
			<Grid container spacing={2}>
				<Grid item>
					<Button className='transfer-button' variant="contained" color="success" data-testid="deposit-button" startIcon={<ArrowUpwardIcon />} onClick={() => handleOpenModal('Deposit')}>
						{DEPOSIT}
					</Button>
				</Grid>
				<Grid item>
					<Button className='transfer-button' variant="contained" color="error" data-testid="withdraw-button" startIcon={<ArrowDownwardIcon />} onClick={() => handleOpenModal('Withdraw')}>
						{WITHDRAW}
					</Button>
				</Grid>
			</Grid>
			<Grid item>
				<TransactionModal
					title={title}
					transactionType="Deposit"
					inputValue={inputValue}
					handleAmountChange={handleAmountChange}
					handleSubmit={handleTransactionSubmit}
					handleClose={handleCloseModal}
					open={transactionType === 'Deposit'}
				/>
			</Grid>
			<Grid item>
				<TransactionModal
					title={title}
					transactionType="Withdraw"
					inputValue={inputValue}
					handleAmountChange={handleAmountChange}
					handleSubmit={handleTransactionSubmit}
					handleClose={handleCloseModal}
					open={transactionType === 'Withdraw'}
				/>
			</Grid>
		</Box>
	);
};

export default AccountCard;