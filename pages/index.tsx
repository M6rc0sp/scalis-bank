import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import Header from '@/components/header';
import AccountCard from '@/components/account-card';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CurrencySelect } from '@/components/currency-select';
import { TransferForm } from '@/components/transfer-form';
import Head from 'next/head';

export default function Home() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [checkingBalance, setCheckingBalance] = useState<number>(0);
  const [savingsBalance, setSavingsBalance] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');

  const [amount, setAmount] = useState(0);
  const [transferDirection, setTransferDirection] = useState('toSavings');

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    if (selectedCurrency === 'BRL') {
      setExchangeRate(5);
    } else {
      setExchangeRate(1);
    }
  }, [selectedCurrency]);

  const updateData = () => {
    fetch('/api/balance?id=1')
      .then(response => response.json())
      .then(data => {
        setCheckingBalance(data.checking_balance);
        setSavingsBalance(data.savings_balance);
      })
      .catch(error => {
        toast.error('Error performing transfer.')
      });
  }

  const displayBalance = (balance: number) => {
    if (selectedCurrency === 'BRL') {
      return (balance * exchangeRate).toFixed(2);
    }
    return balance ? balance.toFixed(2) : '0.00';
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
      toast.warn('Please enter a value before transferring.');
      return;
    } else if (amount < 0) {
      toast.warn('Please enter a positive value.');
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
          toast.success('Transfer successful!');
          updateData();
        } else {
          toast.error(data.message);
        }
      })
      .catch(error => {
        toast.error('Error performing transfer.');
      });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <Head>
        <title>XYZ Bank</title>
      </Head>
      <Header />
      <Card sx={{ width: '100%', maxWidth: '960px', mx: 'auto', mt: '15px' }} elevation={0}>
        <CardContent className='card'>
          <Typography variant="h4" component="h2" gutterBottom>User Accounts</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AccountCard
                title="Checking Account"
                type="checking"
                balance={checkingBalance}
                selectedCurrency={selectedCurrency}
                displayBalance={displayBalance}
                updateData={updateData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AccountCard
                title="Savings Account"
                type="savings"
                balance={savingsBalance}
                selectedCurrency={selectedCurrency}
                displayBalance={displayBalance}
                updateData={updateData}
              />
            </Grid>
          </Grid>
          <CurrencySelect
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
          <TransferForm
            transferDirection={transferDirection}
            setTransferDirection={setTransferDirection}
            inputValue={inputValue}
            handleAmountChange={handleAmountChange}
            handleTransfer={handleTransfer}
          />
        </CardContent>
      </Card>
      <ToastContainer />
    </Box>
  );
};