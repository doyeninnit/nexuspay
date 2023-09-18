// components/WalletAddress.tsx

const WalletAddress = () => {
    return (
      <div className="mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Your Wallet Address</h2>
        <p className="break-all bg-white p-2 rounded">0x1234abcd...7890</p>
        {/* A button to copy the wallet address can be added here */}
      </div>
    );
  }
  
  export default WalletAddress;
  