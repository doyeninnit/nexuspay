// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';

// const QRScanner = () => {
//   const [data, setData] = useState('No result');

//   const handleScan = (result: { text: React.SetStateAction<string>; }, error: any) => {
//     if (result) {
//       setData(result.text);
//     }
//     if (error) {
//       console.info('Error while scanning:', error);
//     }
//   };

//   return (
//     <div>
//       <QrReader
//         onResult={handleScan}
//         constraints={{ facingMode: 'environment' }}
//         scanDelay={5000}
//         videoId="qrScannerVideo"
//         className="qr-reader-container"
//         containerStyle={{ border: '1px solid black', borderRadius: '5px' }}
//         videoContainerStyle={{ borderRadius: '5px' }}
//         videoStyle={{ borderRadius: '5px' }}
//         style={{ width: '100%' }}
//       />
//       <p>Scanned Data: {data}</p>
//     </div>
//   );
// };

// export default QRScanner;

// import React, {useState} from 'react';
// import QRReader from '@wypratama/react-qr';
// import '@wypratama/react-qr/dist/style.css';

// const App = () => {
//   const [data, setData] = useState('No result');

//   const handleResult = (result: any) => {
//     console.log('QR code data:', result);
//     setData(result)
//   };

//   return (
//     <div>
//       <h1>Scan a QR code</h1>
//       <QRReader onResult={handleResult} />
//       <p>result: {data}</p>
//     </div>
//   );
// };

// import React, { Component } from 'react';
// import QrReader from 'react-qr-scanner';

// interface State {
//   delay: number;
//   result: string;
//   errorr: any;
// }

// class Test extends Component<{}, State> {
//   constructor(props: {}) {
//     super(props);
//     this.state = {
//       delay: 100,
//       result: 'No result',
//       errorr: '',

//     };

//     this.handleScan = this.handleScan.bind(this);
//     this.handleError = this.handleError.bind(this);
//   }

//   handleScan(data: string) {
//     if (data) {
//       this.setState({
//         result: data,
//       });
//     }
//   }

//   handleError(err: any) {
//     console.error(err);
//     if (err) {
//       this.setState({
//         errorr: err,
//       });
//     }
//   }

//   render() {
//     const previewStyle = {
//       height: 240,
//       width: 320,
//     };

//     return (
//       <div>
//         <QrReader
//           delay={this.state.delay}
//           style={previewStyle}
//           onError={this.handleError}
//           onScan={this.handleScan}
//         />
//         <p>{this.state.result}</p>
//         <p>err {this.state.errorr}</p>

//       </div>
//     );
//   }
// }

// export default Test;



import React, { Component } from 'react';
import QrReader from 'react-qr-scanner';

interface State {
  delay: number;
  result: string;
  errorr: any;
  isClient: boolean;
}

class Test extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      delay: 100,
      result: 'No result',
      errorr: '',
      isClient: false
    };

    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  handleScan(data: string) {
    if (data) {
      this.setState({
        result: data,
      });
    }
  }

  handleError(err: any) {
    console.error(err);
    if (err) {
      this.setState({
        errorr: err,
      });
    }
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div>
        {this.state.isClient && (
          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        )}
        <p>{this.state.result}</p>
        <p>err {this.state.errorr}</p>
      </div>
    );
  }
}

export default Test;
