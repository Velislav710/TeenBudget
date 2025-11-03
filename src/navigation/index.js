import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BudgetPlanningScreen from '../screens/BudgetPlanningScreen';
import SavingsGoalsScreen from '../screens/SavingsGoalsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsRoot() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Budget') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Savings') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745', // Green primary color from web version
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1E293B',
        },
      })}
    >
      <Tabs.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          title: 'Начало',
          headerTitle: 'Финансово табло'
        }} 
      />
      <Tabs.Screen 
        name="Budget" 
        component={BudgetPlanningScreen} 
        options={{ 
          title: 'Бюджет',
          headerTitle: 'Бюджетно планиране'
        }} 
      />
      <Tabs.Screen 
        name="Savings" 
        component={SavingsGoalsScreen} 
        options={{ 
          title: 'Цели',
          headerTitle: 'Спестявателни цели'
        }} 
      />
      <Tabs.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{ 
          title: 'Анализ',
          headerTitle: 'Финансов анализ'
        }} 
      />
      <Tabs.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Настройки',
          headerTitle: 'Настройки'
        }} 
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication check - replace with real auth logic
  useEffect(() => {
    // Simulate checking for stored auth token
    setTimeout(() => {
      // For demo purposes, start with login screen
      // In real app: check AsyncStorage for token, validate with API
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Main app screens
          <Stack.Screen name="MainTabs" component={TabsRoot} />
        ) : (
          // Authentication screens
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


