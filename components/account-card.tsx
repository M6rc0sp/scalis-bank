import { Box, Button, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React, { useCallback, useState } from 'react';
import TransactionModal from './transaction-modal';
import { toast } from 'react-toastify';

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

	const handleClose = (transactionType: TransactionType | null) => {
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

	const handleTransactionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (transactionType) {
			handleTransaction(event, transactionType);
		}
	};

	const handleTransaction = (event: React.FormEvent<HTMLFormElement>, transactionType: TransactionType) => {
		event.preventDefault();
		if (amount === 0) {
			toast.warn(`Please enter a value before ${transactionType.toLowerCase()}ing.`);
			handleClose(transactionType);
			return;
		} else if (amount < 0) {
			toast.warn('Please enter a positive value.');
			handleClose(transactionType);
			return;
		}

		const apiEndpoint = transactionType === 'Deposit' ? '/api/deposit' : '/api/withdraw';
		const successMessage = `${transactionType} successful!`;

		fetch(apiEndpoint, {
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
					toast.success(successMessage);
				} else {
					toast.error(data.message);
				}
				handleClose(transactionType);
				updateData();
			})
			.catch(error => {
				console.error(`Error ${transactionType.toLowerCase()}ing:`, error);
				toast.error(`Error ${transactionType.toLowerCase()}ing.`);
				handleClose(transactionType);
			});
	};

	return (
		<Box sx={{ p: 4, boxShadow: 3, borderRadius: 1, display: 'flex', flexDirection: 'column', bgcolor: 'var(--account-card-background)' }}>
			<Typography variant="h5" component="h3" gutterBottom data-testid="account-title">
				{title}
			</Typography>
			<Typography data-testid={`${type}-account-balance`}>
				Balance: {selectedCurrency === 'USD' ? '$' : 'R$'} {displayBalance(balance)}
			</Typography>
			<Grid container spacing={2}>
				<Grid item>
					<Button
						className="transfer-button"
						variant="contained"
						color="success"
						data-testid="deposit-button"
						startIcon={<ArrowUpwardIcon />}
						onClick={() => handleOpenModal("Deposit")}
						sx={{ flexGrow: 1, height: '40px', width: { xs: '100%', sm: 'auto' } }}
					>
						{DEPOSIT}
					</Button>
				</Grid>
				<Grid item>
					<Button
						className="transfer-button"
						variant="contained"
						color="error"
						data-testid="withdraw-button"
						startIcon={<ArrowDownwardIcon />}
						onClick={() => handleOpenModal("Withdraw")}
						sx={{ flexGrow: 1, height: '40px', width: { xs: '100%', sm: 'auto' } }}
					>
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
					handleTransactionSubmit={handleTransactionSubmit}
					handleClose={() => handleClose('Deposit')}
					open={transactionType === 'Deposit'}
				/>
			</Grid>
			<Grid item>
				<TransactionModal
					title={title}
					transactionType="Withdraw"
					inputValue={inputValue}
					handleAmountChange={handleAmountChange}
					handleTransactionSubmit={handleTransactionSubmit}
					handleClose={() => handleClose('Withdraw')}
					open={transactionType === 'Withdraw'}
				/>
			</Grid>
		</Box>
	);
};

export default AccountCard;