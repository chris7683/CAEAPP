import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  color?: string;
}

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<SettingsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSettings([
        // Account Settings
        {
          id: 'profile',
          title: 'Profile Information',
          subtitle: 'Update your personal details',
          icon: 'person',
          type: 'navigation',
          color: '#3b82f6',
        },
        {
          id: 'security',
          title: 'Security Settings',
          subtitle: 'Password, PIN, and security options',
          icon: 'security',
          type: 'navigation',
          color: '#ef4444',
        },
        {
          id: 'notifications',
          title: 'Notification Preferences',
          subtitle: 'Manage your notification settings',
          icon: 'notifications',
          type: 'navigation',
          color: '#f59e0b',
        },
        
        // App Settings
        {
          id: 'theme',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          icon: 'dark-mode',
          type: 'toggle',
          value: false,
          color: '#8b5cf6',
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: 'language',
          type: 'navigation',
          color: '#10b981',
        },
        {
          id: 'currency',
          title: 'Default Currency',
          subtitle: 'EGP - Egyptian Pound',
          icon: 'attach-money',
          type: 'navigation',
          color: '#06b6d4',
        },
        
        // Privacy & Security
        {
          id: 'biometric',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face recognition',
          icon: 'fingerprint',
          type: 'toggle',
          value: true,
          color: '#ec4899',
        },
        {
          id: 'auto-lock',
          title: 'Auto Lock',
          subtitle: 'Automatically lock app after 5 minutes',
          icon: 'lock-clock',
          type: 'toggle',
          value: true,
          color: '#f59e0b',
        },
        {
          id: 'data-usage',
          title: 'Data Usage',
          subtitle: 'Manage your data consumption',
          icon: 'data-usage',
          type: 'navigation',
          color: '#6b7280',
        },
        
        // Banking Settings
        {
          id: 'account-limits',
          title: 'Account Limits',
          subtitle: 'Set daily and monthly limits',
          icon: 'account-balance',
          type: 'navigation',
          color: '#1e40af',
        },
        {
          id: 'transaction-alerts',
          title: 'Transaction Alerts',
          subtitle: 'Get notified about all transactions',
          icon: 'payment',
          type: 'toggle',
          value: true,
          color: '#3b82f6',
        },
        {
          id: 'budget-alerts',
          title: 'Budget Alerts',
          subtitle: 'Receive budget-related notifications',
          icon: 'pie-chart',
          type: 'toggle',
          value: true,
          color: '#10b981',
        },
        
        // Support & Help
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: 'help',
          type: 'navigation',
          color: '#6b7280',
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Share your thoughts about the app',
          icon: 'feedback',
          type: 'action',
          color: '#f59e0b',
        },
        {
          id: 'about',
          title: 'About EgyptBank',
          subtitle: 'Version 1.0.0',
          icon: 'info',
          type: 'navigation',
          color: '#8b5cf6',
        },
        
        // Account Actions
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: 'logout',
          type: 'action',
          color: '#ef4444',
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const handleToggle = (id: string) => {
    setSettings(prev => 
      prev.map(item => 
        item.id === id ? { ...item, value: !item.value } : item
      )
    );
  };

  const handlePress = (item: SettingsItem) => {
    if (item.type === 'action') {
      if (item.id === 'logout') {
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => {} }
          ]
        );
      } else if (item.id === 'feedback') {
        Alert.alert(
          'Send Feedback',
          'Thank you for your interest in providing feedback. This feature will be available soon.',
          [{ text: 'OK' }]
        );
      }
    } else if (item.type === 'navigation') {
      Alert.alert(
        item.title,
        `Navigate to ${item.title} screen. This feature will be implemented soon.`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderSettingsItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingsItem}
      onPress={() => handlePress(item)}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.settingsIcon, { backgroundColor: item.color }]}>
          <MaterialIcons name={item.icon as any} size={20} color="#fff" />
        </View>
        <View style={styles.settingsContent}>
          <Text style={styles.settingsTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: '#e5e7eb', true: '#1e40af' }}
            thumbColor={item.value ? '#fff' : '#9ca3af'}
          />
        ) : (
          <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );

  const groupedSettings = [
    {
      title: 'Account Settings',
      items: settings.filter(item => 
        ['profile', 'security', 'notifications'].includes(item.id)
      ),
    },
    {
      title: 'App Preferences',
      items: settings.filter(item => 
        ['theme', 'language', 'currency'].includes(item.id)
      ),
    },
    {
      title: 'Privacy & Security',
      items: settings.filter(item => 
        ['biometric', 'auto-lock', 'data-usage'].includes(item.id)
      ),
    },
    {
      title: 'Banking Settings',
      items: settings.filter(item => 
        ['account-limits', 'transaction-alerts', 'budget-alerts'].includes(item.id)
      ),
    },
    {
      title: 'Support & Help',
      items: settings.filter(item => 
        ['help', 'feedback', 'about'].includes(item.id)
      ),
    },
    {
      title: 'Account Actions',
      items: settings.filter(item => 
        ['logout'].includes(item.id)
      ),
    },
  ];

  if (isLoading) {
    return (
      <LinearGradient colors={['#1e3a8a', '#1e40af']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <MaterialIcons name="settings" size={48} color="#fff" />
            <Text style={styles.loadingText}>Loading settings...</Text>
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content}>
          {/* User Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Account Profile</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <MaterialIcons name="edit" size={20} color="#1e40af" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <MaterialIcons name="person" size={32} color="#1e40af" />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>Ahmed Hassan</Text>
                <Text style={styles.profileEmail}>ahmed.hassan@example.com</Text>
                <Text style={styles.profilePhone}>+20 123 456 7890</Text>
                <View style={styles.profileStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Account Active</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Groups */}
          {groupedSettings.map((group, index) => (
            <View key={index} style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.settingsList}>
                {group.items.map(renderSettingsItem)}
              </View>
            </View>
          ))}

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>EgyptBank Mobile App</Text>
            <Text style={styles.versionNumber}>Version 1.0.0</Text>
            <Text style={styles.copyrightText}>© 2024 EgyptBank. All rights reserved.</Text>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  editProfileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsItemRight: {
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

export default SettingsScreen;
