import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const mockTransactions = [
    { id: 1, type: 'income', category: 'Джобни', amount: 50.00, date: '2025-01-09', description: 'Джобни от баба' },
    { id: 2, type: 'expense', category: 'Храна', amount: 15.50, date: '2025-01-09', description: 'Обяд в училище' },
    { id: 3, type: 'expense', category: 'Транспорт', amount: 8.00, date: '2025-01-08', description: 'Билет за автобус' },
    { id: 4, type: 'income', category: 'Стипендия', amount: 200.00, date: '2025-01-08', description: 'Месечна стипендия' },
    { id: 5, type: 'expense', category: 'Развлечения', amount: 25.00, date: '2025-01-07', description: 'Кино с приятели' },
  ];

  const formatAmount = (amount, type) => {
    const color = type === 'income' ? '#28a745' : '#dc3545';
    const sign = type === 'income' ? '+' : '-';
    return { text: `${sign}${amount.toFixed(2)} лв.`, color };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header - matching web version */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Тийн Бюджет</Text>
        <View style={styles.headerRight}>
          <Text style={styles.pageTitle}>Финансово табло</Text>
          <TouchableOpacity style={styles.darkModeToggle}>
            <Ionicons name="moon" size={20} color="#F59E0B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Изход</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Message - matching web version */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Добре дошли във вашето финансово табло! Тук можете да следите всички ваши приходи и разходи, да анализирате финансовите си навици и да планирате бюджета си по-ефективно.
        </Text>
      </View>

      {/* Financial Summary Cards - matching web layout */}
      <View style={styles.overviewSection}>
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, styles.balanceCard]}>
            <Text style={styles.cardLabel}>Текущ баланс</Text>
            <Text style={[styles.cardAmount, { color: '#28a745' }]}>3396.00 лв.</Text>
          </View>

          <View style={[styles.overviewCard, styles.incomeCard]}>
            <Text style={styles.cardLabel}>Общо приходи</Text>
            <Text style={[styles.cardAmount, { color: '#28a745' }]}>6413.00 лв.</Text>
          </View>
        </View>

        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, styles.expenseCard]}>
            <Text style={styles.cardLabel}>Общо разходи</Text>
            <Text style={[styles.cardAmount, { color: '#dc3545' }]}>3017.00 лв.</Text>
          </View>

          <View style={[styles.overviewCard, styles.savingsCard]}>
            <Text style={styles.cardLabel}>Процент спестявания</Text>
            <Text style={[styles.cardAmount, { color: '#6f42c1' }]}>53.0%</Text>
          </View>
        </View>
      </View>

      {/* AI Financial Analysis Section - matching web version */}
      <View style={styles.aiSection}>
        <Text style={styles.sectionTitle}>AI Финансов Анализ</Text>
        <Text style={styles.aiDescription}>
          Получи персонализиран анализ на твоите финанси и препоръки за по-добро управление на бюджета
        </Text>
        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.aiButtonText}>Анализирай моите финанси</Text>
        </TouchableOpacity>
      </View>

      {/* Add Transaction Section - matching web version */}
      <View style={styles.addTransactionSection}>
        <Text style={styles.sectionTitle}>Добавяне на нова транзакция</Text>
        <View style={styles.transactionForm}>
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Приход</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>Приход</Text>
                <Ionicons name="chevron-down" size={16} color="#666666" />
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Сума</Text>
              <TextInput style={styles.inputField} placeholder="Сума" />
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Джобни</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>Джобни</Text>
                <Ionicons name="chevron-down" size={16} color="#666666" />
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Описание</Text>
              <TextInput style={styles.inputField} placeholder="Описание" />
            </View>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Добави транзакция</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions - similar to web table */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Последни транзакции</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>Виж всички</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsTable}>
          {mockTransactions.map((transaction) => {
            const { text, color } = formatAmount(transaction.amount, transaction.type);
            return (
              <View key={transaction.id} style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionIcon}>
                    <Ionicons 
                      name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                      size={16} 
                      color={color} 
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  </View>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.transactionAmountText, { color }]}>{text}</Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Chart Section - placeholder like web version */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Анализ на разходите</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="pie-chart" size={48} color="#9CA3AF" />
          <Text style={styles.chartPlaceholderText}>Графика ще се покаже тук</Text>
          <Text style={styles.chartSubtext}>Анализ по категории</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // Header - matching web version
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  darkModeToggle: {
    padding: 4,
  },
  exitButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  // Overview cards - matching web layout
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceCard: {
    // Default white background
  },
  incomeCard: {
    // Default white background
  },
  expenseCard: {
    // Default white background
  },
  savingsCard: {
    // Default white background
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  // AI Section - matching web version
  aiSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aiDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiButton: {
    backgroundColor: '#6f42c1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Add Transaction Section - matching web version
  addTransactionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  transactionForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  inputField: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  // Transactions section - similar to web table
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  transactionsTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // Chart section
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  chartPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '500',
  },
  chartSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});