// // components/Login.tsx

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useRouter } from 'next/router';
// type LoginProps = {
//     toggleView: () => void;
//   };
  
//   const Login: React.FC<LoginProps> = ({ toggleView }) => {
//     const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const router = useRouter(); 


// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//         console.log("logging...");
        
//         // const response = await fetch('https://afpaybackend-bokyjcxb7-nashons.vercel.app/login', {
//           const response = await fetch('http://localhost:8000/auth', {

//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ phoneNumber, password }),
//         });
        
//         if (!response.ok) {
//             const data = await response.json();
//             throw new Error(data.message);
//         }

//         const data = await response.json();
//         console.log(data)
//         if (login) {
//             if (data.token) {
//                 login({ token: data.token, phoneNumber: data.phoneNumber, walletAddress: data.walletAddress });
//             } else {
//                 console.error("No token received from the server.");
//             }
//         } else {
//             console.error("Login function is not defined in the context.");
//         }
        
//     } catch (err) {
//       console.error('Login Error:', err);
//     }
// };

// return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
//         <h1 className="mb-4 text-2xl text-center font-bold">Login</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="phoneNumber">
//               Phone Number
//             </label>
//             <input
//               className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//               id="phoneNumber"
//               type="text"
//               placeholder="Phone Number"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
//               Password
//             </label>
//             <input
//               className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
//               id="password"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="mb-6">
//             <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:bg-blue-700" type="submit">
//               Login
//             </button>
//           </div>
//           <div className="text-center mt-4">
//                 <p className="text-sm text-gray-600">
//                     Dont have an account? 
//                     <button onClick={toggleView} className="text-blue-500 hover:underline ml-2">Register instead</button>
//                 </p>
//             </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false)
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const data = await response.json();
      if (login) {
        if (data.token) {
          login({ token: data.token, phoneNumber: data.phoneNumber, walletAddress: data.walletAddress });
        } else {
          console.error("No token received from the server.");
        }
      } else {
        console.error("Login function is not defined in the context.");
      }
      
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen flex flex-col justify-center items-center py-5 px-4">

   

    <div className="z-10">

      <h1 className="text-white mb-6 text-2xl font-bold">NEXUSPAY</h1>

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
      <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:from-purple-400 hover:to-blue-400 transition">
        Connect
      </button>

    </div>
  </div>
  );
};

export default Login;
