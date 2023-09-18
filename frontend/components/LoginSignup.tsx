// // LoginSignup.tsx
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// const LoginSignup = () => {
//     const router = useRouter();  // <-- Add this

//   const [isLogin, setIsLogin] = useState(true);

//   const handleRedirect = () => {
//     router.push('/');  // Redirect to homepage
//   };

//   const LoginForm = () => {
//     return (
//       <div className="flex flex-col space-y-4">
//         <input
//           type="text"
//           placeholder="Email or Phone Number"
//           className="p-3 rounded bg-white shadow-lg"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="p-3 rounded bg-white shadow-lg"
//         />
//         <button className="p-3 rounded bg-white text-blue-600 shadow-lg">
//           Log In
//         </button>
//       </div>
//     );
//   };

//   const SignupForm = () => {
//     return (
//       <div className="flex flex-col space-y-4">
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="p-3 rounded bg-white shadow-lg"
//         />
//         <input
//           type="text"
//           placeholder="Email or Phone Number"
//           className="p-3 rounded bg-white shadow-lg"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="p-3 rounded bg-white shadow-lg"
//         />
//         <button className="p-3 rounded bg-white text-blue-600 shadow-lg">
//           Sign Up
//         </button>
//       </div>
//     );
//   };
  

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-6">
//     {isLogin ? <LoginForm /> : <SignupForm />}
//     <button
//       onClick={handleRedirect}  // <-- Change this to handleRedirect
//       className="p-3 rounded bg-white text-blue-600 shadow-lg"
//     >
//       {isLogin ? 'Log In' : 'Sign Up'}
//     </button>
//     <button
//       onClick={() => setIsLogin(!isLogin)}
//       className="text-white mt-4"
//     >
//       {isLogin ? 'New here? Sign up' : 'Already have an account? Log in'}
//     </button>
//   </div>
// );
// }

// export default LoginSignup;


// LoginSignup.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';


const LoginSignup = () => {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);

    const handleRedirect = () => {
        console.log('Redirecting...'); // This is to ensure our function is being called

        // router.push('/history');  // Redirect to homepage
        Router.push('/').then(() => window.location.reload());

    };

    const LoginForm = () => {
        return (
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Email or Phone Number"
                    className="p-3 rounded bg-white shadow-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded bg-white shadow-lg"
                />
            </div>
        );
    };

    const SignupForm = () => {
        return (
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="p-3 rounded bg-white shadow-lg"
                />
                <input
                    type="text"
                    placeholder="Email or Phone Number"
                    className="p-3 rounded bg-white shadow-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded bg-white shadow-lg"
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-6">
            {isLogin ? <LoginForm /> : <SignupForm />}
            <button
                onClick={handleRedirect}
                className="p-3 rounded bg-white text-blue-600 shadow-lg mt-4"
            >
                {isLogin ? 'Log In' : 'Sign Up'}
            </button>
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white mt-4"
            >
                {isLogin ? 'New here? Sign up' : 'Already have an account? Log in'}
            </button>
        </div>
    );
}

export default LoginSignup;

