

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Spinner = () => (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
    </div>
);

const ConfirmModal = ({ businessName, onConfirm }: { businessName: string; onConfirm: () => void }) => (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
        <div className="bg-white p-6 rounded">
            <p className="mb-4">Confirm payment to: {businessName}</p>
            <button onClick={onConfirm} className="bg-green-500 p-2 rounded text-white">Confirm Payment</button>
        </div>
    </div>
);


const TransactionSuccessModal = () => (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-black text-2xl font-bold">Transaction Successful!</p>
        </div>
    </div>
);



const PayMerchants = () => {
    const [tillNumber, setTillNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);

    // Assuming you've imported useAuth from your auth context
    const { user } = useAuth();

    const handlePaymentInitiation = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!user) {
            // Handle unauthenticated user scenario
            console.error("User is not authenticated.");
            return;
        }
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error("No token found.");
            return;
        }
        const tokenAddress = "0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8"; // Set this based on your logic

        try {

            const response = await fetch('https://afpaybackend-pbj0jv1ei-nashons.vercel.app/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tokenAddress,
                    senderAddress: user.walletAddress,
                    businessUniqueCode: tillNumber, // Renamed tillNumber to match backend
                    amount,
                    senderPhoneNumber: user.phoneNumber,
                    confirm: isConfirming
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (!isConfirming) {
                    setBusinessName(data.businessName);
                    setIsConfirming(true);
                } else {
                    setTransactionSuccess(true);
                    setTillNumber('');
                    setAmount('');
                    setIsConfirming(false);
                    setTimeout(() => {
                        setTransactionSuccess(false);
                    }, 3000);
                }
            } else {
                console.error("Error initiating payment:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePaymentConfirmation = async () => {
        if (!user) {
            // Handle unauthenticated user scenario
            console.error("User is not authenticated.");
            return;
        }
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error("No token found.");
            return;
        }
        const tokenAddress = "0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8"; // Set this based on your logic

        try {
            setLoading(true); // set loading to true before the transaction

            const response = await fetch('https://afpaybackend-pbj0jv1ei-nashons.vercel.app/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tokenAddress,
                    senderAddress: user.walletAddress,
                    businessUniqueCode: tillNumber, // Renamed tillNumber to match backend
                    amount,
                    senderPhoneNumber: user.phoneNumber,
                    confirm: true
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setLoading(false); // set loading to false after the transaction

                console.log("Transaction successful:", data);
                setTillNumber('');
                setAmount('');
                setIsConfirming(false);
                setTransactionSuccess(true);

                // Close the success popup after 3 seconds
                setTimeout(() => {
                    setTransactionSuccess(false);
                }, 3000);

            } else {
                console.error("Error confirming payment:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-black to-purple-900 p-4">
            {loading && <Spinner />}
            {/* {isConfirming && <ConfirmModal businessName={businessName} onConfirm={handlePaymentConfirmation} />} */}
            {transactionSuccess && <TransactionSuccessModal />}

            <div className="container mx-auto text-white">
                <h1 className="text-2xl font-bold mb-4">Pay Merchants</h1>
                <form onSubmit={handlePaymentInitiation}>
                    <div className="mb-4">
                        <label htmlFor="tillNumber" className="block mb-2">Till Number:</label>
                        <input
                            type="number"
                            id="tillNumber"
                            name="tillNumber"
                            className="p-2 rounded bg-gray-800 w-full"
                            value={tillNumber}
                            onChange={e => setTillNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="amount" className="block mb-2">Amount to Pay:</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="p-2 rounded bg-gray-800 w-full"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>

                    {!isConfirming ? (
                        <button type="submit" className="bg-blue-600 p-2 rounded text-white">Proceed</button>
                    ) : (
                        <div>
                            <p className="mb-4">Confirm payment to: {businessName}</p>
                            <button type="button" onClick={handlePaymentConfirmation} className="bg-green-500 p-2 rounded text-white">Confirm Payment</button>
                        </div>
                    )}
                    {/* <button type="submit" className="bg-blue-600 p-2 rounded text-white">Proceed</button> */}

                </form>
            </div>
        </div>
    );
}

export default PayMerchants;
