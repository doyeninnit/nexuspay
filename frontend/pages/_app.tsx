
// import Layout from '../components/Layout';
// import type { AppProps /*, AppContext */ } from 'next/app';
// import '@/styles/globals.css'
// import { AuthProvider } from './AuthContext';

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <AuthProvider>

//     <Layout>
//       <div className="pb-16">

//         <Component {...pageProps} />
//       </div>
//     </Layout>
//     </AuthProvider>

//   );
// }

// export default MyApp;

// pages/_app.tsx

import Layout from '../components/Layout';
import type { AppProps } from 'next/app';
import '@/styles/globals.css'
// import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginSignup from '../components/LoginSignup'; 
// import { RegistrationProvider } from '@/contexts/RegistrationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import '../utils/fontawesome';  // Adjust the path based on where you placed the fontawesome.ts file
import "@fortawesome/fontawesome-svg-core/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  // const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <AuthProvider>
      <Layout>
        <div className="pb-16">
          <Component {...pageProps} />
        </div>
      </Layout>
      </AuthProvider>

  );
}

export default MyApp;
