// components/Register.tsx

import { useState } from 'react';
import axios from 'axios';
import { useRegistration } from '@/contexts/RegistrationContext';
const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { setRegistered } = useRegistration();

  const registerUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/register', { phoneNumber });
      setWalletAddress(response.data.walletAddress);
      setAmount(response.data.amount);
      setError('');
      setRegistered(true); // Set to true after successful registration
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
//   const registerUser = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/register', { phoneNumber });
//       setWalletAddress(response.data.walletAddress);
//       setAmount(response.data.amount);
//       setError(''); // clear any previous errors
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="flex flex-col items-center p-8">
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mb-4 p-2 border border-gray-400 rounded"
      />
      <button onClick={registerUser} className="mb-4 p-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      {walletAddress && (
        <div className="text-green-500">
          Registered successfully! Your wallet address: {walletAddress}. Balance: {amount} XRP
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default Register;
