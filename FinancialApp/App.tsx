import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { Colors } from './src/theme/colors';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkBlue }}>
      <AuthNavigator />
      <StatusBar style="light" />
    </View>
  );
}
