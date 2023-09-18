// components/Header.tsx

const Header = () => {
    return (
      <header className="bg-gradient-to-r from-black to-purple-900 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold">Logo</div>
            <div className="text-white">Notifications</div>
          </div>
        </div>
      </header>
    );
  }
  
  export default Header;
  