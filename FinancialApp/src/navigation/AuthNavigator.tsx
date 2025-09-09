import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LandingScreen from '../screens/LandingScreen';
import BalanceScreen from '../screens/BalanceScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import TransferScreen from '../screens/TransferScreen';
import BillsScreen from '../screens/BillsScreen';
import AccountManagementScreen from '../screens/AccountManagementScreen';
import BudgetTrackerScreen from '../screens/BudgetTrackerScreen';
import SavingsGoalsScreen from '../screens/SavingsGoalsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import apiService from '../services/api';

const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'landing' | 'balance' | 'transactions' | 'transfer' | 'bills' | 'account-management' | 'budget-tracker' | 'savings-goals' | 'notifications' | 'settings'>('login');
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

  const navigateToAccountManagement = () => {
    setCurrentScreen('account-management');
  };

  const navigateToBudgetTracker = () => {
    setCurrentScreen('budget-tracker');
  };

  const navigateToSavingsGoals = () => {
    setCurrentScreen('savings-goals');
  };

  const navigateToNotifications = () => {
    setCurrentScreen('notifications');
  };

  const navigateToSettings = () => {
    setCurrentScreen('settings');
  };

  const navigateBack = () => {
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (currentScreen === 'landing') {
    return (
      <View style={styles.container}>
        <LandingScreen 
          onLogout={handleLogout}
          onNavigateToBalance={navigateToBalance}
          onNavigateToTransactions={navigateToTransactions}
          onNavigateToTransfer={navigateToTransfer}
          onNavigateToBills={navigateToBills}
          onNavigateToAccountManagement={navigateToAccountManagement}
          onNavigateToBudgetTracker={navigateToBudgetTracker}
          onNavigateToSavingsGoals={navigateToSavingsGoals}
          onNavigateToNotifications={navigateToNotifications}
          onNavigateToSettings={navigateToSettings}
        />
      </View>
    );
  }

  if (currentScreen === 'balance') {
    return (
      <View style={styles.container}>
        <BalanceScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'transactions') {
    return (
      <View style={styles.container}>
        <TransactionsScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'transfer') {
    return (
      <View style={styles.container}>
        <TransferScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'bills') {
    return (
      <View style={styles.container}>
        <BillsScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'account-management') {
    return (
      <View style={styles.container}>
        <AccountManagementScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'budget-tracker') {
    return (
      <View style={styles.container}>
        <BudgetTrackerScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'savings-goals') {
    return (
      <View style={styles.container}>
        <SavingsGoalsScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'notifications') {
    return (
      <View style={styles.container}>
        <NotificationsScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'settings') {
    return (
      <View style={styles.container}>
        <SettingsScreen onBack={navigateBack} />
      </View>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <View style={styles.container}>
        <SignUpScreen onNavigateToLogin={navigateToLogin} onSignUpSuccess={handleLoginSuccess} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoginScreen onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLoginSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
  },
});

export default AuthNavigator;
