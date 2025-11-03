import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('месец');

  const periods = ['седмица', 'месец', 'година'];

  const mockCategories = [
    { name: 'Храна', amount: 245, percentage: 35, color: '#F59E0B' },
    { name: 'Транспорт', amount: 120, percentage: 17, color: '#28a745' },
    { name: 'Развлечения', amount: 180, percentage: 26, color: '#6f42c1' },
    { name: 'Дрехи', amount: 85, percentage: 12, color: '#dc3545' },
    { name: 'Други', amount: 70, percentage: 10, color: '#28a745' },
  ];

  const mockInsights = [
    {
      icon: 'trending-up',
      title: 'Повишение в разходите',
      description: 'Разходите за храна са се увеличили с 15% спрямо миналия месец',
      color: '#F59E0B',
      type: 'warning'
    },
    {
      icon: 'checkmark-circle',
      title: 'Добър контрол на бюджета',
      description: 'Оставате в рамките на зададения бюджет за транспорт',
      color: '#28a745',
      type: 'success'
    },
    {
      icon: 'bulb',
      title: 'Възможност за спестяване',
      description: 'Можете да спестите 50 лв., като намалите разходите за развлечения',
      color: '#6f42c1',
      type: 'info'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Финансов анализ</Text>
        <Text style={styles.subtitle}>Анализирай финансовите си навици</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <Text style={styles.sectionTitle}>Период</Text>
        <View style={styles.periodButtons}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.selectedPeriodButtonText
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-up-outline" size={24} color="#10B981" />
          <Text style={styles.summaryLabel}>Общо приходи</Text>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>2,300 лв.</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="trending-down-outline" size={24} color="#EF4444" />
          <Text style={styles.summaryLabel}>Общо разходи</Text>
          <Text style={[styles.summaryValue, { color: '#EF4444' }]}>700 лв.</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="wallet-outline" size={24} color="#3B82F6" />
          <Text style={styles.summaryLabel}>Нето спестяване</Text>
          <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>1,600 лв.</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Разпределение по категории</Text>
        {mockCategories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>{category.amount} лв.</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
          </View>
        ))}
      </View>

      {/* AI Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>AI Анализ и препоръки</Text>
        {mockInsights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
              <Ionicons name={insight.icon} size={24} color={insight.color} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Trend Chart Placeholder */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Тенденции</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart" size={48} color="#94A3B8" />
          <Text style={styles.chartPlaceholderText}>Графика ще се покаже тук</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Експорт на отчет</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>Обнови анализ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedPeriodButtonText: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});
