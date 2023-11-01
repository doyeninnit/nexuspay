// components/BuyCrypto.tsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Transak from "@biconomy/transak";
import { useAuth } from '@/contexts/AuthContext';
declare global {
    interface Window {
        TransakSDK: any;
    }
}
const BuyCrypto: React.FC = () => {
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user } = useAuth();
    useEffect(() => {
        setIsClient(true);
        setIsMobile(window.innerWidth <= 768);

    }, []);

    const openTransak = () => {
        // if (!user?.walletAddress) {
        //   throw new Error("Wallet address not available");
        // }
        const transak = new Transak('PRODUCTION', {
            walletAddress: user?.walletAddress || '',
            userData: {
                firstName: '',
                email: '',
            },
            // Adjust the width and height for mobile screens
            widgetHeight: isMobile ? '400px' : '650px',
            widgetWidth: isMobile ? '300px' : '450px',
        });
        transak.init();
    }
    return (
        <div className="bg-darkPurple min-h-screen text-white">


            <main className="p-4">
                <p className="text-center text-lg mb-8">Choose your preferred payment method</p>

                {/* Payment Methods */}
                <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:space-x-6">
                    {/* Buy Using Card */}
                    <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4 rounded-md flex-grow">
                        <div className="text-center">
                            {isClient && (
                                <>
                                    <FontAwesomeIcon icon={['fab', 'cc-visa']} size="2x" className="mr-4" />
                                    <FontAwesomeIcon icon={['fab', 'cc-mastercard']} size="2x" />
                                </>
                            )}
                            <p className="mb-4">Buy using Card (Visa/Mastercard)</p>
                            <button onClick={openTransak} className="bg-purple-400 px-6 py-2 rounded-md">Proceed</button>
                        </div>
                    </div>


                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-md flex-grow relative">
                        <div className="text-center">
                            <img src="/mpesalog.png" alt="Mpesa" className="mx-auto mb-4" />
                            <p className="mb-4">Buy using Mpesa</p>
                            <button className="bg-teal-400 px-6 py-2 rounded-md">Proceed</button>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                            <span className="text-lg font-bold">Coming Soon!!!</span>
                        </div>
                    </div>

                </div>
            </main>


        </div>
    );
};

export default BuyCrypto;
