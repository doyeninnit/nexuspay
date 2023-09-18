// components/TransactionsHistory.tsx

const TransactionsHistory = () => {
    return (
      <div className="mt-12">
        <h1 className="text-2xl font-bold mb-6">Recent Transactions</h1>
        <ul>
          {/* This will later be replaced with dynamic data */}
          <li className="border-t border-gray-600 py-4 flex justify-between">
            <span>Received 0.5 BTC</span>
            <span>+ $25,000</span>
          </li>
          {/* Repeat similar list items for more transactions */}
        </ul>
      </div>
    );
  }
  
  export default TransactionsHistory;
  