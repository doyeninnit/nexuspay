import React, { useState } from 'react';
import { QrReader } from "react-qr-reader";
import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';

const Header: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string>("No result");
    const [scanError, setScanError] = useState<string | null>(null);
    const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);

    const handleScan = (result: { text?: string }, error?: Error) => {
        if (result?.text) {
            if (isValidEthereumAddress(result.text)) {
                setScannedData(result.text);
                setLastScannedAt(new Date().toLocaleTimeString());
                setScanError(null);
            } else {
                setScanError("Scanned QR does not contain a valid Ethereum address.");
            }
        }
        if (error) {
            console.info(error);
            setScanError(error.message);
        }
    };

    const isValidEthereumAddress = (address: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    return (
        //... [rest of your code remains unchanged]
        <div className="bg-gradient-to-r from-black to-purple-900 p-4">
           <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <span className="text-white font-bold">
                        Welcome, Anonn
                    </span>
                    <div className="flex space-x-4">
                        <MdNotifications className="text-white" size={24} />
                      <button onClick={() => setIsScanning(prev => !prev)}>
                            <MdCenterFocusStrong className="text-white" size={24} />
                         </button>
                    </div>
                 </div>
                
                {isScanning && (
                    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                        <QrReader
                            onResult={handleScan}
                            constraints={{ facingMode: "environment" }}
                            style={{ width: "100%", height: "400px" }} // Make the QR code scanner larger and more prominent.
                        />
                        <div className="mt-4">
                            <p className="text-black mb-2">Scan QR code:</p>
                            <p className="text-gray-700">{scannedData}</p>
                            {lastScannedAt && <span className="text-sm text-gray-500">Last scanned at: {lastScannedAt}</span>}
                        </div>
                    </div>
                )}
                {scanError && <p className="text-red-600 mt-4">{scanError}</p>} 
                <button onClick={() => setIsScanning(false)} className="mt-4 text-blue-600">Reset scanner</button> 
            </div>
        </div>
    );
                }
export default Header;


// import React, { useState } from 'react';
// import { QrReader } from "react-qr-reader";
// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';

// const Header: React.FC = () => {
//     const [isScanning, setIsScanning] = useState<boolean>(false);
//     const [scannedData, setScannedData] = useState<string>("No result");
//     const [scanError, setScanError] = useState<string | null>(null);
//     const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);

//     const handleScan = (result: { text?: string }, error?: Error) => {
//         if (result?.text) {
//             if (isValidEthereumAddress(result.text)) {
//                 setScannedData(result.text);
//                 setLastScannedAt(new Date().toLocaleTimeString());
//                 setScanError(null);
//             } else {
//                 setScanError("Scanned QR does not contain a valid Ethereum address.");
//             }
//         }
//         if (error) {
//             console.info(error);
//             setScanError(error.message);
//         }
//     };

//     const isValidEthereumAddress = (address: string): boolean => {
//         return /^0x[a-fA-F0-9]{40}$/.test(address);
//     };

//     return (
//         //... [rest of your code remains unchanged]
//         <div className="bg-gradient-to-r from-black to-purple-900 p-4">
//            <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <span className="text-white font-bold">
//                         Welcome, Anonn
//                     </span>
//                     <div className="flex space-x-4">
//                         <MdNotifications className="text-white" size={24} />
//                       <button onClick={() => setIsScanning(prev => !prev)}>
//                             <MdCenterFocusStrong className="text-white" size={24} />
//                          </button>
//                     </div>
//                  </div>
                
//                 {isScanning && (
//                     <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//                         <QrReader
//                             onResult={handleScan}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%", height: "300px" }}
//                         />
//                         <div className="mt-4">
//                             <p className="text-black mb-2">Scanned Result:</p>
//                             <p className="text-gray-700">{scannedData}</p>
//                             {lastScannedAt && <span className="text-sm text-gray-500">Last scanned at: {lastScannedAt}</span>}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
//                 }
// export default Header;




// import React, { useState } from 'react';
// import { QrReader } from "react-qr-reader";
// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';

// const Header = () => {
//     const [isScanning, setIsScanning] = useState(false);
//     const [scannedData, setScannedData] = useState("No result");
//     const [lastScannedAt, setLastScannedAt] = useState(null);

//     const handleScan = (result: { text: React.SetStateAction<string>; }, error: any) => {
//         if (result) {
//             setScannedData(result.text);
//             // setLastScannedAt("439");
//         }
//         if (error) {
//             console.info(error);
//         }
//     };

//     return (
//         <div className="bg-gradient-to-r from-black to-purple-900 p-4">
//             <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <span className="text-white font-bold">
//                         Welcome, Anonn
//                     </span>
//                     <div className="flex space-x-4">
//                         <MdNotifications className="text-white" size={24} />
//                         <button onClick={() => setIsScanning(prev => !prev)}>
//                             <MdCenterFocusStrong className="text-white" size={24} />
//                         </button>
//                     </div>
//                 </div>
                
//                 {isScanning && (
//                     <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//                         <QrReader
//                             onResult={handleScan}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%", height: "300px" }}
//                         />
//                         <div className="mt-4">
//                             <p className="text-black mb-2">Scanned Result:</p>
//                             <p className="text-gray-700">{scannedData}</p>
//                             {lastScannedAt && <span className="text-sm text-gray-500">Last scanned at: {lastScannedAt}</span>}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Header;




// import React, { useState } from 'react';
// import { QrReader } from "react-qr-reader";
// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';

// const Header = () => {
//     const [isScanning, setIsScanning] = useState(false);
//     const [scannedData, setScannedData] = useState("No result");

//     const handleScan = (result: { text: React.SetStateAction<string>; }, error: any) => {
//         if (result) {
//             setScannedData(result.text);
//         }
//         if (error) {
//             console.info(error);
//         }
//     };

//     return (
//         <div className="bg-gradient-to-r from-black to-purple-900 p-4">
//             <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <span className="text-white font-bold">
//                         Welcome, Anonn
//                     </span>
//                     <div className="flex space-x-4">
//                         <MdNotifications className="text-white" size={24} />
//                         <button onClick={() => setIsScanning(prev => !prev)}>
//                             <MdCenterFocusStrong className="text-white" size={24} />
//                         </button>
//                     </div>
//                 </div>
                
//                 {isScanning && (
//                     <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//                         <QrReader
//                             onResult={handleScan}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%", height: "300px" }}
//                         />
//                         <p className="text-black mt-4">{scannedData}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Header;


// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; // Import the icons you want to use
// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//     const { user } = useAuth();

//     return (
//         <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//             <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <div className="text-white font-bold">
//                         Welcome, Anonn
//                     </div>

//                     {/* {user ? ( */}
//                         <div className="text-white flex items-center space-x-4">
//                             <MdNotifications size={24} /> {/* Notification Icon */}
//                             <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//                             {/* You can wrap the above icons in buttons or links if needed */}
//                         </div>
//                     {/* ) : null} */}
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;


// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; 
// import { useAuth } from '../contexts/AuthContext';
// import QRScanner from './QRScanner'; // Make sure to import the scanner component
// import { useState } from 'react';

// const Header = () => {
//   const { user } = useAuth();
//   const [showScanner, setShowScanner] = useState(false);

//   return (
//     <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center">
//           <div className="text-white font-bold">
//             Welcome, Anon
//           </div>

//           {user ? (
//             <div className="text-white flex items-center space-x-4">
//               <MdNotifications size={24} /> {/* Notification Icon */}
//               <button onClick={() => setShowScanner(!showScanner)}>
//                 <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//               </button>
//               {showScanner && <QRScanner />}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
