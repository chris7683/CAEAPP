import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import apiService from '../services/api';

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState<SignUpForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await apiService.signUp({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
      });
      
      // Store the token
      await apiService.storeToken(response.token);
      
      setIsLoading(false);
      Alert.alert(
        'Success', 
        `Welcome to FinanceApp, ${response.username}! Your account has been created successfully.`,
        [
          {
            text: 'OK',
            onPress: onSignUpSuccess
          }
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error instanceof Error ? error.message : 'Sign up failed');
    }
  };

  const handleBackToLogin = () => {
    onNavigateToLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a8a', '#1e40af']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={handleBackToLogin}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.logoContainer}>
                  <MaterialIcons name="account-balance-wallet" size={50} color="#fff" />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join FinanceApp today</Text>
              </View>

              {/* Sign Up Form */}
              <View style={styles.formContainer}>
                {/* Username Field */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    selectionColor="#1e40af"
                    underlineColorAndroid="transparent"
                    autoComplete="off"
                    textContentType="none"
                  />
                </View>

                {/* Email Field */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#999"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    selectionColor="#1e40af"
                    underlineColorAndroid="transparent"
                    autoComplete="off"
                    textContentType="none"
                  />
                </View>

                {/* Password Field */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    selectionColor="#1e40af"
                    underlineColorAndroid="transparent"
                    importantForAutofill="no"
                    textContentType="oneTimeCode"
                    autoComplete="off"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Field */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    selectionColor="#1e40af"
                    underlineColorAndroid="transparent"
                    importantForAutofill="no"
                    textContentType="oneTimeCode"
                    autoComplete="off"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons
                      name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* Phone Number Field */}
                <View style={styles.inputContainer}>
                  <MaterialIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (Optional)"
                    placeholderTextColor="#999"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    returnKeyType="done"
                    selectionColor="#1e40af"
                    underlineColorAndroid="transparent"
                    autoComplete="off"
                    textContentType="none"
                  />
                </View>

                {/* Password Requirements */}
                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                  <Text style={[styles.requirement, formData.password.length >= 6 && styles.requirementMet]}>
                    • At least 6 characters
                  </Text>
                  <Text style={[styles.requirement, formData.password === formData.confirmPassword && formData.password.length > 0 && styles.requirementMet]}>
                    • Passwords match
                  </Text>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  <Text style={styles.signUpButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleBackToLogin}>
                  <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    height: 48,
    minHeight: 48,
  },

  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 5,
  },
  passwordRequirements: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  requirement: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  requirementMet: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#1e40af',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;
