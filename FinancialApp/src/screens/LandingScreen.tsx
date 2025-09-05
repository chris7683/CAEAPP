import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import apiService from '../services/api';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  onLogout: () => void;
  onNavigateToBalance: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToTransfer: () => void;
  onNavigateToBills: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ 
  onLogout, 
  onNavigateToBalance, 
  onNavigateToTransactions, 
  onNavigateToTransfer, 
  onNavigateToBills 
}) => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    username: string;
    phoneNumber?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const token = await apiService.getStoredToken();
      if (token) {
        // In a real app, you'd make an API call to get user info
        // For now, we'll use the stored data from login/signup
        setUserInfo({
          email: 'user@example.com', // This would come from API
          username: 'User',
          phoneNumber: '+1234567890'
        });
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await apiService.removeStoredToken();
            onLogout();
          },
        },
      ]
    );
  };

  const quickActions = [
    {
      title: 'View Balance',
      icon: 'account-balance-wallet',
      color: '#4CAF50',
      onPress: onNavigateToBalance,
    },
    {
      title: 'Transactions',
      icon: 'history',
      color: '#2196F3',
      onPress: onNavigateToTransactions,
    },
    {
      title: 'Transfer Money',
      icon: 'send',
      color: '#FF9800',
      onPress: onNavigateToTransfer,
    },
    {
      title: 'Pay Bills',
      icon: 'receipt',
      color: '#9C27B0',
      onPress: onNavigateToBills,
    },
  ];

  const offers = [
    {
      id: '1',
      title: 'Personal Loan',
      description: 'Get up to EGP 500,000 with competitive rates',
      icon: 'money',
      color: '#4CAF50',
      discount: '5.9% APR',
      validUntil: '2024-03-31',
    },
    {
      id: '2',
      title: 'Credit Card',
      description: 'Zero annual fee for first year',
      icon: 'credit-card',
      color: '#2196F3',
      discount: '0% Fee',
      validUntil: '2024-02-28',
    },
    {
      id: '3',
      title: 'Savings Account',
      description: 'Earn 15% interest on new deposits',
      icon: 'savings',
      color: '#FF9800',
      discount: '15% APY',
      validUntil: '2024-04-15',
    },
    {
      id: '4',
      title: 'Investment Fund',
      description: 'Start investing with EGP 1,000 minimum',
      icon: 'trending-up',
      color: '#9C27B0',
      discount: 'No Fees',
      validUntil: '2024-06-30',
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to EgyptBank!</Text>
            <Text style={styles.userName}>{userInfo?.username || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Account Info Card */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <MaterialIcons name="account-circle" size={40} color="#667eea" />
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{userInfo?.username || 'User'}</Text>
              <Text style={styles.accountEmail}>{userInfo?.email || 'user@example.com'}</Text>
              {userInfo?.phoneNumber && (
                <Text style={styles.accountPhone}>{userInfo.phoneNumber}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <MaterialIcons name={action.icon as any} size={28} color="#fff" />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <MaterialIcons name="info" size={24} color="#667eea" />
            <Text style={styles.activityText}>
              No recent activity. Start by exploring the quick actions above!
            </Text>
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.offersContainer}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScrollContent}
          >
            {offers.map((offer) => (
              <TouchableOpacity key={offer.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <View style={[styles.offerIcon, { backgroundColor: offer.color }]}>
                    <MaterialIcons name={offer.icon as any} size={24} color="#fff" />
                  </View>
                  <View style={styles.offerDiscount}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>
                </View>
                <View style={styles.offerContent}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                  <Text style={styles.offerValidUntil}>Valid until {offer.validUntil}</Text>
                </View>
                <TouchableOpacity style={styles.offerButton}>
                  <Text style={styles.offerButtonText}>Learn More</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>EgyptBank</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Your personal finance management companion
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  accountCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountInfo: {
    marginLeft: 16,
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  accountPhone: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivityContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  offersContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  offersScrollContent: {
    paddingRight: 16,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerDiscount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  offerContent: {
    marginBottom: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  offerValidUntil: {
    fontSize: 11,
    color: '#999',
  },
  offerButton: {
    backgroundColor: '#667eea',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LandingScreen;
