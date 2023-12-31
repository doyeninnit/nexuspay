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
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Login toggleView={function (): void {
        throw new Error('Function not implemented.');
      } } />
    </div>
  );
}

export default LoginPage;
