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

        if (amount <= 0) {
            res.status(400).json({ success: false, message: `O valor da transferência deve ser maior que zero` });
            return;
        }

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

            const newFromBalance = +(row[fromBalanceKey] - amount).toFixed(2);
            const newToBalance = +(row[toBalanceKey] + amount).toFixed(2);

            db.run(`UPDATE accounts SET ${fromBalanceKey} = ?, ${toBalanceKey} = ? WHERE id = ?`, [newFromBalance, newToBalance, accountId], (err: Error | null) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                res.json({
                    success: true,
                    newCheckingBalance: from === 'checking' ? newFromBalance : newToBalance,
                    newSavingsBalance: from === 'savings' ? newFromBalance : newToBalance
                });
            });
        });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};