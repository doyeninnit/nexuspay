

// components/Layout.tsx
import Header from './Header';
import NavBar from './NavBar';
import { useAuth } from '../contexts/AuthContext';
import Register from '../components/Register';
import Login from '../components/Login';
import { useState } from 'react';

type LayoutProps = {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const [showLogin, setShowLogin] = useState(true); 

    const handleToggleView = () => {
        setShowLogin(!showLogin);
    };

    if (!user) {
        return (
            <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600">
                {showLogin ? (
                    <Login  />
                ) : (
                    <Register toggleView={handleToggleView} />
                )}
            </div>
        );
    }

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
