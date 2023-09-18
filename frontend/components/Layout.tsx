// components/Layout.tsx
import Header from './Header';
import NavBar from './NavBar';

type LayoutProps = {
    children: React.ReactNode;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        {children}
        {/* <NavBar /> */}
      </div>
    );
  }
  

export default Layout;
