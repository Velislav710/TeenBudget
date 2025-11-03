import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SavingsGoalsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '' });

  const mockGoals = [
    {
      id: 1,
      name: 'Нов телефон',
      target: 800,
      current: 320,
      icon: 'phone-portrait-outline',
      color: '#28a745',
      deadline: '2025-06-01',
    },
    {
      id: 2,
      name: 'Лятна почивка',
      target: 1200,
      current: 750,
      icon: 'airplane-outline',
      color: '#6f42c1',
      deadline: '2025-07-15',
    },
    {
      id: 3,
      name: 'Нов лаптоп',
      target: 2000,
      current: 450,
      icon: 'laptop-outline',
      color: '#dc3545',
      deadline: '2025-12-01',
    },
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('bg-BG', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAddGoal = () => {
    // Mock add goal functionality
    console.log('Adding goal:', newGoal);
    setShowAddModal(false);
    setNewGoal({ name: '', target: '', current: '' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Спестявателни цели</Text>
        <Text style={styles.subtitle}>Достигай мечтите си стъпка по стъпка</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Активни цели</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet-outline" size={24} color="#10B981" />
          <Text style={styles.statNumber}>1,520</Text>
          <Text style={styles.statLabel}>Спестено (лв.)</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="target-outline" size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>4,000</Text>
          <Text style={styles.statLabel}>Обща цел (лв.)</Text>
        </View>
      </View>

      {/* Add Goal Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Добави нова цел</Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <View style={styles.goalsContainer}>
        {mockGoals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const daysLeft = getDaysUntilDeadline(goal.deadline);
          const remaining = goal.target - goal.current;
          
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                  <Ionicons name={goal.icon} size={24} color={goal.color} />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDeadline}>
                    До {formatDeadline(goal.deadline)} ({daysLeft} дни)
                  </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {goal.current} лв. / {goal.target} лв.
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: goal.color
                      }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.goalActions}>
                <View style={styles.remainingInfo}>
                  <Text style={styles.remainingLabel}>Остава да спестиш:</Text>
                  <Text style={[styles.remainingAmount, { color: goal.color }]}>
                    {remaining} лв.
                  </Text>
                </View>
                <TouchableOpacity style={[styles.addMoneyButton, { backgroundColor: goal.color }]}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.addMoneyText}>Добави пари</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Съвети за спестяване</Text>
        <View style={styles.tipsCard}>
          <View style={styles.tipItem}>
            <Ionicons name="calculator-outline" size={20} color="#10B981" />
            <Text style={styles.tipText}>
              Задавай реалистични цели и срокове
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="repeat-outline" size={20} color="#3B82F6" />
            <Text style={styles.tipText}>
              Спестявай редовно, дори и малки суми
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="trending-up-outline" size={20} color="#F59E0B" />
            <Text style={styles.tipText}>
              Инвестирай в дългосрочни спестявания
            </Text>
          </View>
        </View>
      </View>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Отказ</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Нова спестявателна цел</Text>
            <TouchableOpacity onPress={handleAddGoal}>
              <Text style={styles.saveButton}>Запази</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Име на целта</Text>
              <TextInput 
                style={styles.input}
                placeholder="Например: Нов телефон"
                value={newGoal.name}
                onChangeText={(text) => setNewGoal({...newGoal, name: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Целева сума (лв.)</Text>
              <TextInput 
                style={styles.input}
                placeholder="800"
                keyboardType="numeric"
                value={newGoal.target}
                onChangeText={(text) => setNewGoal({...newGoal, target: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Текуща сума (лв.)</Text>
              <TextInput 
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={newGoal.current}
                onChangeText={(text) => setNewGoal({...newGoal, current: text})}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    color: '#64748B',
  },
  moreButton: {
    padding: 4,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingInfo: {
    flex: 1,
  },
  remainingLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addMoneyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#64748B',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  saveButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    gap: 20,
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
    backgroundColor: '#FFFFFF',
  },
});
