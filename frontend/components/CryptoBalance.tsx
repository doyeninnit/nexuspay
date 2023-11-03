// // // components/CryptoBalance.tsx

// // const CryptoBalance = () => {
// //     return (
// //       <div className="text-center py-12">
// //         <h1 className="text-2xl font-bold">Your Balance</h1>
// //         <p className="text-xl mt-4">0.00 XRP</p>
// //       </div>
// //     );
// //   }
  
// //   export default CryptoBalance;
  
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';

// const CryptoBalance = () => {
//     const [balance, setBalance] = useState<string>('0.00');
//     const { user } = useAuth();
//     const walletAddress = user?.walletAddress || '';

//     useEffect(() => {
//         // Function to fetch balance from API
//         const fetchBalance = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8000/account_info/${walletAddress}`);
//                 const data = await response.json();

//                 if (data.status === 'success' && data.bal) {
//                     // Assuming the balance is in smallest unit and needs to be divided by 1e6 to get actual XRP
//                     const xrpBalance = (Number(data.bal) / 1e6).toFixed(2);
//                     setBalance(xrpBalance);
//                     console.log(balance)
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch balance:", error);
//             }
//         };

//         if (walletAddress) {
//             fetchBalance();
//         }

//     }, [walletAddress]); // Effect will run whenever walletAddress changes

//     return (
//         <div className="text-center py-12">
//             <h1 className="text-2xl font-bold">Your Balance</h1>
//             <p className="text-xl mt-4">{balance} XRP</p>
//         </div>
//     );
// }

// export default CryptoBalance;


// import React, { useEffect, useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';

// const CryptoBalance = () => {
//     const [balance, setBalance] = useState<string>('0.00');
//     const { user } = useAuth();
//     const walletAddress = user?.walletAddress || '';

//     useEffect(() => {
//         // Function to fetch balance from API
//         const fetchBalance = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8000/account_info/${walletAddress}`);
//                 const data = await response.json();

//                 if (data.status === 'success' && data.bal) {
//                     // Assuming the balance is in smallest unit and needs to be divided by 1e6 to get actual XRP
//                     const xrpBalance = (Number(data.bal) / 1e6).toFixed(2);
//                     setBalance(xrpBalance);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch balance:", error);
//             }
//         };

//         if (walletAddress) {
//             fetchBalance(); // Fetch immediately on component mount or when walletAddress changes

//             const interval = setInterval(fetchBalance, 60000); // Fetch every 1 minute

//             return () => clearInterval(interval); // Clear the interval when component is unmounted
//         }

//     }, [walletAddress]); // Effect will run whenever walletAddress changes

//     return (
//         <div className="text-center py-12">
//             <h1 className="text-2xl font-bold">Your Balance</h1>
//             <p className="text-xl mt-4">{balance} XRP</p>
//         </div>
//     );
// }

// export default CryptoBalance;

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const CryptoBalance = () => {
    const [balanceInUSDC, setBalanceInUSDC] = useState<string>('0.00');
    const [balanceInKES, setBalanceInKES] = useState<string>('0.00');
    const { user } = useAuth();
    const walletAddress = user?.walletAddress || '';

    useEffect(() => {
        // Function to fetch balance from the new API
        const fetchBalance = async () => {
            try {
                const response = await fetch(`https://afpaybackend-pbj0jv1ei-nashons.vercel.app/usdc-balance/${walletAddress}`);
                const data = await response.json();

                if (data.balanceInUSDC && data.balanceInKES) {
                    setBalanceInUSDC(Number(data.balanceInUSDC).toFixed(2));
                    setBalanceInKES(Number(data.balanceInKES).toFixed(2));
                }
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        };

        if (walletAddress) {
            fetchBalance(); // Fetch immediately on component mount or when walletAddress changes

            const interval = setInterval(fetchBalance, 60000); // Fetch every 1 minute

            return () => clearInterval(interval); // Clear the interval when component is unmounted
        }

    }, []);

    return (
        <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Your Balance</h1>
            <p className="text-xl mt-4">{balanceInUSDC} USDC</p>
            <p className="text-xl mt-4">{balanceInKES} KES</p>
        </div>
    );
}

export default CryptoBalance;


