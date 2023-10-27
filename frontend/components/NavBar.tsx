
import Link from 'next/link';
import { FaHome, FaHistory, FaCog, FaEnvelope } from 'react-icons/fa';  // <-- Import the FaEnvelope icon

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4 z-50">
      <div className="flex justify-between items-center px-6">

        {/* Navigation Icons */}
        <Link href="/">
          <span className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Home">
            <FaHome size={28} />
          </span>
        </Link>
        <Link href="/history">
          <span className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Activity">
            <FaHistory size={28} />
          </span>
        </Link>
        <Link href="/messagint">   {/* Messaging Route */}
          <span className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Messaging">
            <FaEnvelope size={28} />  {/* Messaging Icon */}
          </span>
        </Link>
        <Link href="/settings">
          <span className="text-white p-2 hover:bg-purple-500 rounded" aria-label="Settings">
            <FaCog size={28} />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
