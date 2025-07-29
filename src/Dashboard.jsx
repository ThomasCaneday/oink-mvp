import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, writeBatch } from 'firebase/firestore';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pendingBalance, setPendingBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.publicAddress) {
        try {
          const userRef = doc(db, 'users', user.publicAddress);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setPendingBalance(userData.pendingBalance || 0);
            setPoints(userData.points || 0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const addFunds = async () => {
    const amount = parseFloat(addFundsAmount);
    if (amount >= 1 && user?.publicAddress) {
      try {
        const userRef = doc(db, 'users', user.publicAddress);
        const newPendingBalance = pendingBalance + amount;
        
        await updateDoc(userRef, {
          pendingBalance: newPendingBalance
        });
        
        setPendingBalance(newPendingBalance);
        setAddFundsAmount('');
      } catch (error) {
        console.error('Error adding funds:', error);
        alert('Error adding funds. Please try again.');
      }
    }
  };

  const handleInvestNow = async () => {
    if (pendingBalance < 20 || !user?.publicAddress) return;
    
    setIsInvesting(true);
    
    try {
      // In a real implementation, you would integrate with MoonPay here
      // For now, we'll simulate the investment process
      console.log('Initiating MoonPay widget for amount:', pendingBalance);
      
      // Simulate MoonPay transaction completion
      await simulateMoonPayTransaction();
      
    } catch (error) {
      console.error('Error during investment:', error);
      alert('Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  const simulateMoonPayTransaction = async () => {
    // Simulate MoonPay widget and transaction
    const confirmed = window.confirm(`Confirm investment of $${pendingBalance}?`);
    
    if (confirmed && user?.publicAddress) {
      const batch = writeBatch(db);
      const userRef = doc(db, 'users', user.publicAddress);
      
      // Calculate earned points
      const earnedPoints = Math.floor(pendingBalance / 10);
      
      // Record transaction
      const transactionRef = doc(collection(db, 'users', user.publicAddress, 'transactions'));
      batch.set(transactionRef, {
        amount: pendingBalance,
        type: 'investment',
        pointsEarned: earnedPoints,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
      
      // Update user balance and points
      batch.update(userRef, {
        pendingBalance: 0,
        points: points + earnedPoints
      });
      
      // Commit the batch
      await batch.commit();
      
      // Update local state
      setPendingBalance(0);
      setPoints(points + earnedPoints);
      
      alert(`Investment successful! You earned ${earnedPoints} points.`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Oink Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="balance-section">
          <div className="balance-card">
            <h2>Pending Balance</h2>
            <div className="balance-amount">${pendingBalance.toFixed(2)}</div>
          </div>
          
          <div className="points-card">
            <h2>Points</h2>
            <div className="points-amount">{points}</div>
          </div>
        </div>

        <div className="actions-section">
          <div className="add-funds-form">
            <h3>Add Funds</h3>
            <div className="form-group">
              <input
                type="number"
                min="1"
                step="0.01"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                placeholder="Enter amount ($1 minimum)"
                className="amount-input"
              />
              <button
                onClick={addFunds}
                disabled={!addFundsAmount || parseFloat(addFundsAmount) < 1}
                className="add-funds-btn"
              >
                Add Funds
              </button>
            </div>
          </div>

          <div className="invest-section">
            <button
              onClick={handleInvestNow}
              disabled={pendingBalance < 20 || isInvesting}
              className={`invest-btn ${pendingBalance >= 20 ? 'enabled' : 'disabled'}`}
            >
              {isInvesting ? 'Processing...' : 'Invest Now'}
            </button>
            {pendingBalance < 20 && (
              <p className="invest-requirement">
                Minimum $20 required to invest (Current: ${pendingBalance.toFixed(2)})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
