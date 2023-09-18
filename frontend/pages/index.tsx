import CryptoBalance from '../components/CryptoBalance';
import PrimaryActions from '../components/PrimaryActions';
import TransactionsHistory from '../components/TransactionsHistory';
import OnRamp from '../components/OnRamp';
import WalletAddress from '../components/WalletAddress';
import Navbar from '../components/NavBar';

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">

      <CryptoBalance />
      <OnRamp />
      {/* <WalletAddress /> */}
      <PrimaryActions />
      <TransactionsHistory />
    </div>
    <Navbar />

    </div>
  );
}

export default Home;
