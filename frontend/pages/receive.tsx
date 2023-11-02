
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';

const Receive = () => {
    const { user } = useAuth();
    const walletNumber = user?.phoneNumber || '';
    const walletAddress = user?.walletAddress || '';
    const [copied, setCopied] = useState(false);

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Wallet Address',
                text: `Here's my wallet address: ${walletAddress}`,
                url: window.location.href,  // or any other link you'd like to share
            })
            .catch(error => {
                console.error("Something went wrong sharing the article", error);
            });
        } else {
            console.error('Share API is not supported on this platform/browser.');
        }
    };

    // Utility function to truncate text
    const truncate = (text: string, length: number) => {
        return text.length > length ? `${text.substring(0, length - 3)}...` : text;
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-black to-purple-900 p-4">
            <div className="container mx-auto text-white">
                <h1 className="text-2xl font-bold mb-4">Receive Crypto</h1>

                <div className="mb-4">
                    <label className="block mb-2">Your Number:</label>
                    <div className="flex justify-between items-center p-2 rounded bg-gray-800">
                        <span>{truncate(walletNumber, 15)}</span> {/* Truncate if needed */}
                        <button onClick={() => handleCopy(walletNumber)}>Copy</button>
                    </div>

                    <label className="block mb-2">Wallet Address:</label>
                    <div className="flex justify-between items-center p-2 rounded bg-gray-800">
                        <span>{truncate(walletAddress, 15)}</span> {/* Truncate if needed */}
                        <button onClick={() => handleCopy(walletAddress)}>Copy</button>
                    </div>
                    {copied && <div className="text-green-500">Copied!</div>}
                </div>

                <div className="mb-8">
                    <label className="block mb-2 text-lg font-semibold">Scan to Receive</label>
                    <div className="p-6 bg-white rounded shadow-lg">
                        <QRCode 
                            value={walletAddress}
                            size={128} // Adjust the size as needed
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="Q" // Error correction level
                            renderAs="svg" // Better for responsiveness and quality
                            includeMargin={true}
                        />
                    </div>
                </div>

                <button onClick={handleShare} className="bg-blue-600 p-2 rounded text-white mt-4">
                    Share Wallet Number
                </button>
            </div>
        </div>
    );
};

export default Receive;
