import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveApiBaseUrl(): string {
  // Default for simulators and web
  let host = 'localhost';

  // In Expo Go on device, derive LAN IP from hostUri / debuggerHost
  const manifest: any = (Constants as any);
  const hostUri: string | undefined = manifest?.expoConfig?.hostUri || manifest?.manifest?.hostUri;
  const debuggerHost: string | undefined = manifest?.manifest?.debuggerHost;
  const candidate = hostUri || debuggerHost;
  if (candidate) {
    host = candidate.split(':')[0];
  }

  // If running on a real device and we couldn't resolve, suggest common LAN
  if (!candidate && Platform.OS !== 'web' && Platform.OS !== 'ios') {
    host = '10.0.2.2'; // Android emulator fallback to host loopback
  }

  return `http://${host}:8080/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  username: string;
  phoneNumber?: string;
}

export interface ApiError {
  message: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    const token = await this.getStoredToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async testConnection(): Promise<string> {
    return this.makeRequest<string>('/auth/test', {
      method: 'GET',
    });
  }

  // Token management
  async storeToken(token: string): Promise<void> {
    // In a real app, you'd use secure storage like Expo SecureStore
    // For now, we'll use AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  async removeStoredToken(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove stored token:', error);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return token !== null;
  }
}

export const apiService = new ApiService();
export default apiService;
