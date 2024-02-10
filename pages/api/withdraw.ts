import { NextApiRequest, NextApiResponse } from 'next';
const db = require('../../lib/db/db');

interface DepositBody {
  accountId: number;
  accountType: 'checking' | 'savings';
  amount: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { accountId, accountType, amount }: DepositBody = req.body;

    if (amount <= 0) {
      res.status(400).json({ success: false, message: `O valor do saque deve ser maior que zero` });
      return;
    }

    const accountMap = {
      checking: 'checking_balance',
      savings: 'savings_balance',
    };

    const balanceKey = accountMap[accountType];
    console.error(balanceKey);
    db.get('SELECT checking_balance, savings_balance FROM accounts WHERE id = ?', [accountId], (err: Error | null, row: { [key: string]: number } | null) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(400).json({ success: false, message: `Conta não encontrada` });
        return;
      }

      const newBalance = +(row[balanceKey] - amount).toFixed(2);

      db.run(`UPDATE accounts SET ${balanceKey} = ? WHERE id = ?`, [newBalance, accountId], (err: Error | null) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          success: true,
          newBalance: newBalance
        });
      });
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
};