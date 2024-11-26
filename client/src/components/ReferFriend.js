import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLeftNav from './DashboardLeftNav';
import '../styles/refer-friend.css';

const ReferFriend = () => {
  const navigate = useNavigate();

  // Navigate function for users to refer friends
  const handleReferral = () => {
    // Adjusted to match the route you want to navigate to
    navigate('/refer-link');  // This should be the actual page where the referral link is displayed
  };

  return (
    <div className="refer-friend-dashboard-container">
      <DashboardLeftNav /> {/* Include the DashboardLeftNav on the left side */}
      
      <div className="refer-friend-main-content">
        <h1 className="refer-friend-header">Invite and Earn Rewards</h1>
        <p className="refer-friend-subtitle">
          Invite your friends to join us, and you'll both earn rewards when they make their first purchase!
        </p>

        <div className="refer-friend-card">
          <div className="refer-friend-card-image"></div>
          <div className="refer-friend-card-content">
            <h2 className="refer-friend-title">How it Works</h2>
            <p className="refer-friend-description">
              Invite your friends via email or social media, and when they make their first purchase, both of you will
              earn rewards. It's that simple!
            </p>
            <button className="refer-friend-btn" onClick={handleReferral}>Start Referring Now</button>
          </div>
        </div>

        <div className="refer-friend-info">
          <h3 className="refer-friend-info-title">Your Rewards</h3>
          <p className="refer-friend-info-text">
            For every successful referral, you’ll earn 10% of their purchase amount in credits! Plus, they get 10% off
            their first order.
          </p>
        </div>

        <div className="refer-friend-reward-container">
          <div className="refer-friend-reward">
            <img
              className="refer-friend-reward-icon"
              src="https://via.placeholder.com/50"
              alt="Customer Reward Icon"
            />
            <h3 className="refer-friend-reward-title">Customer Reward</h3>
            <p className="refer-friend-reward-description">
              You get 10% of the purchase amount as credits for your next order.
            </p>
          </div>

          <div className="refer-friend-reward">
            <img
              className="refer-friend-reward-icon"
              src="https://via.placeholder.com/50"
              alt="Singer Reward Icon"
            />
            <h3 className="refer-friend-reward-title">Singer Reward</h3>
            <p className="refer-friend-reward-description">
              As a singer, you’ll also earn 10% of the purchase amount as credits for your next order when your referred
              friends make a purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;
