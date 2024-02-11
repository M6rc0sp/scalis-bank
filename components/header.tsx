import React from 'react';
import ThemeToggle from './theme-toggle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Header: React.FC = () => {
	return (
		<header className="w-full p-4 flex justify-between items-center" style={{ backgroundColor: 'var(--header-background)' }}>
			<div className="w-16" />
			<h1 className="text-3xl font-bold flex items-center">
				<AccountBalanceIcon sx={{ fontSize: { sm: '36px', xs: '25px' }, mr: 1 }} />XYZ Bank
			</h1>
			<ThemeToggle />
		</header>
	);
}

export default Header;