// components/Register.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

type RegisterProps = {
    toggleView: () => void;
  };
  
  const Register: React.FC<RegisterProps> = ({ toggleView }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();  


const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    try {
        console.log("registering...")
      // const response = await fetch('https://afpaybackend-bokyjcxb7-nashons.vercel.app/register', {
        const response = await fetch('http://localhost:8000/register', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });
  
      const data = await response.json();
      console.log(data)
         if (data.walletAddress) {
        if (login) {
          login(data);
        } else {
          console.error("Login function is not defined");
        }
      }
    } catch (err) {
      console.error('Registration Error:', err);
    }
  };


return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl text-center font-bold">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <button className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:bg-green-700" type="submit">
              Register
            </button>
          </div>

          <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account? 
                    <button onClick={toggleView} className="text-blue-500 hover:underline ml-2">Login instead</button>
                </p>
            </div>

        </form>
      </div>
    </div>
  );
};
export default Register;
