

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TokenTransferEvent {
  hash: string;
  from: string;
  to: string;
  value: string; // In smallest unit (e.g., wei for ETH)
  gas: string;
  gasPrice: string;
  timeStamp: string;
  tokenName: string;
  tokenSymbol: string;
}

const TransactionsHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TokenTransferEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.walletAddress) {
          throw new Error("Wallet address not available");
        }

        const response = await fetch(`https://afpaybackend-pbj0jv1ei-nashons.vercel.app/token-transfer-events?address=${user.walletAddress}`);
        const data = await response.json();
        // console.log(data)
        setTransactions(data);

      } catch (error) {
        console.error("Failed fetching transaction data", error);
      }
    };

    if (user?.walletAddress) {
      fetchData();
    }
  });

  const weiToEther = (wei: string): string => {
    const ether = parseFloat(wei) / 10**18;
    return ether.toFixed(4);
  };

  return (
    <div className="mt-12">
      <h1 className="text-2xl font-bold mb-6">Recent Transactions</h1>
      <ul>
        {transactions.length > 0 ? transactions.map((tx, index) => (
          <li key={tx.hash} className="border-t border-gray-600 py-4 flex justify-between">
            <span>
              {/* {`${tx.from === user?.walletAddress ? 'Sent' : 'Received'}  */}
              {`${tx.from ===  user?.walletAddress ? 'Sent' : 'Received'} ${tx.tokenSymbol || 'ETH'}`}
</span>
            <span>
              {/* {`${tx.from === user?.walletAddress ? '-' : '+'}  */}
              {`${tx.from === user?.walletAddress ? '-' : '+'} 

              ${weiToEther(tx.value)}`}
            </span>
          </li>
        )) : <li className="border-t border-gray-600 py-4 text-center">No recent transactions found</li>}
      </ul>
    </div>
  );
}

export default TransactionsHistory;

