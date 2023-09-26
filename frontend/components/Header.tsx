

// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//     const { user } = useAuth();

//     return (
//       <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-center">
//             <div className="text-white font-bold">NexusPay</div>

//             {/* Check if the user exists and display the phoneNumber and walletAddress */}
//             {user ? (
//               <div className="text-white">
//                 <div>Phone: {user.phoneNumber}</div>
//                 {user.walletAddress && <div>Wallet: {user.walletAddress}</div>}
//               </div>
//             ) : (
//               <div className="text-white">Account</div>
//             )}
//           </div>
//         </div>
//       </header>
//     );
// }

// export default Header;

import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-black to-purple-900 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold">
            <img src="/icon-192x192.png" alt="NexusPay Logo" className="w-6 h-6 inline-block mr-2" />
            Afpay                    </div>

          {user ? (
            <div className="text-white flex items-center space-x-4">
              <span>Hello, User</span> {/* Assuming user object has firstName */}
              <button >
                Logout
              </button>
              {/* Or a dropdown menu with more account options */}
            </div>
          ) : (
            <div className="text-white">
              Account
              {/* Links to login or register if user isn't logged in */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;


