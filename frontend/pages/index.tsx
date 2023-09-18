import CryptoBalance from '../components/CryptoBalance';
import PrimaryActions from '../components/PrimaryActions';
import OnRamp from '../components/OnRamp';

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
