import React, { createContext, useContext, useState } from 'react';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: () => void;
//   logout: () => void;
// }

// interface AuthProviderProps {
//     children: React.ReactNode;
//   }
  

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false); // Assuming users are not authenticated by default

//   const login = () => {
//     // Here you can integrate your actual authentication logic
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     // Here you can handle logging out
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
