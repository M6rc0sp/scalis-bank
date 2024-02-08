type AccountCardProps = {
	title: string;
	balance: number;
	selectedCurrency: string;
	displayBalance: (balance: number) => string;
};

const AccountCard: React.FC<AccountCardProps> = ({ title, balance, selectedCurrency, displayBalance }) => {
	return (
		<div className="p-4 shadow-md rounded flex flex-col" style={{ background: 'var(--account-card-background)' }}>
			<h3 className="text-xl text-black font-bold mb-2">{title}</h3>
			<p className='text-black'>Balance: {selectedCurrency === 'USD' ? '$' : 'R$'} {displayBalance(balance)}</p>
		</div>
	);
};

export default AccountCard;