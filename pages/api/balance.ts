import { NextApiRequest, NextApiResponse } from 'next';
const db = require('../../lib/db/db');

interface AccountRow {
    balance: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { id } = req.query;

        db.get('SELECT checking_balance, savings_balance FROM accounts WHERE id = ?', [id], (err: Error | null, row: { checking_balance: number, savings_balance: number } | null) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.json({ checking_balance: row ? row.checking_balance : 0, savings_balance: row ? row.savings_balance : 0 });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};