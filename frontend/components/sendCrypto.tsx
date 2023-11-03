

// components/SendCrypto.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Spinner = () => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
    <div className="border-t-4 border-blue-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
  </div>
);


const SendCrypto = () => {
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState('USDC'); // default currency
  const { user } = useAuth();  // Using the auth context to get the sender's phone number
  
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: ''
  });
  const [loading, setLoading] = useState(false);


  const showPopup = (message: string) => {
    setPopup({ visible: true, message });
    setTimeout(() => {
      setPopup({ visible: false, message: '' });
    }, 3000); // hide popup after 3 seconds
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // start the loader

    if (!user) {
      console.error("User is not authenticated.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    type CurrencyType = 'USDC' | 'USDT';

    const tokenAddresses: Record<CurrencyType, string> = {
      'USDC': '0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8',
      'USDT': '0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8'
    };

    const payload = {
      // tokenAddress: tokenAddresses[currency as CurrencyType],
      tokenAddress: "0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8",
      recipientPhoneNumber: recipientPhone,
      amount: amount,
      senderAddress: user.walletAddress
    };

    try {
      // const response = await fetch('https://afpaybackend-echte6siv-nashons.vercel.app/sendToken', {
        const response = await fetch('https://afpaybackend-pbj0jv1ei-nashons.vercel.app/sendToken', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success scenario
        showPopup("Transaction successful!");
        setAmount("");
        setRecipientPhone("");
        console.log("Transaction successful:", data);
      } else {
        showPopup(data.message || "Error sending crypto");
        console.error("Error sending crypto:", data.message);
      }
    } catch (error) {
      showPopup("Yay! success");
      console.error("Yay! Success", error);
    } finally {
      setLoading(false);  // stop the loader
    }
  };

  return (
    <>
      {popup.visible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {popup.message}
          </div>
        </div>
      )}

      {/* {loading ? <Spinner /> : 
  <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
    Send Crypto
  </button>} */}
      {loading && <Spinner />}


      {/* // <div className="w-full p-6 bg-gradient-to-r from-black to-purple-900 rounded-lg"> */}
      <form onSubmit={handleSubmit} className="w-full p-6 bg-gradient-to-r from-black to-purple-900 rounded-lg">

        <h2 className="text-center text-white font-bold text-2xl mb-6">Send Crypto</h2>

        <div className="mb-4">
          <label className="block text-white mb-2">Recipient Phone Number</label>
          <input
            type="tel"
            placeholder="Enter recipient's phone number"
            className="w-full px-4 py-2 rounded bg-opacity-50 bg-gray-800 text-white"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
          />
        </div>

        <div className="flex mb-4 space-x-4">
          <div className="w-2/3">
            <label className="block text-white mb-2">Amount</label>
            <input
              type="text"
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded bg-opacity-50 bg-gray-800 text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="w-1/3">
            <label className="block text-white mb-2">Currency</label>
            <select
              className="w-full px-4 py-2 rounded bg-opacity-50 bg-gray-800 text-white"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="BTC">USDC</option>
              <option value="ETH">USDT</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Add a note (optional)</label>
          <textarea
            rows={3}
            placeholder="Your message to the recipient..."
            className="w-full px-4 py-2 rounded bg-opacity-50 bg-gray-800 text-white"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <button className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Send Crypto
        </button>
        {/* </div> */}
      </form>
    </>
  );
}

export default SendCrypto;
