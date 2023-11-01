

// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; // Import the icons you want to use
// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//     const { user } = useAuth();

//     return (
//         <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//             <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <div className="text-white font-bold">
//                         Welcome, Anon
//                     </div>

//                     {user ? (
//                         <div className="text-white flex items-center space-x-4">
//                             <MdNotifications size={24} /> {/* Notification Icon */}
//                             <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//                             {/* You can wrap the above icons in buttons or links if needed */}
//                         </div>
//                     ) : null}
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;


import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; 
import { useAuth } from '../contexts/AuthContext';
import QRScanner from './QRScanner'; // Make sure to import the scanner component
import { useState } from 'react';

const Header = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);

  return (
    <header className="bg-gradient-to-r from-black to-purple-900 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold">
            Welcome, Anon
          </div>

          {/* {user ? ( */}
            <div className="text-white flex items-center space-x-4">
              <MdNotifications size={24} /> {/* Notification Icon */}
              <button onClick={() => setShowScanner(!showScanner)}>
                <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
              </button>
              {showScanner && <QRScanner />}
            </div>
          {/* ) : null} */}
        </div>
      </div>
    </header>
  );
}

export default Header;
