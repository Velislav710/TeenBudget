import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/index';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </ThemeProvider>
  );
}
