// components/Login.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
type LoginProps = {
    toggleView: () => void;
  };
  
  const Login: React.FC<LoginProps> = ({ toggleView }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter(); 


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
        console.log("logging...");
        
        const response = await fetch('https://afpaybackend-nashons.vercel.app/login', {
          // const response = await fetch('http://localhost:8000/login', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, password }),
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        const data = await response.json();
        console.log(data)
        if (login) {
            if (data.token) {
                login({ token: data.token, phoneNumber });
            } else {
                console.error("No token received from the server.");
            }
        } else {
            console.error("Login function is not defined in the context.");
        }
        
    } catch (err) {
        console.error('Login Error:');
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl text-center font-bold">Login</h1>
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
            <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:bg-blue-700" type="submit">
              Login
            </button>
          </div>
          <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Dont have an account? 
                    <button onClick={toggleView} className="text-blue-500 hover:underline ml-2">Register instead</button>
                </p>
            </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
