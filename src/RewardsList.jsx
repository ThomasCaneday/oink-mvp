import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const mockRewards = [
  { id: 1, name: 'Coffee Gift Card', cost: 50, description: '$5 Starbucks Gift Card' },
  { id: 2, name: 'Movie Ticket', cost: 100, description: 'Free movie ticket' },
  { id: 3, name: 'Pizza Voucher', cost: 150, description: '$10 Pizza Hut voucher' },
  { id: 4, name: 'Amazon Gift Card', cost: 200, description: '$20 Amazon Gift Card' },
  { id: 5, name: 'Gas Card', cost: 250, description: '$25 Shell Gas Card' },
  { id: 6, name: 'Restaurant Meal', cost: 300, description: '$30 Restaurant voucher' }
];

const RewardsList = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState({});

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user?.publicAddress) {
        try {
          const userRef = doc(db, 'users', user.publicAddress);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setPoints(userData.points || 0);
          }
        } catch (error) {
          console.error('Error fetching user points:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPoints();
  }, [user]);

  const redeemReward = async (reward) => {
    if (points < reward.cost || !user?.publicAddress) return;
    
    setRedeeming(prev => ({ ...prev, [reward.id]: true }));
    
    try {
      const userRef = doc(db, 'users', user.publicAddress);
      const newPoints = points - reward.cost;
      
      await updateDoc(userRef, {
        points: newPoints
      });
      
      setPoints(newPoints);
      alert(`Successfully redeemed: ${reward.name}!`);
      
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Error redeeming reward. Please try again.');
    } finally {
      setRedeeming(prev => ({ ...prev, [reward.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="rewards-container">
        <div className="loading">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <h2>Rewards Store</h2>
        <div className="user-points">
          <span className="points-label">Your Points:</span>
          <span className="points-value">{points}</span>
        </div>
      </div>
      
      <div className="rewards-grid">
        {mockRewards.map(reward => (
          <div key={reward.id} className="reward-card">
            <div className="reward-info">
              <h3 className="reward-name">{reward.name}</h3>
              <p className="reward-description">{reward.description}</p>
              <div className="reward-cost">
                <span className="cost-label">Cost:</span>
                <span className="cost-value">{reward.cost} points</span>
              </div>
            </div>
            
            <button
              onClick={() => redeemReward(reward)}
              disabled={points < reward.cost || redeeming[reward.id]}
              className={`redeem-btn ${points >= reward.cost ? 'available' : 'unavailable'}`}
            >
              {redeeming[reward.id] ? 'Redeeming...' : 
               points >= reward.cost ? 'Redeem' : 'Not Enough Points'}
            </button>
          </div>
        ))}
      </div>
      
      {points === 0 && (
        <div className="no-points-message">
          <p>Start investing to earn points and unlock rewards!</p>
        </div>
      )}
    </div>
  );
};

export default RewardsList;
