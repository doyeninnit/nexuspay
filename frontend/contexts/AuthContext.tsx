

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  phoneNumber: string;
  token?: string;
  walletAddress?: string; // New field
}

interface AuthContextProps {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedPhoneNumber = localStorage.getItem('userPhone');
        const storedWalletAddress = localStorage.getItem('userWalletAddress'); // Fetch walletAddress from localStorage

        if (storedPhoneNumber) {
            setUser({ 
              phoneNumber: storedPhoneNumber,
              walletAddress: storedWalletAddress || undefined // Set walletAddress if exists
            });
        }
    }, []);

    const login = (data: User) => {
        setUser(data);
        console.log(data)
        if (data.phoneNumber) {
            localStorage.setItem('userPhone', data.phoneNumber);
        }

        if (data.token) {
            localStorage.setItem('userToken', data.token);
        }

        if (data.walletAddress) { // Save walletAddress to localStorage if exists
            localStorage.setItem('userWalletAddress', data.walletAddress);
        }

    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userWalletAddress'); // Clear walletAddress from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
