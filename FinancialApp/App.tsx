import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <>
      <AuthNavigator />
      <StatusBar style="light" />
    </>
  );
}
