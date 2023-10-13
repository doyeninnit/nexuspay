import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');

  const handleScan = (data: React.SetStateAction<string>) => {
    if (data) {
      setScanResult(data);
    }
  }

  const handleError = (err: any) => {
    console.error(err);
  }

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>Scanned Code: {scanResult}</p>
    </div>
  );
}

export default QRScanner;
