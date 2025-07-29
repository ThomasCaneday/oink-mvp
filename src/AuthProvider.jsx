import React, { createContext, useContext, useState, useEffect } from 'react';
import { Magic } from 'magic-sdk';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// Initialize Magic with your publishable API key
const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const metadata = await magic.user.getMetadata();
          setUser(metadata);
          
          // Create user document in Firestore if it doesn't exist
          if (metadata.publicAddress) {
            const userRef = doc(db, 'users', metadata.publicAddress);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
              await setDoc(userRef, {
                email: metadata.email,
                publicAddress: metadata.publicAddress,
                pendingBalance: 0,
                points: 0,
                createdAt: new Date().toISOString()
              });
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email) => {
    try {
      setLoading(true);
      await magic.auth.loginWithMagicLink({ email });
      const metadata = await magic.user.getMetadata();
      setUser(metadata);
      
      // Create user document in Firestore if it doesn't exist
      if (metadata.publicAddress) {
        const userRef = doc(db, 'users', metadata.publicAddress);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: metadata.email,
            publicAddress: metadata.publicAddress,
            pendingBalance: 0,
            points: 0,
            createdAt: new Date().toISOString()
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await magic.user.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
