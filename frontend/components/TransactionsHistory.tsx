

// components/TransactionsHistory.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionProps {
  txnId: string;
  type: string;
  source: string;
  destination: string;
  amount: string;
  fee: string;
  date: string;
  status: string;
}

interface TransactionsHistoryProps {
  transactions?: TransactionProps[];
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = () => {

  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  // Assuming you've added the interface TransactionProps as defined in the previous messages

  useEffect(() => {
    console.log(user?.walletAddress as string)
    console.log(user?.phoneNumber)

    const fetchData = async () => {
      try {

        if (!user?.walletAddress) {
          throw new Error("Wallet address not available");
        }

        const response = await fetch(`http://localhost:8000/account_tx/${user.walletAddress}`);
        const data = await response.json();
        console.log(data)
        // if (data.status === 'success') {
        //   setTransactions(data.data.result.transactions || []);
        //   console.log(transactions)
        // }
        if (data.status === 'success' && data.data && data.data.result) {
          setTransactions(data.data.result.transactions || []);
          // console.log(transactions);
        }

      } catch (error) {
        console.error("Failed fetching transaction data", error);
      }
    };

    if (user?.walletAddress) {
      fetchData();
    }
  }, [user?.walletAddress]);

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  // const safeParse = (value: any, defaultValue = 0): number => {
  //   console.log('Raw tx.amount:', value);

  //   const parsed = Number(value);

  //   console.log('parsed tx.amount:', parsed);

  //   return isNaN(parsed) ? defaultValue : parsed;
  // }

  const safeParse = (str: any, factor: number = 1) => {
        console.log('Raw tx.amount:', str);

    const num = parseFloat(str);

        console.log('parsed tx.amount:', num);

    return isNaN(num) ? 0 : num * factor;
  };

  return (
    <div className="mt-12">
      <h1 className="text-2xl font-bold mb-6">Recent Transactions</h1>
      <ul>
        {transactions.length > 0 ? transactions.map((tx, index) => (
          // <li key={tx.txnId} className="border-t border-gray-600 py-4 flex justify-between">
          <li key={index} className="border-t border-gray-600 py-4 flex justify-between">

            {/* <span>{`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? 'Sent' : 'Received'} ${Number(tx.amount) / 1000000} XRP`}</span>
                        <span>{`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? '-' : '+'} ${Number(tx.amount) / 1000000}`}</span> */}
            {/* <span>{`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? 'Sent' : 'Received'} ${safeParse(tx.amount) / 1000000} XRP`}</span>
            <span>{`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? '-' : '+'} ${safeParse(tx.amount) / 1000000}`}</span> */}
<span>
  {`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? 'Sent' : 'Received'} 
  ${tx.amount ? safeParse(tx.amount, 1/1000000) : 0} XRP`}
</span>
<span>
  {`${tx.type === 'Payment' && tx.source === 'rDXuJEy2dNi6mMmsq85YAffyhyKPaLwyEW' ? '-' : '+'} 
  ${tx.amount ? safeParse(tx.amount, 1/1000000) : 0}`}
</span>
          </li>
        )) : <li className="border-t border-gray-600 py-4 text-center">No recent transactions found</li>}
      </ul>
    </div>
  );
}

export default TransactionsHistory;
