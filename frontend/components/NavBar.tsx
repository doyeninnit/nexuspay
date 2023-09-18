// // components/NavBar.tsx

// const NavBar = () => {
//     return (
//       <nav className="bg-gradient-to-r from-black to-blue-900 fixed bottom-0 w-full p-4">
//         <div className="container mx-auto flex justify-around items-center">
//           {/* Add your navigation items here */}
//         </div>
//       </nav>
//     );
//   }
  
//   export default NavBar;
  
// components/Navbar.tsx

const Navbar = () => {
    return (
    //   <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4">
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4">
        <div className="space-x-4">
          {/* Replace these with icons or more detailed links later */}
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">Profile</a>
          <a href="#" className="text-white">Settings</a>
        </div>
      </div>
    );
  }
  
  export default Navbar;
  