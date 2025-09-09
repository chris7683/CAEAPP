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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'reminder' | 'promotion' | 'security';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  timestamp: string;
  action?: string;
  icon: string;
  color: string;
}

interface NotificationsScreenProps {
  onBack: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'high' | 'transaction'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          title: 'Transaction Alert',
          message: 'EGP 2,500 debited from your account for Carrefour purchase',
          type: 'transaction',
          priority: 'medium',
          isRead: false,
          timestamp: '2024-01-15 14:30',
          action: 'View Transaction',
          icon: 'payment',
          color: '#3b82f6',
        },
        {
          id: '2',
          title: 'Budget Alert',
          message: 'You have spent 85% of your monthly food budget',
          type: 'alert',
          priority: 'high',
          isRead: false,
          timestamp: '2024-01-15 12:15',
          action: 'View Budget',
          icon: 'warning',
          color: '#ef4444',
        },
        {
          id: '3',
          title: 'Bill Reminder',
          message: 'Electricity bill of EGP 450 is due in 3 days',
          type: 'reminder',
          priority: 'medium',
          isRead: true,
          timestamp: '2024-01-14 09:00',
          action: 'Pay Now',
          icon: 'receipt',
          color: '#f59e0b',
        },
        {
          id: '4',
          title: 'Special Offer',
          message: 'Get 15% cashback on all online purchases this weekend',
          type: 'promotion',
          priority: 'low',
          isRead: true,
          timestamp: '2024-01-13 16:45',
          action: 'Learn More',
          icon: 'local-offer',
          color: '#10b981',
        },
        {
          id: '5',
          title: 'Security Alert',
          message: 'New login detected from iPhone 13 Pro',
          type: 'security',
          priority: 'high',
          isRead: false,
          timestamp: '2024-01-13 08:20',
          action: 'Review Activity',
          icon: 'security',
          color: '#8b5cf6',
        },
        {
          id: '6',
          title: 'Transfer Completed',
          message: 'EGP 1,000 successfully transferred to Ahmed Hassan',
          type: 'transaction',
          priority: 'medium',
          isRead: true,
          timestamp: '2024-01-12 15:30',
          action: 'View Details',
          icon: 'swap-horiz',
          color: '#3b82f6',
        },
        {
          id: '7',
          title: 'Savings Goal Update',
          message: 'You are 60% towards your vacation fund goal',
          type: 'alert',
          priority: 'low',
          isRead: true,
          timestamp: '2024-01-12 10:15',
          action: 'View Goals',
          icon: 'savings',
          color: '#06b6d4',
        },
        {
          id: '8',
          title: 'Credit Card Payment',
          message: 'Your credit card payment of EGP 3,200 is due tomorrow',
          type: 'reminder',
          priority: 'high',
          isRead: false,
          timestamp: '2024-01-11 14:00',
          action: 'Pay Now',
          icon: 'credit-card',
          color: '#f59e0b',
        },
        {
          id: '9',
          title: 'Investment Update',
          message: 'Your mutual fund gained 2.5% this month',
          type: 'alert',
          priority: 'low',
          isRead: true,
          timestamp: '2024-01-10 11:30',
          action: 'View Portfolio',
          icon: 'trending-up',
          color: '#10b981',
        },
        {
          id: '10',
          title: 'Account Statement',
          message: 'Your monthly account statement is ready for download',
          type: 'reminder',
          priority: 'medium',
          isRead: true,
          timestamp: '2024-01-09 08:00',
          action: 'Download',
          icon: 'description',
          color: '#6b7280',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction': return '#3b82f6';
      case 'alert': return '#ef4444';
      case 'reminder': return '#f59e0b';
      case 'promotion': return '#10b981';
      case 'security': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    if (selectedFilter === 'high') return notification.priority === 'high';
    if (selectedFilter === 'transaction') return notification.type === 'transaction';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      // Mark as read
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
    
    Alert.alert(
      notification.title,
      notification.message,
      [
        { text: 'OK' },
        ...(notification.action ? [{ text: notification.action, onPress: () => {} }] : [])
      ]
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setNotifications([]) }
      ]
    );
  };

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'high', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length },
    { key: 'transaction', label: 'Transactions', count: notifications.filter(n => n.type === 'transaction').length },
  ];

  if (isLoading) {
    return (
      <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <MaterialIcons name="notifications" size={48} color="#fff" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.markReadButton}>
                <MaterialIcons name="done-all" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
              <MaterialIcons name="clear-all" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadNotifications} />
          }
        >
          {/* Notification Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Notification Center</Text>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>
                  {unreadCount} New
                </Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>{notifications.length}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Unread</Text>
                <Text style={[styles.summaryValue, { color: unreadCount > 0 ? '#ef4444' : '#666' }]}>
                  {unreadCount}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>High Priority</Text>
                <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>
                  {notifications.filter(n => n.priority === 'high').length}
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
                  {filter.count > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{filter.count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Notifications List */}
          <View style={styles.notificationsContainer}>
            {filteredNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="notifications-none" size={48} color="#666" />
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptyMessage}>
                  {selectedFilter === 'unread' 
                    ? 'All notifications are read'
                    : 'No notifications match your filter'
                  }
                </Text>
              </View>
            ) : (
              filteredNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadCard,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationInfo}>
                      <View style={[styles.notificationIcon, { backgroundColor: getTypeColor(notification.type) }]}>
                        <MaterialIcons name={notification.icon as any} size={20} color="#fff" />
                      </View>
                      <View style={styles.notificationDetails}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
                      </View>
                    </View>
                    <View style={styles.notificationMeta}>
                      {!notification.isRead && <View style={styles.unreadDot} />}
                      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(notification.priority) }]} />
                    </View>
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  {notification.action && (
                    <View style={styles.notificationAction}>
                      <Text style={styles.actionText}>{notification.action}</Text>
                      <MaterialIcons name="arrow-forward-ios" size={16} color="#1e40af" />
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="settings" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Notification Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="schedule" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Set Reminders</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="security" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Security Alerts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialIcons name="help" size={24} color="#1e40af" />
                <Text style={styles.quickActionText}>Help & Support</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  markReadButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  summaryBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  filterBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationsContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  notificationCard: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e40af',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 14,
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

export default NotificationsScreen;
