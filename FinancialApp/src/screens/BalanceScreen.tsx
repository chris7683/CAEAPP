import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface BalanceScreenProps {
  onBack: () => void;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  lastUpdated: string;
}

const BalanceScreen: React.FC<BalanceScreenProps> = ({ onBack }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    // Simulate API call
    setTimeout(() => {
      setAccounts([
        {
          id: '1',
          name: 'Current Account',
          type: 'checking',
          balance: 125000.00,
          currency: 'EGP',
          lastUpdated: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Savings Account',
          type: 'savings',
          balance: 500000.00,
          currency: 'EGP',
          lastUpdated: '2024-01-15T10:30:00Z',
        },
        {
          id: '3',
          name: 'Credit Card',
          type: 'credit',
          balance: -15000.00,
          currency: 'EGP',
          lastUpdated: '2024-01-15T10:30:00Z',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return 'account-balance';
      case 'savings':
        return 'savings';
      case 'credit':
        return 'credit-card';
      default:
        return 'account-balance-wallet';
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking':
        return '#2196F3';
      case 'savings':
        return '#4CAF50';
      case 'credit':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1e3a8a', '#1e40af']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Balance</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Total Balance Card */}
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>
            {formatCurrency(totalBalance, 'USD')}
          </Text>
          <Text style={styles.lastUpdated}>
            Last updated: {formatDate(accounts[0]?.lastUpdated || new Date().toISOString())}
          </Text>
        </View>

        {/* Accounts List */}
        <View style={styles.accountsContainer}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={[styles.accountIcon, { backgroundColor: getAccountColor(account.type) }]}>
                  <MaterialIcons name={getAccountIcon(account.type) as any} size={24} color="#fff" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountType}>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                  </Text>
                </View>
                <View style={styles.accountBalance}>
                  <Text style={[
                    styles.balanceAmount,
                    { color: account.balance >= 0 ? '#4CAF50' : '#F44336' }
                  ]}>
                    {formatCurrency(account.balance, account.currency)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="add" size={24} color="#667eea" />
              <Text style={styles.actionText}>Add Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="history" size={24} color="#667eea" />
              <Text style={styles.actionText}>View History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="download" size={24} color="#667eea" />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Account Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Checking Accounts</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  accounts.filter(a => a.type === 'checking').reduce((sum, a) => sum + a.balance, 0),
                  'USD'
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Savings Accounts</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0),
                  'USD'
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Credit Cards</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  accounts.filter(a => a.type === 'credit').reduce((sum, a) => sum + a.balance, 0),
                  'USD'
                )}
              </Text>
            </View>
          </View>
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
    backgroundColor: '#1e3a8a',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  totalBalanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalBalanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  totalBalanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
  },
  accountsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  accountType: {
    fontSize: 13,
    color: '#666',
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  summaryContainer: {
    marginHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default BalanceScreen;

