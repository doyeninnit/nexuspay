// components/Layout.tsx
import Header from './Header';
import NavBar from './NavBar';
import LoginSignup from './LoginSignup';
// import { useAuth } from '@/pages/AuthContext';

type LayoutProps = {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    // const { isAuthenticated } = useAuth();

    // if (!isAuthenticated) {
    //   return <LoginSignup />;
    // }
    return (
        <div className="bg-black min-h-screen text-white">
            <div className="flex flex-col h-screen">
                <div className="flex-grow">
                    <Header />
                    {children}
                    <NavBar />
                </div>
            </div>
            </div>
            );
  }


  

export default Layout;
