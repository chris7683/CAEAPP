import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Account {
  id: string;
  type: 'checking' | 'savings' | 'business' | 'investment';
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  interestRate?: number;
  lastActivity: string;
}

interface AccountManagementScreenProps {
  onBack: () => void;
}

const AccountManagementScreen: React.FC<AccountManagementScreenProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'savings' | 'business'>('all');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccounts([
        {
          id: '1',
          type: 'checking',
          name: 'Primary Checking',
          accountNumber: '****1234',
          balance: 25000,
          currency: 'EGP',
          status: 'active',
          lastActivity: '2024-01-15',
        },
        {
          id: '2',
          type: 'savings',
          name: 'Emergency Fund',
          accountNumber: '****5678',
          balance: 50000,
          currency: 'EGP',
          status: 'active',
          interestRate: 12.5,
          lastActivity: '2024-01-14',
        },
        {
          id: '3',
          type: 'business',
          name: 'Business Account',
          accountNumber: '****9012',
          balance: 75000,
          currency: 'EGP',
          status: 'active',
          lastActivity: '2024-01-13',
        },
        {
          id: '4',
          type: 'investment',
          name: 'Investment Portfolio',
          accountNumber: '****3456',
          balance: 120000,
          currency: 'EGP',
          status: 'active',
          lastActivity: '2024-01-12',
        },
        {
          id: '5',
          type: 'savings',
          name: 'Vacation Fund',
          accountNumber: '****7890',
          balance: 15000,
          currency: 'EGP',
          status: 'frozen',
          interestRate: 10.0,
          lastActivity: '2024-01-10',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return 'account-balance';
      case 'savings': return 'savings';
      case 'business': return 'business';
      case 'investment': return 'trending-up';
      default: return 'account-balance';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking': return '#1e40af';
      case 'savings': return '#059669';
      case 'business': return '#dc2626';
      case 'investment': return '#7c3aed';
      default: return '#1e40af';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#059669';
      case 'frozen': return '#f59e0b';
      case 'closed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const filteredAccounts = accounts.filter(account => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return account.status === 'active';
    if (selectedFilter === 'savings') return account.type === 'savings';
    if (selectedFilter === 'business') return account.type === 'business';
    return true;
  });

  const totalBalance = accounts
    .filter(account => account.status === 'active')
    .reduce((sum, account) => sum + account.balance, 0);

  const handleAccountAction = (account: Account, action: string) => {
    Alert.alert(
      `${action} Account`,
      `Selected: ${account.name}\nAccount: ${account.accountNumber}`,
      [{ text: 'OK' }]
    );
  };

  const filters = [
    { key: 'all', label: 'All Accounts' },
    { key: 'active', label: 'Active' },
    { key: 'savings', label: 'Savings' },
    { key: 'business', label: 'Business' },
  ];

  if (isLoading) {
    return (
      <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <MaterialIcons name="account-balance" size={48} color="#fff" />
            <Text style={styles.loadingText}>Loading accounts...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadAccounts} />
          }
        >
          {/* Financial Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Financial Overview</Text>
              <View style={styles.overviewBadge}>
                <Text style={styles.overviewBadgeText}>
                  {accounts.filter(a => a.status === 'active').length} Active
                </Text>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(totalBalance, 'EGP')}
              </Text>
            </View>
            <View style={styles.overviewStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Checking</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(accounts.filter(a => a.type === 'checking' && a.status === 'active').reduce((sum, a) => sum + a.balance, 0), 'EGP')}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Savings</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(accounts.filter(a => a.type === 'savings' && a.status === 'active').reduce((sum, a) => sum + a.balance, 0), 'EGP')}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Investment</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(accounts.filter(a => a.type === 'investment' && a.status === 'active').reduce((sum, a) => sum + a.balance, 0), 'EGP')}
                </Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.key && styles.activeFilterButton,
                  ]}
                  onPress={() => setSelectedFilter(filter.key as any)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter.key && styles.activeFilterText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Accounts List */}
          <View style={styles.accountsContainer}>
            {filteredAccounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                    <View style={[styles.accountIcon, { backgroundColor: getAccountTypeColor(account.type) }]}>
                      <MaterialIcons name={getAccountIcon(account.type) as any} size={24} color="#fff" />
                    </View>
                    <View style={styles.accountDetails}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(account.status) }]} />
                        <Text style={styles.statusText}>{account.status.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.accountBalance}>
                    <Text style={styles.accountBalanceAmount}>
                      {formatCurrency(account.balance, account.currency)}
                    </Text>
                    {account.interestRate && (
                      <Text style={styles.interestRate}>
                        {account.interestRate}% APY
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.accountActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAccountAction(account, 'View Details')}
                  >
                    <MaterialIcons name="visibility" size={16} color="#1e40af" />
                    <Text style={styles.actionText}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAccountAction(account, 'Transfer')}
                  >
                    <MaterialIcons name="swap-horiz" size={16} color="#1e40af" />
                    <Text style={styles.actionText}>Transfer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAccountAction(account, 'Statement')}
                  >
                    <MaterialIcons name="description" size={16} color="#1e40af" />
                    <Text style={styles.actionText}>Statement</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAccountAction(account, 'Settings')}
                  >
                    <MaterialIcons name="settings" size={16} color="#1e40af" />
                    <Text style={styles.actionText}>Settings</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.lastActivity}>
                  Last activity: {account.lastActivity}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="add-card" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Open New Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="compare-arrows" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Account Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="download" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Export Statements</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="support-agent" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  overviewBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overviewBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterButton: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#1e40af',
  },
  accountsContainer: {
    paddingHorizontal: 20,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  accountBalanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  interestRate: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  actionText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  lastActivity: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 80,
  },
  quickActionText: {
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AccountManagementScreen;
