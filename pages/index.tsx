import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Header from '../components/header';
import AccountCard from '../components/account-card';

export default function Home() {

  type AlertType = 'error' | 'success' | 'warning' | 'info';

  interface AlertState {
    type: AlertType;
    message: string;
  }

  const [alert, setAlert] = useState<AlertState>({ type: 'success', message: '' });
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [checkingBalance, setCheckingBalance] = useState<number>(0);
  const [savingsBalance, setSavingsBalance] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');

  const [amount, setAmount] = useState(0);
  const [transferDirection, setTransferDirection] = useState('toSavings');

  useEffect(() => {
    if (selectedCurrency === 'BRL') {
      setExchangeRate(5);
    } else {
      setExchangeRate(1);
    }

    fetch('/api/balance?id=1')
      .then(response => response.json())
      .then(data => {
        setCheckingBalance(data.checking_balance);
        setSavingsBalance(data.savings_balance);
      })
      .catch(error => console.error('Erro ao buscar os saldos:', error));

  }, [selectedCurrency]);

  const displayBalance = (balance: number) => {
    if (selectedCurrency === 'BRL') {
      return (balance * exchangeRate).toFixed(2);
    }
    return balance.toFixed(2);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      setAmount(numberValue);
    }
  };

  const handleTransfer = () => {
    if (amount === 0) {
      setAlert({ type: 'warning', message: 'Por favor, insira um valor antes de transferir.' });
      return;
    }
    // Call API to perform transfer
    fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 1,
        from: transferDirection === 'toSavings' ? 'checking' : 'savings',
        to: transferDirection === 'toSavings' ? 'savings' : 'checking',
        amount: amount,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setAlert({ type: 'success', message: 'Transferência realizada com sucesso!' });
          setCheckingBalance(data.newCheckingBalance);
          setSavingsBalance(data.newSavingsBalance);
        } else {
          setAlert({ type: 'error', message: data.message });
        }
      })
      .catch(error => {
        console.error('Erro ao realizar a transferência:', error);
        setAlert({ type: 'error', message: 'Erro ao realizar a transferência.' });
      });
  }

  return (
    <div className="flex flex-col items-center min-h-screen" style={{ background: 'var(--background)' }}>
      <Header />
      <main className="w-full max-w-4xl p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground-rgb)' }}>User Accounts</h2>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AccountCard
            title="Checking Account"
            balance={checkingBalance}
            selectedCurrency={selectedCurrency}
            displayBalance={displayBalance}
          />
          <AccountCard
            title="Savings Account"
            balance={savingsBalance}
            selectedCurrency={selectedCurrency}
            displayBalance={displayBalance}
          />
        </section>
        <section className="mt-4">
          <select className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onChange={(e) => setSelectedCurrency(e.target.value)}>
            <option value="USD">Dollar (USD)</option>
            <option value="BRL">Real (BRL)</option>
          </select>
        </section>
        <section className="mt-4 flex items-center space-x-4">
          <select
            className="border-2 text-black border-gray-300 p-2 flex-grow"
            value={transferDirection}
            onChange={(e) => setTransferDirection(e.target.value)}
          >
            <option value="toSavings">Checking to Savings</option>
            <option value="toChecking">Savings to Checking</option>
          </select>
          <input
            className="border-2 text-black border-gray-300 p-2 flex-grow"
            type="number"
            value={inputValue}
            onChange={handleAmountChange}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded flex-grow"
            onClick={handleTransfer}
          >
            Transfer
          </button>
        </section>
      </main>
      {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>}
    </div>
  );
};