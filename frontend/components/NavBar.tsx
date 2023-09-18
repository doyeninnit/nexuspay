
  
import { FaHome, FaCog, FaHistory } from 'react-icons/fa';

// const Navbar = () => {
//   return (
//     <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4">
//       <div className="flex justify-between items-center px-6">

//         {/* Navigation Icons */}
//         <a href="#" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Home">
//           <FaHome size={28} />
//         </a>
//         <a href="/history" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Activity">
//           <FaHistory size={28} />
//         </a>
//         <a href="#" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Settings">
//           <FaCog size={28} />
//         </a>
//       </div>
//     </div>
//   );
// }

// export default Navbar;

const Navbar = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4 z-50">
        <div className="flex justify-between items-center px-6">
  
          {/* Navigation Icons */}
          <a href="/" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Home">
            <FaHome size={28} />
          </a>
          <a href="/history" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Activity">
            <FaHistory size={28} />
          </a>
          <a href="/settings" className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Settings">
            <FaCog size={28} />
          </a>
        </div>
      </div>
    );
  }
  
  export default Navbar;
  