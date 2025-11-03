import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: 'trending-up',
      title: 'Управление на разходите',
      description: 'Автоматично разпознаване и категоризиране на разходите. Пример: 50 лв за храна се категоризира като "Храна"',
      color: '#28a745'
    },
    {
      icon: 'bulb',
      title: 'Интелигентни препоръки',
      description: 'Персонализирани финансови съвети въз основа на разходи, спестявания и цели. Пример: Намали разходите за кафе или избери по-евтини варианти',
      color: '#28a745'
    },
    {
      icon: 'wallet',
      title: 'Цели на спестяването',
      description: 'Поставяй финансови цели и следи напредъка. Пример: Спести 1000 лв за ваканция, платформата изчислява месечните спестявания',
      color: '#28a745'
    },
    {
      icon: 'analytics',
      title: 'Прогнози за бъдещето',
      description: 'Платформата използва данните ти, за да ти покаже прогнози за спестявания и разходи. Пример: Показва финансовите ти резултати след 1 година регулярно спестяване',
      color: '#28a745'
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="wallet" size={24} color="#28a745" />
          <Ionicons name="bar-chart" size={12} color="#28a745" style={styles.chartIcon} />
        </View>
        <Text style={[styles.logoText, { color: theme.colors.text }]}>Тийн Бюджет</Text>
        <TouchableOpacity style={styles.darkModeToggle} onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Добре дошли в Тийн Бюджет!</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
          Управлявай бюджета си с лекота и започни да вземаш умни финансови решения още от сега!
        </Text>
      </View>

      {/* Features Grid */}
      <ScrollView style={styles.featuresContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                <Ionicons name={feature.icon} size={32} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.primaryButtonText}>Създай Акаунт</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Вход</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Създадено специално за тийнейджъри
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  chartIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  darkModeToggle: {
    padding: 8,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6f42c1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
