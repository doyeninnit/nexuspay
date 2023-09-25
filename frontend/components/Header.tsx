// components/Header.tsx

// const Header = () => {
//     return (
//       <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-center">
//             <div className="text-white font-bold">NexusPay</div>
//             <div className="text-white">Notifications</div>
//           </div>
//         </div>
//       </header>
//     );
//   }
  
//   export default Header;
  
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user } = useAuth();

    return (
      <header className="bg-gradient-to-r from-black to-purple-900 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold">NexusPay</div>
            
            {/* Check if the user exists and display the phoneNumber and walletAddress */}
            {user ? (
              <div className="text-white">
                <div>Phone: {user.phoneNumber}</div>
                {user.walletAddress && <div>Wallet: {user.walletAddress}</div>}
              </div>
            ) : (
              <div className="text-white">Account</div>
            )}
          </div>
        </div>
      </header>
    );
}

export default Header;
