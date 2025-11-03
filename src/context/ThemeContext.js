import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from storage on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = () => {
    // For now, just start with light mode
    // Later we can add AsyncStorage when we install it properly
    setIsDarkMode(false);
  };

  const toggleTheme = () => {
    // For now, just toggle the state
    // Later we can add persistence when we install AsyncStorage
    setIsDarkMode(!isDarkMode);
  };

  const lightTheme = {
    colors: {
      primary: '#28a745',
      secondary: '#6f42c1',
      danger: '#dc3545',
      warning: '#F59E0B',
      success: '#28a745',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      border: '#E5E7EB',
      shadow: '#000000',
    },
    isDark: false,
  };

  const darkTheme = {
    colors: {
      primary: '#34d399',
      secondary: '#a78bfa',
      danger: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
      background: '#1f2937',
      surface: '#374151',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#4b5563',
      shadow: '#000000',
    },
    isDark: true,
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
