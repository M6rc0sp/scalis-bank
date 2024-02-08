import React from 'react';
import ThemeToggle from './theme-toggle';

const Header: React.FC = () => {
	return (
		<header className="w-full p-4 flex justify-between items-center" style={{ backgroundColor: 'var(--header-background)' }}>
			<h1 className="text-3xl font-bold">XYZ Bank</h1>
			<ThemeToggle />
		</header>
	);
}

export default Header;