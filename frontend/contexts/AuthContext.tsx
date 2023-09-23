

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  phoneNumber: string;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // User state
    const [user, setUser] = useState<User | null>(null);

    // On component mount, try to fetch user data from localStorage
    useEffect(() => {
        const storedPhoneNumber = localStorage.getItem('userPhone');
        if (storedPhoneNumber) {
            setUser({ phoneNumber: storedPhoneNumber });
        }
    }, []); // This effect runs only once after the component mounts, ensuring safe access to localStorage

    const login = (data: User) => {
        setUser(data);
        if (data.phoneNumber) {
            localStorage.setItem('userPhone', data.phoneNumber);
        }
        if (data.token) {
            localStorage.setItem('userToken', data.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
