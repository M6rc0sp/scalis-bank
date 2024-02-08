import { NextApiRequest, NextApiResponse } from 'next';
const db = require('../../lib/db/db');

interface TransferBody {
    accountId: number;
    from: 'checking' | 'savings';
    to: 'checking' | 'savings';
    amount: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { accountId, from, to, amount }: TransferBody = req.body;

        const accountMap = {
            checking: 'checking_balance',
            savings: 'savings_balance',
        };

        const fromBalanceKey = accountMap[from];
        const toBalanceKey = accountMap[to];

        db.get('SELECT checking_balance, savings_balance FROM accounts WHERE id = ?', [accountId], (err: Error | null, row: { [key: string]: number } | null) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (!row || row[fromBalanceKey] < amount) {
                res.status(400).json({ success: false, message: `Saldo insuficiente na conta ${from}` });
                return;
            }

            const newFromBalance = row[fromBalanceKey] - amount;
            const newToBalance = row[toBalanceKey] + amount;

            db.run('UPDATE accounts SET checking_balance = ?, savings_balance = ? WHERE id = ?', [newFromBalance, newToBalance, accountId], (err: Error | null) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                res.json({ success: true, newCheckingBalance: newFromBalance, newSavingsBalance: newToBalance });
            });
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};