import React, { useState } from 'react';
import axios from 'axios';

function Auth() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // By default, set to login
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [token, setToken] = useState(''); // To store the returned token after login

    const handleSubmit = async () => {
        const endpoint = isLogin ? '/login' : '/register';
        try {
            const response = await axios.post(`http://localhost:8000${endpoint}`, {
                phoneNumber,
                password,
            });

            if (isLogin) {
                const { token } = response.data;
                setToken(token);
                setSuccessMessage('Login successful!');
            } else {
                const { walletAddress, amount } = response.data;
                setSuccessMessage(`Registration successful! Wallet Address: ${walletAddress}, Amount: ${amount}`);
            }
        } catch (error) {
            // if (error.response && error.response.data && error.response.data.message) {
            //     setError(error.response.data.message);
            // } else {
            //     setError("An error occurred.");
            // }
            console.error(error)
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <input 
                type="text" 
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p>{error}</p>}
            <button onClick={handleSubmit}>{isLogin ? 'Login' : 'Register'}</button>
            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}

export default Auth;
