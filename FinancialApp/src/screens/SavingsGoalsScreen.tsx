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

interface SavingsGoal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  monthlyContribution: number;
}

interface SavingsGoalsScreenProps {
  onBack: () => void;
}

const SavingsGoalsScreen: React.FC<SavingsGoalsScreenProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  useEffect(() => {
    loadSavingsGoals();
  }, []);

  const loadSavingsGoals = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSavingsGoals([
        {
          id: '1',
          name: 'Emergency Fund',
          description: '6 months of expenses for unexpected situations',
          targetAmount: 50000,
          currentAmount: 35000,
          targetDate: '2024-06-30',
          icon: 'shield',
          color: '#ef4444',
          priority: 'high',
          status: 'active',
          monthlyContribution: 5000,
        },
        {
          id: '2',
          name: 'Vacation to Europe',
          description: 'Dream trip to Paris, Rome, and Barcelona',
          targetAmount: 80000,
          currentAmount: 25000,
          targetDate: '2024-12-15',
          icon: 'flight',
          color: '#3b82f6',
          priority: 'medium',
          status: 'active',
          monthlyContribution: 8000,
        },
        {
          id: '3',
          name: 'New Car',
          description: 'Down payment for a reliable family car',
          targetAmount: 120000,
          currentAmount: 120000,
          targetDate: '2024-03-01',
          icon: 'directions-car',
          color: '#10b981',
          priority: 'high',
          status: 'completed',
          monthlyContribution: 0,
        },
        {
          id: '4',
          name: 'Home Renovation',
          description: 'Kitchen and living room makeover',
          targetAmount: 150000,
          currentAmount: 45000,
          targetDate: '2025-08-01',
          icon: 'home',
          color: '#8b5cf6',
          priority: 'medium',
          status: 'active',
          monthlyContribution: 10000,
        },
        {
          id: '5',
          name: 'Wedding Fund',
          description: 'Save for the perfect wedding day',
          targetAmount: 200000,
          currentAmount: 80000,
          targetDate: '2025-05-20',
          icon: 'favorite',
          color: '#ec4899',
          priority: 'high',
          status: 'active',
          monthlyContribution: 15000,
        },
        {
          id: '6',
          name: 'Retirement Fund',
          description: 'Long-term savings for retirement',
          targetAmount: 2000000,
          currentAmount: 300000,
          targetDate: '2040-12-31',
          icon: 'elderly',
          color: '#f59e0b',
          priority: 'high',
          status: 'paused',
          monthlyContribution: 20000,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'paused': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredGoals = savingsGoals.filter(goal => {
    if (selectedFilter === 'all') return true;
    return goal.status === selectedFilter;
  });

  const totalTargetAmount = savingsGoals
    .filter(goal => goal.status === 'active')
    .reduce((sum, goal) => sum + goal.targetAmount, 0);

  const totalCurrentAmount = savingsGoals
    .filter(goal => goal.status === 'active')
    .reduce((sum, goal) => sum + goal.currentAmount, 0);

  const totalMonthlyContribution = savingsGoals
    .filter(goal => goal.status === 'active')
    .reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  const handleGoalPress = (goal: SavingsGoal) => {
    const daysRemaining = getDaysRemaining(goal.targetDate);
    const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
    
    Alert.alert(
      goal.name,
      `Progress: ${progress.toFixed(1)}%\nCurrent: ${formatCurrency(goal.currentAmount)}\nTarget: ${formatCurrency(goal.targetAmount)}\nRemaining: ${formatCurrency(goal.targetAmount - goal.currentAmount)}\nDays Left: ${daysRemaining}\nMonthly: ${formatCurrency(goal.monthlyContribution)}`,
      [{ text: 'OK' }]
    );
  };

  const filters = [
    { key: 'all', label: 'All Goals' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'paused', label: 'Paused' },
  ];

  if (isLoading) {
    return (
      <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <MaterialIcons name="savings" size={48} color="#fff" />
            <Text style={styles.loadingText}>Loading savings goals...</Text>
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
          <Text style={styles.headerTitle}>Savings Goals</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadSavingsGoals} />
          }
        >
          {/* Overview */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Savings Overview</Text>
              <View style={styles.goalsCount}>
                <Text style={styles.goalsCountText}>
                  {savingsGoals.filter(g => g.status === 'active').length} Active Goals
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Total Target</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(totalTargetAmount)}</Text>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressPercentage}>
                  {getProgressPercentage(totalCurrentAmount, totalTargetAmount).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(totalCurrentAmount, totalTargetAmount)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Saved</Text>
                <Text style={styles.statValue}>{formatCurrency(totalCurrentAmount)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Monthly Goal</Text>
                <Text style={styles.statValue}>{formatCurrency(totalMonthlyContribution)}</Text>
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

          {/* Goals List */}
          <View style={styles.goalsContainer}>
            {filteredGoals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => handleGoalPress(goal)}
                >
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
                        <MaterialIcons name={goal.icon as any} size={24} color="#fff" />
                      </View>
                      <View style={styles.goalDetails}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        <Text style={styles.goalDescription}>{goal.description}</Text>
                        <View style={styles.goalMeta}>
                          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) }]}>
                            <Text style={styles.priorityText}>{goal.priority.toUpperCase()}</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(goal.status) }]}>
                            <Text style={styles.statusText}>{goal.status.toUpperCase()}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.goalProgress}>
                      <Text style={styles.goalProgressPercentage}>{progress.toFixed(1)}%</Text>
                    </View>
                  </View>

                  <View style={styles.goalAmounts}>
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Current</Text>
                      <Text style={styles.amountValue}>{formatCurrency(goal.currentAmount)}</Text>
                    </View>
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Target</Text>
                      <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
                    </View>
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Remaining</Text>
                      <Text style={[styles.amountValue, { color: '#ef4444' }]}>
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalProgressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.goalFooter}>
                    <View style={styles.goalTimeline}>
                      <MaterialIcons name="schedule" size={16} color="#666" />
                      <Text style={styles.timelineText}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Target reached!'}
                      </Text>
                    </View>
                    <View style={styles.monthlyContribution}>
                      <Text style={styles.contributionText}>
                        {formatCurrency(goal.monthlyContribution)}/month
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="add" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>New Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="trending-up" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Add Money</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="analytics" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>View Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="share" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Share Goals</Text>
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
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  goalsCount: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalsCountText: {
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
    backgroundColor: '#1e40af',
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
  goalsContainer: {
    paddingHorizontal: 20,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  goalMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  goalProgress: {
    alignItems: 'flex-end',
  },
  goalProgressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountRow: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTimeline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  monthlyContribution: {
    alignItems: 'flex-end',
  },
  contributionText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
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

export default SavingsGoalsScreen;
