import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import apiService, { Transaction } from '../services/api';

const { width, height } = Dimensions.get('window');

interface TransactionsScreenProps {
  onBack: () => void;
}

// Transaction interface is now imported from api.ts

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const transactionsData = await apiService.getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return 'restaurant';
      case 'Income':
        return 'trending-up';
      case 'Utilities':
        return 'flash-on';
      case 'Transfer':
        return 'swap-horiz';
      case 'Shopping':
        return 'shopping-bag';
      case 'Transportation':
        return 'directions-car';
      default:
        return 'receipt';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit':
        return '#4CAF50';
      case 'debit':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
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
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.txnType.toLowerCase() === selectedFilter;
  });

  const totalIncome = transactions
    .filter(t => t.txnType.toLowerCase() === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.txnType.toLowerCase() === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item.txnType) }]}>
          <MaterialIcons name="receipt" size={20} color="#fff" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionAccount}>Account ID: {item.accountId}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { color: item.txnType.toLowerCase() === 'credit' ? '#4CAF50' : '#F44336' }
          ]}>
            {formatCurrency(item.amount, 'EGP')}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.statusText}>completed</Text>
          </View>
        </View>
      </View>
      <Text style={styles.transactionDate}>{formatDate(item.occurredAt)}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading transactions...</Text>
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
          <Text style={styles.headerTitle}>Transactions</Text>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="filter-list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Credit</Text>
            <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
              {formatCurrency(totalIncome, 'EGP')}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Debit</Text>
            <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
              {formatCurrency(totalExpenses, 'EGP')}
            </Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'credit' && styles.activeFilter]}
            onPress={() => setSelectedFilter('credit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'credit' && styles.activeFilterText]}>
              Credit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'debit' && styles.activeFilter]}
            onPress={() => setSelectedFilter('debit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'debit' && styles.activeFilterText]}>
              Debit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'all' ? 'All Transactions' : 
             selectedFilter === 'credit' ? 'Credit Transactions' : 'Debit Transactions'}
          </Text>
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
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
  headerFilterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#1e40af',
  },
  transactionsContainer: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  transactionAccount: {
    fontSize: 11,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 11,
    color: '#999',
    marginLeft: 46,
  },
});

export default TransactionsScreen;

