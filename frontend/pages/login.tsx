// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '@/contexts/AuthContext';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Send a request to your backend to validate the user
//     const response = await fetch('/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password }),
//     });

//   //   if (response.status === 200) {
//   //     login();
//   //     router.push('/dashboard'); // or wherever you want to redirect after a successful login
//   //   } else {
//   //     // Handle the error. Maybe show a message to the user.
//   //   }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           value={username}
//           onChange={e => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// pages/login.tsx
// import Login from '../components/Login';

// const LoginPage: React.FC = () => {
//   return (
//     <div className="bg-black min-h-screen text-white">
//       <Login toggleView={function (): void {
//         throw new Error('Function not implemented.');
//       } } />
//     </div>
//   );
// }

// export default LoginPage;

// components/Authenticate.js
// import Image from 'next/image';

// function Authenticate() {
//   return (
//     <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
//       {/* Logo and Brand Name */}
//       <div className="mb-6 text-center">
//         <Image src="/path-to-your-logo.png" alt="Crypto Wallet Logo" width={100} height={100} />
//         <h1 className="text-white font-bold text-2xl mt-2">Crypto Wallet</h1>
//       </div>

//       {/* Authentication Form */}
//       <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
//         <h2 className="text-white mb-4">Unlock Your Wallet</h2>
        
//         <div className="mb-4">
//           <label htmlFor="phone" className="block text-white mb-2">Phone Number</label>
//           <div className="flex items-center px-3 py-2 bg-white rounded">
//             <span className="mr-2">
//               <i className="fas fa-phone-alt"></i> {/* You can use FontAwesome or any icon library */}
//             </span>
//             <input type="tel" id="phone" placeholder="Enter your phone number" className="flex-grow bg-transparent outline-none" />
//           </div>
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="pin" className="block text-white mb-2">Enter your 4-Digit Pin</label>
//           <div className="flex items-center px-3 py-2 bg-white rounded">
//             <span className="mr-2">
//               <i className="fas fa-lock"></i> {/* FontAwesome or any icon library */}
//             </span>
//             <input type="password" inputMode="numeric" id="pin" placeholder="****" className="flex-grow bg-transparent outline-none" />
//           </div>
//         </div>
        
//         <button className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded text-white font-bold mt-4 transition">
//           Authenticate
//         </button>
        
//         <p className="text-xs text-gray-400 mt-3">We don't store your personal data. This is purely for authentication purposes.</p>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 text-center text-gray-500">
//         <p className="mb-2"><a href="#" className="underline">FAQ & Support</a></p>
//         <p className="mb-2"><a href="#" className="underline">About Crypto</a></p>
//         <p className="mb-2"><a href="#" className="underline">Terms of Service & Privacy Policy</a></p>
//       </div>
//     </div>
//   );
// }

// export default Authenticate;

// components/Authenticate.js
import React, {useState} from "react";
function Authenticate() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleConnect = () => {
    const phonePattern = /^\+254\d{9}$/; // Matches +254 followed by 9 digits
    if (phonePattern.test(phoneNumber) && password) {
      console.log("Phone Number:", phoneNumber);
      console.log("Password:", password);
      // Here, you can proceed with authentication or any other actions
    } else {
      setIsValid(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen flex flex-col justify-center items-center py-5 px-4">

   

    <div className="z-10">

      <h1 className="text-white mb-6 text-2xl font-bold">Authenticate</h1>

      {/* Phone Number Input */}
      <div className="mb-4 w-64 flex items-center bg-white rounded-lg px-3 py-2 shadow-md">
        <span className="text-blue-600 mr-2">🇰🇪</span>
        <input 
          type="tel" 
          placeholder="+254 Phone number" 
          className={`flex-grow bg-transparent text-gray-900 placeholder-blue-600 outline-none ${!isValid && 'border-red-500 border'}`} 
          value={phoneNumber}
          onChange={e => {
            setIsValid(true);
            setPhoneNumber(e.currentTarget.value);
          }}
        />
      </div>

      {/* Password Input */}
      <div className="mb-4 w-64 flex items-center bg-white rounded-lg px-3 py-2 shadow-md">
        <span className="text-blue-600 mr-2">🔒</span>
        <input 
          type="password" 
          placeholder="Password" 
          className="flex-grow bg-transparent text-gray-900 placeholder-blue-600 outline-none" 
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </div>

      {!isValid && <p className="text-red-500 mb-4">Please enter a valid phone number and password.</p>}

      {/* Connect Button */}
      <button onClick={handleConnect} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-purple-400 hover:to-blue-400 transition">
        Connect
      </button>

    </div>

     {/* Additional Designs inspired by the image */}
     {/* <div className="flex space-x-4">

        <div className="bg-white h-24 w-2 rounded-lg"></div>
        <div className="bg-white h-16 w-2 rounded-lg"></div>
        <div className="bg-white h-32 w-2 rounded-lg"></div>
        <div className="bg-white h-20 w-2 rounded-lg"></div>
        <div className="bg-white h-28 w-2 rounded-lg"></div>
      </div> */}
  </div>
);
}

export default Authenticate;
