// import React, { useState } from 'react';
// import QrReader from 'react-qr-reader';
// const QRScanner = () => {
//   const [scanResult, setScanResult] = useState('');

//   const handleScan = (data: React.SetStateAction<string>) => {
//     if (data) {
//       setScanResult(data);
//     }
//   }

//   const handleError = (err: any) => {
//     console.error(err);
//   }

//   return (
//     <div>
//       <QrReader
//         delay={300}
//         onError={handleError}
//         onScan={handleScan}
//         style={{ width: '100%' }}
//       />
//       <p>Scanned Code: {scanResult}</p>
//     </div>

//   );
// }

// export default QRScanner;


// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';

// const QRScanner = (props: any) => {
//   const [data, setData] = useState('No result');

//   return (
//     <>
//       <QrReader
//         onResult={(result: { text: React.SetStateAction<string>; }, error: any) => {
//           if (!!result) {
//             setData(result?.text);
//           }

//           if (!!error) {
//             console.info(error);
//           }
//         }}
//         style={{ width: '100%' }}
//       />
//       <p>{data}</p>
//     </>
//   );
// };



// export default QRScanner;


import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [data, setData] = useState('No result');

  const handleScan = (result: { text: React.SetStateAction<string>; }, error: any) => {
    if (result) {
      setData(result.text);
    }
    if (error) {
      console.info('Error while scanning:', error);
    }
  };

  return (
    <div>
      <QrReader
        onResult={handleScan}
        constraints={{ facingMode: 'environment' }}
        scanDelay={1000}
        videoId="qrScannerVideo"
        className="qr-reader-container"
        containerStyle={{ border: '1px solid black', borderRadius: '5px' }}
        videoContainerStyle={{ borderRadius: '5px' }}
        videoStyle={{ borderRadius: '5px' }}
        style={{ width: '100%' }}
      />
      <p>Scanned Data: {data}</p>
    </div>
  );
};

export default QRScanner;


