// // components/OnRamp.tsx
// import { useState, useEffect } from 'react';
// import Link from 'next/link';  // Import the Link component

// const OnRamp = () => {
  

  
//     return (
//       <div className="mt-12 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded">
//         <h1 className="text-xl font-bold mb-4">Quick Buy</h1>
//         {/* Placeholder for a buy button or input */}
//         <button  className="bg-white text-black px-4 py-2 rounded">Buy Crypto</button>
//       </div>
//     );
//   }
  
//   export default OnRamp;
import { useState, useEffect } from 'react';
import Link from 'next/link';  // Import the Link component

const OnRamp = () => {
    return (
      <div className="mt-12 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded">
        <h1 className="text-xl font-bold mb-4">Quick Buy</h1>
        {/* Placeholder for a buy button or input */}
        <Link href="/buyCrypto">  {/* Wrap the button with the Link component */}
          <button  className="bg-white text-black px-4 py-2 rounded">Buy Crypto</button>
        </Link>
      </div>
    );
}
  
export default OnRamp;
