import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetPlanningScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Храна');
  
  const categories = [
    { name: 'Храна', icon: 'restaurant-outline', color: '#F59E0B', budget: 300, spent: 245 },
    { name: 'Транспорт', icon: 'car-outline', color: '#3B82F6', budget: 150, spent: 120 },
    { name: 'Развлечения', icon: 'game-controller-outline', color: '#8B5CF6', budget: 200, spent: 180 },
    { name: 'Дрехи', icon: 'shirt-outline', color: '#EF4444', budget: 100, spent: 85 },
    { name: 'Образование', icon: 'book-outline', color: '#10B981', budget: 50, spent: 30 },
    { name: 'Спорт', icon: 'fitness-outline', color: '#F97316', budget: 80, spent: 65 },
  ];

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#dc3545';
    if (percentage >= 75) return '#F59E0B';
    return '#28a745';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Бюджетно планиране</Text>
        <Text style={styles.subtitle}>Следи разходите по категории</Text>
      </View>

      {/* Monthly Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Ionicons name="calendar-outline" size={24} color="#28a745" />
          <Text style={styles.overviewTitle}>Януари 2025</Text>
        </View>
        <View style={styles.overviewStats}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewLabel}>Общ бюджет</Text>
            <Text style={[styles.overviewValue, { color: '#28a745' }]}>880 лв.</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewLabel}>Похарчено</Text>
            <Text style={[styles.overviewValue, { color: '#dc3545' }]}>725 лв.</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewLabel}>Остава</Text>
            <Text style={[styles.overviewValue, { color: '#10B981' }]}>155 лв.</Text>
          </View>
        </View>
      </View>

      {/* Category Budgets */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Категории</Text>
        {categories.map((category, index) => {
          const percentage = getProgressPercentage(category.spent, category.budget);
          const progressColor = getProgressColor(percentage);
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryCard,
                selectedCategory === category.name && styles.selectedCategoryCard
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={24} color={category.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {category.spent} лв. / {category.budget} лв.
                  </Text>
                </View>
                <View style={styles.categoryProgress}>
                  <Text style={[styles.progressText, { color: progressColor }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: progressColor
                    }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Budget Edit */}
      {selectedCategory && (
        <View style={styles.editContainer}>
          <Text style={styles.sectionTitle}>Редактирай бюджет</Text>
          <View style={styles.editCard}>
            <View style={styles.editHeader}>
              <Ionicons name="pencil-outline" size={20} color="#3B82F6" />
              <Text style={styles.editTitle}>{selectedCategory}</Text>
            </View>
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Месечен бюджет (лв.)</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="300"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Запази промените</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Съвети за спестяване</Text>
        <View style={styles.tipsCard}>
          <View style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
            <Text style={styles.tipText}>Планирай месечните разходи в началото на месеца</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
            <Text style={styles.tipText}>Запазвай 20% от доходите си за спестявания</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="analytics-outline" size={20} color="#3B82F6" />
            <Text style={styles.tipText}>Преглеждай разходите си всяка седмица</Text>
          </View>
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
  overviewCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  categoryCard: {
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
  selectedCategoryCard: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#64748B',
  },
  categoryProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  editContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
