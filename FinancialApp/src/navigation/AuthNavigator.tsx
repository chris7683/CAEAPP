import React, { useState, useEffect } from 'react';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LandingScreen from '../screens/LandingScreen';
import BalanceScreen from '../screens/BalanceScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import TransferScreen from '../screens/TransferScreen';
import BillsScreen from '../screens/BillsScreen';
import apiService from '../services/api';

const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'landing' | 'balance' | 'transactions' | 'transfer' | 'bills'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await apiService.isAuthenticated();
      if (authenticated) {
        setCurrentScreen('landing');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('landing');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const navigateToBalance = () => {
    setCurrentScreen('balance');
  };

  const navigateToTransactions = () => {
    setCurrentScreen('transactions');
  };

  const navigateToTransfer = () => {
    setCurrentScreen('transfer');
  };

  const navigateToBills = () => {
    setCurrentScreen('bills');
  };

  const navigateBack = () => {
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return null; // You could show a loading screen here
  }

  if (currentScreen === 'landing') {
    return (
      <LandingScreen 
        onLogout={handleLogout}
        onNavigateToBalance={navigateToBalance}
        onNavigateToTransactions={navigateToTransactions}
        onNavigateToTransfer={navigateToTransfer}
        onNavigateToBills={navigateToBills}
      />
    );
  }

  if (currentScreen === 'balance') {
    return <BalanceScreen onBack={navigateBack} />;
  }

  if (currentScreen === 'transactions') {
    return <TransactionsScreen onBack={navigateBack} />;
  }

  if (currentScreen === 'transfer') {
    return <TransferScreen onBack={navigateBack} />;
  }

  if (currentScreen === 'bills') {
    return <BillsScreen onBack={navigateBack} />;
  }

  if (currentScreen === 'signup') {
    return <SignUpScreen onNavigateToLogin={navigateToLogin} onSignUpSuccess={handleLoginSuccess} />;
  }

  return <LoginScreen onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLoginSuccess} />;
};

export default AuthNavigator;
