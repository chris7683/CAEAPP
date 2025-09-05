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

const { width, height } = Dimensions.get('window');

interface BillsScreenProps {
  onBack: () => void;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: string;
  status: 'paid' | 'pending' | 'overdue';
  isRecurring: boolean;
  company: string;
  account: string;
}

const BillsScreen: React.FC<BillsScreenProps> = ({ onBack }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    // Simulate API call
    setTimeout(() => {
      setBills([
        {
          id: '1',
          name: 'Electricity Bill',
          amount: 350.00,
          currency: 'EGP',
          dueDate: '2024-01-20T00:00:00Z',
          category: 'Utilities',
          status: 'pending',
          isRecurring: true,
          company: 'Egyptian Electricity',
          account: 'Current Account',
        },
        {
          id: '2',
          name: 'Internet Bill',
          amount: 200.00,
          currency: 'EGP',
          dueDate: '2024-01-15T00:00:00Z',
          category: 'Utilities',
          status: 'paid',
          isRecurring: true,
          company: 'WE Internet',
          account: 'Current Account',
        },
        {
          id: '3',
          name: 'Credit Card Payment',
          amount: 1500.00,
          currency: 'EGP',
          dueDate: '2024-01-10T00:00:00Z',
          category: 'Credit',
          status: 'overdue',
          isRecurring: true,
          company: 'CIB Bank',
          account: 'Current Account',
        },
        {
          id: '4',
          name: 'Mobile Bill',
          amount: 150.00,
          currency: 'EGP',
          dueDate: '2024-01-25T00:00:00Z',
          category: 'Utilities',
          status: 'pending',
          isRecurring: true,
          company: 'Vodafone',
          account: 'Current Account',
        },
        {
          id: '5',
          name: 'Car Insurance',
          amount: 800.00,
          currency: 'EGP',
          dueDate: '2024-01-30T00:00:00Z',
          category: 'Insurance',
          status: 'pending',
          isRecurring: true,
          company: 'Allianz Egypt',
          account: 'Current Account',
        },
        {
          id: '6',
          name: 'Gym Membership',
          amount: 300.00,
          currency: 'EGP',
          dueDate: '2024-01-12T00:00:00Z',
          category: 'Entertainment',
          status: 'paid',
          isRecurring: true,
          company: 'Gold\'s Gym',
          account: 'Current Account',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBills();
    setRefreshing(false);
  };

  const getBillIcon = (category: string) => {
    switch (category) {
      case 'Utilities':
        return 'flash-on';
      case 'Credit':
        return 'credit-card';
      case 'Insurance':
        return 'security';
      case 'Entertainment':
        return 'sports';
      case 'Healthcare':
        return 'local-hospital';
      default:
        return 'receipt';
    }
  };

  const getBillColor = (category: string) => {
    switch (category) {
      case 'Utilities':
        return '#2196F3';
      case 'Credit':
        return '#FF9800';
      case 'Insurance':
        return '#4CAF50';
      case 'Entertainment':
        return '#9C27B0';
      case 'Healthcare':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'overdue':
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
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const filteredBills = bills.filter(bill => {
    if (selectedFilter === 'all') return true;
    return bill.status === selectedFilter;
  });

  const totalPending = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalOverdue = bills
    .filter(bill => bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const handlePayBill = (bill: Bill) => {
    // In a real app, this would initiate payment
    Alert.alert(
      'Pay Bill',
      `Pay ${formatCurrency(bill.amount, bill.currency)} to ${bill.company}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            // Update bill status
            setBills(prevBills =>
              prevBills.map(b =>
                b.id === bill.id ? { ...b, status: 'paid' as const } : b
              )
            );
            Alert.alert('Success', 'Bill paid successfully!');
          },
        },
      ]
    );
  };

  const renderBill = ({ item }: { item: Bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={[styles.billIcon, { backgroundColor: getBillColor(item.category) }]}>
          <MaterialIcons name={getBillIcon(item.category) as any} size={20} color="#fff" />
        </View>
        <View style={styles.billInfo}>
          <Text style={styles.billName}>{item.name}</Text>
          <Text style={styles.billCompany}>{item.company}</Text>
          <Text style={styles.billAccount}>{item.account}</Text>
        </View>
        <View style={styles.billAmount}>
          <Text style={styles.amountText}>
            {formatCurrency(item.amount, item.currency)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.billFooter}>
        <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
        {item.isRecurring && (
          <View style={styles.recurringBadge}>
            <MaterialIcons name="repeat" size={12} color="#667eea" />
            <Text style={styles.recurringText}>Recurring</Text>
          </View>
        )}
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => handlePayBill(item)}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading bills...</Text>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bills</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pending Bills</Text>
            <Text style={[styles.summaryAmount, { color: '#FF9800' }]}>
              {formatCurrency(totalPending, 'USD')}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overdue</Text>
            <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
              {formatCurrency(totalOverdue, 'USD')}
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
            style={[styles.filterButton, selectedFilter === 'pending' && styles.activeFilter]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[styles.filterText, selectedFilter === 'pending' && styles.activeFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'paid' && styles.activeFilter]}
            onPress={() => setSelectedFilter('paid')}
          >
            <Text style={[styles.filterText, selectedFilter === 'paid' && styles.activeFilterText]}>
              Paid
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'overdue' && styles.activeFilter]}
            onPress={() => setSelectedFilter('overdue')}
          >
            <Text style={[styles.filterText, selectedFilter === 'overdue' && styles.activeFilterText]}>
              Overdue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bills List */}
        <View style={styles.billsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'all' ? 'All Bills' : 
             selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1) + ' Bills'}
          </Text>
          <FlatList
            data={filteredBills}
            renderItem={renderBill}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="add" size={24} color="#667eea" />
              <Text style={styles.actionText}>Add Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="schedule" size={24} color="#667eea" />
              <Text style={styles.actionText}>Auto Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="history" size={24} color="#667eea" />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
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
    color: '#667eea',
  },
  billsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  billCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  billAccount: {
    fontSize: 12,
    color: '#999',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  billFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recurringText: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 4,
  },
  payButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  payButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default BillsScreen;

