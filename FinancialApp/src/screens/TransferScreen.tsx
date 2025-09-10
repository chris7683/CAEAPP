import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import apiService, { Account, TransferRequest } from '../services/api';

const { width, height } = Dimensions.get('window');

interface TransferScreenProps {
  onBack: () => void;
}

// Account interface is now imported from api.ts

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const TransferScreen: React.FC<TransferScreenProps> = ({ onBack }) => {
  const [fromAccount, setFromAccount] = useState<Account | null>(null);
  const [toAccount, setToAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingAccounts(true);
      const accountsData = await apiService.getAccounts();
      setAccounts(accountsData);

      // Mock contacts for external transfers
      setContacts([
        {
          id: '1',
          name: 'Ahmed Hassan',
          phone: '+20 10 1234 5678',
          email: 'ahmed@example.com',
        },
        {
          id: '2',
          name: 'Fatma Ali',
          phone: '+20 12 9876 5432',
          email: 'fatma@example.com',
        },
        {
          id: '3',
          name: 'Mohamed Ibrahim',
          phone: '+20 11 4567 8901',
          email: 'mohamed@example.com',
        },
      ]);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', 'Failed to load accounts. Please try again.');
    } finally {
      setLoadingAccounts(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (transferAmount > fromAccount.balance) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }

    if (fromAccount.id === toAccount.id) {
      Alert.alert('Error', 'Cannot transfer to the same account');
      return;
    }

    setIsLoading(true);

    try {
      const transferData: TransferRequest = {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: transferAmount,
        description: description || undefined,
      };

      const result = await apiService.transferMoney(transferData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          `Transfer of ${formatCurrency(transferAmount, 'EGP')} completed successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setAmount('');
                setDescription('');
                setFromAccount(null);
                setToAccount(null);
                // Reload accounts to show updated balances
                loadData();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      Alert.alert('Error', 'Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (type.toLowerCase()) {
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

  return (
    <LinearGradient
      colors={['#1e3a8a', '#1e40af']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transfer Money</Text>
          <TouchableOpacity style={styles.historyButton}>
            <MaterialIcons name="history" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Transfer Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, transferType === 'internal' && styles.activeTypeButton]}
            onPress={() => setTransferType('internal')}
          >
            <MaterialIcons name="swap-horiz" size={20} color={transferType === 'internal' ? '#667eea' : '#fff'} />
            <Text style={[styles.typeText, transferType === 'internal' && styles.activeTypeText]}>
              Internal Transfer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, transferType === 'external' && styles.activeTypeButton]}
            onPress={() => setTransferType('external')}
          >
            <MaterialIcons name="send" size={20} color={transferType === 'external' ? '#667eea' : '#fff'} />
            <Text style={[styles.typeText, transferType === 'external' && styles.activeTypeText]}>
              Send Money
            </Text>
          </TouchableOpacity>
        </View>

        {/* From Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From Account</Text>
          <TouchableOpacity
            style={styles.accountSelector}
            onPress={() => setShowAccountPicker(true)}
          >
            {fromAccount ? (
              <View style={styles.selectedAccount}>
                <View style={[styles.accountIcon, { backgroundColor: getAccountColor(fromAccount.type) }]}>
                  <MaterialIcons name={getAccountIcon(fromAccount.type) as any} size={20} color="#fff" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{fromAccount.name}</Text>
                  <Text style={styles.accountBalance}>
                    {formatCurrency(fromAccount.balance, fromAccount.currency)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select account</Text>
            )}
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* To Account/Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {transferType === 'internal' ? 'To Account' : 'Send To'}
          </Text>
          <TouchableOpacity
            style={styles.accountSelector}
            onPress={() => setShowContactPicker(true)}
          >
            {toAccount ? (
              <View style={styles.selectedAccount}>
                <View style={[styles.accountIcon, { backgroundColor: getAccountColor(toAccount.type) }]}>
                  <MaterialIcons name={getAccountIcon(toAccount.type) as any} size={20} color="#fff" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{toAccount.name}</Text>
                  <Text style={styles.accountBalance}>
                    {formatCurrency(toAccount.balance, toAccount.currency)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                {transferType === 'internal' ? 'Select account' : 'Select contact'}
              </Text>
            )}
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>EGP</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              selectionColor="#667eea"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note..."
            placeholderTextColor="#999"
            selectionColor="#667eea"
            underlineColorAndroid="transparent"
            multiline
          />
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={[styles.transferButton, isLoading && styles.disabledButton]}
          onPress={handleTransfer}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.transferButtonText}>Processing...</Text>
          ) : (
            <Text style={styles.transferButtonText}>Transfer Money</Text>
          )}
        </TouchableOpacity>

        {/* Quick Amounts */}
        <View style={styles.quickAmountsContainer}>
          <Text style={styles.sectionTitle}>Quick Amounts</Text>
          <View style={styles.quickAmounts}>
            {[100, 500, 1000, 2000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>EGP {quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Account Picker Modal */}
      {showAccountPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Account</Text>
              <TouchableOpacity onPress={() => setShowAccountPicker(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {loadingAccounts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading accounts...</Text>
              </View>
            ) : (
              accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setFromAccount(account);
                    setShowAccountPicker(false);
                  }}
                >
                  <View style={[styles.accountIcon, { backgroundColor: getAccountColor(account.type) }]}>
                    <MaterialIcons name={getAccountIcon(account.type) as any} size={20} color="#fff" />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(account.balance, account.currency)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      )}

      {/* Contact Picker Modal */}
      {showContactPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Contact</Text>
              <TouchableOpacity onPress={() => setShowContactPicker(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.modalItem}
                onPress={() => {
                  // For external transfers, create a temporary account object
                  setToAccount({
                    id: parseInt(contact.id),
                    userId: 0,
                    name: contact.name,
                    type: 'checking',
                    balance: 0,
                    currency: 'EGP',
                    createdAt: new Date().toISOString(),
                  });
                  setShowContactPicker(false);
                }}
              >
                <View style={[styles.accountIcon, { backgroundColor: '#9E9E9E' }]}>
                  <MaterialIcons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{contact.name}</Text>
                  <Text style={styles.accountBalance}>{contact.phone}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  historyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 3,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  activeTypeButton: {
    backgroundColor: '#fff',
  },
  typeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeTypeText: {
    color: '#1e40af',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  accountSelector: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAccount: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  accountBalance: {
    fontSize: 13,
    color: '#666',
  },
  placeholderText: {
    flex: 1,
    fontSize: 15,
    color: '#999',
  },
  amountContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    height: 36,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#333',
    minHeight: 70,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transferButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  quickAmountsContainer: {
    marginHorizontal: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAmountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TransferScreen;

