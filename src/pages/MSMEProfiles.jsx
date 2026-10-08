import { useNavigate } from 'react-router-dom';
import ShopCard from '../components/ShopCard';
import { shops } from '../data/demoData';

export default function MSMEProfiles() {
  const navigate = useNavigate();

  const handleShopClick = (shop) => {
    navigate(`/profiles/${shop.id}`);
  };

  return (
    <div>
      <div className="page-title">
        <h1>MSME Profiles</h1>
        <p>View and manage shop & MSME records.</p>
      </div>

      <div className="shop-grid">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} onClick={handleShopClick} />
        ))}
      </div>
    </div>
  );
}
