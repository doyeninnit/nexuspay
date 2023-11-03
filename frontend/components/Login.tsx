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

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useRouter } from 'next/router';

// const Login: React.FC = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [isValid, setIsValid] = useState(true)
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/auth', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phoneNumber, password }),
//       });
      
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message);
//       }
//       const data = await response.json();
//       if (login) {
//         if (data.token) {
//           login({ token: data.token, phoneNumber: data.phoneNumber, walletAddress: data.walletAddress });
//         } else {
//           console.error("No token received from the server.");
//         }
//       } else {
//         console.error("Login function is not defined in the context.");
//       }
      
//     } catch (err) {
//       console.error('Login Error:', err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-600 to-green-500">
//       <div className="w-96 p-8 bg-purple-700 rounded-lg shadow-md">
//         <h1 className="text-white text-2xl mb-4 text-center">NEXUSPAY</h1>
        
//         {/* Phone Number Input */}
//         <div className="mb-4">
//           <label className="block text-white text-sm font-bold mb-2" htmlFor="phone-number">
//             Phone Number
//           </label>
//           <input 
//             id="phone-number"
//             type="tel" 
//             placeholder=" Phone number" 
//             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!isValid && 'border-red-500 border'}`} 
//             value={phoneNumber}
//             onChange={e => {
//               setIsValid(true);
//               setPhoneNumber(e.currentTarget.value);
//             }}
//           />
//         </div>

//         {/* Password Input */}
//         <div className="mb-6">
//           <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
//             Password
//           </label>
//           <input 
//             id="pin"
//             type="password" 
//             placeholder="Password" 
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
//             value={password}
//             onChange={e => setPassword(e.currentTarget.value)}
//           />
//         </div>

//         {!isValid && <p className="text-red-500 mb-4">Please enter a valid phone number and password.</p>}

//         {/* Connect Button */}
//         <button onClick={handleSubmit} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//           Connect
//         </button>
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
  const [isValid, setIsValid] = useState(true)
  const { login } = useAuth();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (phoneNumber.length !== 9 || password.length !== 4) {
  //     setIsValid(false);
  //     return;
  //   }
  //   try {
  //     const response = await fetch('http://localhost:8000/auth', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ phoneNumber: '+254' + phoneNumber, password }),
  //     });
  //     // ... [rest of the function]
  // };

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8000/auth', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phoneNumber: '+254' + phoneNumber, password }),
// });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (phoneNumber.length !== 10 || password.length !== 4) {
    setIsValid(false);
    return;
  }
  try {
    const response = await fetch('https://afpaybackend-pbj0jv1ei-nashons.vercel.app/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: '+254' + phoneNumber, password }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-600 to-green-500">
      <div className="w-96 p-8 bg-purple-700 rounded-lg shadow-md">
        <h1 className="text-white text-2xl mb-4 text-center">NEXUSPAY</h1>
        
        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="phone-number">
            Phone Number (+254)
          </label>
          <input 
            id="phone-number"
            type="tel" 
            maxLength={10} // restricts to 9 digits
            placeholder=" 0712345678" 
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!isValid && 'border-red-500 border'}`} 
            value={phoneNumber}
            onChange={e => {
              setIsValid(true);
              setPhoneNumber(e.currentTarget.value);
            }}
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
            PIN(4 digits)
          </label>
          <input 
            id="pin"
            type="password"
            maxLength={4} // restricts to 4 digits
            placeholder="1234" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </div>

        {!isValid && <p className="text-red-500 mb-4">Please enter a valid phone number and 4-digit password.</p>}

        {/* Connect Button */}
        <button onClick={handleSubmit} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Connect
        </button>
      </div>
    </div>
  );
          
};

export default Login;
