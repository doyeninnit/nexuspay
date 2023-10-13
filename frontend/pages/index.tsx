// import CryptoBalance from '../components/CryptoBalance';
// import PrimaryActions from '../components/PrimaryActions';
// import OnRamp from '../components/OnRamp';
// import Layout from '../components/Layout';


// const Home = () => {
//   return (
//     <Layout>

//     <div className="flex flex-col h-screen">
//       <div className="flex-1 overflow-y-auto">
//         <CryptoBalance />
//         <OnRamp />
//         <PrimaryActions />
//       </div>
//     </div>
//     </Layout>

//   );
// }

// export default Home;
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '../contexts/AuthContext';
// import CryptoBalance from '../components/CryptoBalance';
// import PrimaryActions from '../components/PrimaryActions';
// import OnRamp from '../components/OnRamp';
// import Layout from '../components/Layout';

// const Home = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   // Guard: Ensure user is authenticated
//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//     }
//   }, [user]);

//   return (
//     <Layout>
//       <div className="flex flex-col h-screen">
//         <div className="flex-1 overflow-y-auto">
//           <CryptoBalance />
//           <OnRamp />
//           <PrimaryActions />
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default Home;

import CryptoBalance from '../components/CryptoBalance';
import PrimaryActions from '../components/PrimaryActions';
import OnRamp from '../components/OnRamp';
import Layout from '../components/Layout';

const Home = () => {
    return (
            <div className="flex flex-col h-screen">
                <div className="flex-1 overflow-y-auto">
                    <CryptoBalance />
                    <OnRamp />
                    <PrimaryActions />
                </div>
            </div>
    );
}

export default Home;
