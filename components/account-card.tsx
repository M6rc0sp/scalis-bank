import { Box, Button, Grid, Input, Modal, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React, { useState } from 'react';
import { AlertState } from '@/components/alert-component';

type AccountCardProps = {
	title: string;
	type: 'checking' | 'savings';
	balance: number;
	selectedCurrency: string;
	displayBalance: (balance: number) => string;
	setAlert: (alert: AlertState) => void;
	updateData: () => void;
};

const DEPOSIT = 'Deposit';
const WITHDRAW = 'Withdraw';

const AccountCard: React.FC<AccountCardProps> = ({ title, type, balance, selectedCurrency, displayBalance, setAlert, updateData }) => {
	const [modalButtonName, setModalButtonName] = useState('');
	const [withdrawOpen, setWithdrawOpen] = useState(false);
	const [depositOpen, setDepositOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [amount, setAmount] = useState(0);

	const handleDepositOpen = () => {
		setModalButtonName(DEPOSIT);
		setDepositOpen(true);
	};

	const handleWithdrawOpen = () => {
		setModalButtonName(WITHDRAW);
		setWithdrawOpen(true);
	};

	const handleDepositClose = () => {
		setAmount(0);
		setInputValue('');
		setDepositOpen(false);
	};

	const handleWithdrawClose = () => {
		setAmount(0);
		setInputValue('');
		setWithdrawOpen(false);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		const numberValue = Number(value);
		if (!isNaN(numberValue)) {
			setAmount(numberValue);
		}
	};

	const handleDeposit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (amount === 0) {
			setAlert({ type: 'warning', message: 'Por favor, insira um valor antes de transferir.' });
			handleDepositClose();
			return;
		} else if (amount < 0) {
			setAlert({ type: 'warning', message: 'Por favor, insira um valor positivo.' });
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
					setAlert({ type: 'success', message: 'Depósito realizada com sucesso!' });
				} else {
					setAlert({ type: 'error', message: data.message });
				}
				handleDepositClose();
				updateData();
			})
			.catch(error => {
				console.error('Erro ao realizar a transferência:', error);
				setAlert({ type: 'error', message: 'Erro ao realizar a transferência.' });
				handleDepositClose();
			});
	};

	const handleWithdraw = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (amount === 0) {
			setAlert({ type: 'warning', message: 'Por favor, insira um valor antes de sacar.' });
			handleWithdrawClose();
			return;
		} else if (amount < 0) {
			setAlert({ type: 'warning', message: 'Por favor, insira um valor positivo.' });
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
					setAlert({ type: 'success', message: 'Saque realizado com sucesso!' });
				} else {
					setAlert({ type: 'error', message: data.message });
				}
				handleWithdrawClose();
				updateData();
			})
			.catch(error => {
				console.error('Erro ao realizar o saque:', error);
				setAlert({ type: 'error', message: 'Erro ao realizar o saque.' });
				handleWithdrawClose();
			});
	};

	const modalBody = (
		<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'var(--account-card-background)', boxShadow: 24, p: 4 }}>
			<form onSubmit={modalButtonName === DEPOSIT ? handleDeposit : handleWithdraw}>
				<Typography variant="h5" component="h3" gutterBottom>
					{title}
				</Typography>
				<Input
					type="number"
					value={inputValue}
					onChange={handleAmountChange}
					sx={{ flexGrow: 1, height: '40px' }}
				/>
				<Button className='button-color' type="submit" variant="contained" color="primary">
					{modalButtonName}
				</Button>
			</form>
		</Box>
	);

	return (
		<Box sx={{ p: 4, boxShadow: 3, borderRadius: 1, display: 'flex', flexDirection: 'column', bgcolor: 'var(--account-card-background)' }}>
			<Typography variant="h5" component="h3" gutterBottom>
				{title}
			</Typography>
			<Typography>
				Balance: {selectedCurrency === 'USD' ? '$' : 'R$'} {displayBalance(balance)}
			</Typography>
			<Grid container spacing={2}>
				<Grid item>
					<Button className='transfer-button'
						variant="contained"
						color="primary"
						startIcon={<ArrowUpwardIcon />}
						onClick={handleDepositOpen}
					>
						{DEPOSIT}
					</Button>
				</Grid>
				<Grid item>
					<Button className='transfer-button'
						variant="contained"
						color="secondary"
						startIcon={<ArrowDownwardIcon />}
						onClick={handleWithdrawOpen}
					>
						{WITHDRAW}
					</Button>
				</Grid>
			</Grid>
			<Modal
				open={depositOpen}
				onClose={handleDepositClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				{modalBody}
			</Modal>
			<Modal
				open={withdrawOpen}
				onClose={handleWithdrawClose}
				aria-labelledby="withdraw-modal-title"
				aria-describedby="withdraw-modal-description"
			>
				{modalBody}
			</Modal>
		</Box>
	);
};

export default AccountCard;