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

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
  percentage: number;
}

interface BudgetTrackerScreenProps {
  onBack: () => void;
}

const BudgetTrackerScreen: React.FC<BudgetTrackerScreenProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadBudgetData();
  }, [selectedPeriod]);

  const loadBudgetData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const categories = [
        {
          id: '1',
          name: 'Food & Dining',
          icon: 'restaurant',
          budget: 2000,
          spent: 1650,
          color: '#ef4444',
          percentage: 82.5,
        },
        {
          id: '2',
          name: 'Transportation',
          icon: 'directions-car',
          budget: 1500,
          spent: 1200,
          color: '#3b82f6',
          percentage: 80.0,
        },
        {
          id: '3',
          name: 'Shopping',
          icon: 'shopping-bag',
          budget: 3000,
          spent: 2100,
          color: '#8b5cf6',
          percentage: 70.0,
        },
        {
          id: '4',
          name: 'Entertainment',
          icon: 'movie',
          budget: 800,
          spent: 450,
          color: '#f59e0b',
          percentage: 56.25,
        },
        {
          id: '5',
          name: 'Utilities',
          icon: 'home',
          budget: 1200,
          spent: 1150,
          color: '#10b981',
          percentage: 95.83,
        },
        {
          id: '6',
          name: 'Healthcare',
          icon: 'local-hospital',
          budget: 500,
          spent: 320,
          color: '#ec4899',
          percentage: 64.0,
        },
        {
          id: '7',
          name: 'Education',
          icon: 'school',
          budget: 1000,
          spent: 800,
          color: '#06b6d4',
          percentage: 80.0,
        },
        {
          id: '8',
          name: 'Savings',
          icon: 'savings',
          budget: 5000,
          spent: 4200,
          color: '#84cc16',
          percentage: 84.0,
        },
      ];

      setBudgetCategories(categories);
      setTotalBudget(categories.reduce((sum, cat) => sum + cat.budget, 0));
      setTotalSpent(categories.reduce((sum, cat) => sum + cat.spent, 0));
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const getRemainingBudget = () => totalBudget - totalSpent;
  const getBudgetPercentage = () => (totalSpent / totalBudget) * 100;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 90) return 'Over Budget';
    if (percentage >= 75) return 'Almost There';
    return 'On Track';
  };

  const handleCategoryPress = (category: BudgetCategory) => {
    Alert.alert(
      category.name,
      `Budget: ${formatCurrency(category.budget)}\nSpent: ${formatCurrency(category.spent)}\nRemaining: ${formatCurrency(category.budget - category.spent)}`,
      [{ text: 'OK' }]
    );
  };

  const periods = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  if (isLoading) {
    return (
      <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <MaterialIcons name="pie-chart" size={48} color="#fff" />
            <Text style={styles.loadingText}>Loading budget data...</Text>
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
          <Text style={styles.headerTitle}>Budget Tracker</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <MaterialIcons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadBudgetData} />
          }
        >
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.activePeriodButton,
                ]}
                onPress={() => setSelectedPeriod(period.key as any)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period.key && styles.activePeriodText,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Budget Overview</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(getBudgetPercentage()) }]}>
                <Text style={styles.statusBadgeText}>{getStatusText(getBudgetPercentage())}</Text>
              </View>
            </View>
            
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Total Budget</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(totalBudget)}</Text>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Spending Progress</Text>
                <Text style={styles.progressPercentage}>{getBudgetPercentage().toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(getBudgetPercentage(), 100)}%`,
                      backgroundColor: getStatusColor(getBudgetPercentage()),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, { color: getStatusColor(getBudgetPercentage()) }]}>
                  {formatCurrency(getRemainingBudget())}
                </Text>
              </View>
            </View>
          </View>

          {/* Budget Categories */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Budget Categories</Text>
            {budgetCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                      <MaterialIcons name={category.icon as any} size={20} color="#fff" />
                    </View>
                    <View style={styles.categoryDetails}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryPercentage}>
                    <Text style={styles.percentageText}>{category.percentage.toFixed(1)}%</Text>
                  </View>
                </View>
                <View style={styles.categoryProgress}>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        {
                          width: `${Math.min(category.percentage, 100)}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.categoryFooter}>
                  <Text style={styles.remainingText}>
                    {formatCurrency(category.budget - category.spent)} remaining
                  </Text>
                  <View style={[styles.categoryStatus, { backgroundColor: getStatusColor(category.percentage) }]}>
                    <Text style={styles.categoryStatusText}>
                      {getStatusText(category.percentage)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="add" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Add Category</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="edit" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Edit Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="analytics" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>View Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="download" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Export Data</Text>
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
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#fff',
  },
  periodText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#1e40af',
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
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceSection: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#666',
  },
  categoryPercentage: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  categoryProgress: {
    marginBottom: 12,
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 12,
    color: '#666',
  },
  categoryStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryStatusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
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

export default BudgetTrackerScreen;
