import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Експорт на данни',
      'Искате ли да експортирате всичките си финансови данни?',
      [
        { text: 'Отказ', style: 'cancel' },
        { text: 'Експорт', onPress: () => console.log('Exporting data...') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Изтриване на акаунт',
      'Това действие е необратимо. Всички ваши данни ще бъдат изтрити.',
      [
        { text: 'Отказ', style: 'cancel' },
        { text: 'Изтрий', style: 'destructive', onPress: () => console.log('Deleting account...') }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Акаунт',
      items: [
        {
          icon: 'person-outline',
          title: 'Профил',
          subtitle: 'Редактирай личната информация',
          onPress: () => console.log('Profile pressed')
        },
        {
          icon: 'shield-outline',
          title: 'Парола и сигурност',
          subtitle: 'Управлявай паролата и настройките за сигурност',
          onPress: () => console.log('Security pressed')
        },
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Известия',
          subtitle: 'Управлявай известията',
          rightElement: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          )
        },
        {
          icon: 'moon-outline',
          title: 'Тъмна тема',
          subtitle: 'Използвай тъмна тема',
          rightElement: (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={darkModeEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          )
        },
        {
          icon: 'finger-print-outline',
          title: 'Биометрична защита',
          subtitle: 'Влизай с пръст или лице',
          rightElement: (
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={biometricEnabled ? '#FFFFFF' : '#F3F4F6'}
            />
          )
        },
      ]
    },
    {
      title: 'Данни',
      items: [
        {
          icon: 'download-outline',
          title: 'Експорт на данни',
          subtitle: 'Изтегли всичките си данни',
          onPress: handleExportData
        },
        {
          icon: 'cloud-upload-outline',
          title: 'Резервно копие',
          subtitle: 'Създай резервно копие в облака',
          onPress: () => console.log('Backup pressed')
        },
        {
          icon: 'trash-outline',
          title: 'Изтрий всички данни',
          subtitle: 'Изтрий всички транзакции и настройки',
          onPress: () => Alert.alert('Изтриване на данни', 'Това ще изтрие всички ваши данни.'),
          textColor: '#EF4444'
        },
      ]
    },
    {
      title: 'Поддръжка',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Помощ и FAQ',
          subtitle: 'Намери отговори на въпросите си',
          onPress: () => console.log('Help pressed')
        },
        {
          icon: 'chatbubble-outline',
          title: 'Свържи се с нас',
          subtitle: 'Изпрати обратна връзка',
          onPress: () => console.log('Contact pressed')
        },
        {
          icon: 'star-outline',
          title: 'Оцени приложението',
          subtitle: 'Помогни ни с рейтинг',
          onPress: () => console.log('Rate pressed')
        },
      ]
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
        <Text style={styles.subtitle}>Персонализирай приложението</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Потребител</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={!!item.rightElement}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <Ionicons 
                      name={item.icon} 
                      size={20} 
                      color={item.textColor || '#64748B'} 
                    />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, item.textColor && { color: item.textColor }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.rightElement ? (
                  item.rightElement
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>TeenBudget</Text>
        <Text style={styles.appVersion}>Версия 1.0.0</Text>
        <Text style={styles.appCopyright}>© 2025 TeenBudget. Всички права запазени.</Text>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleDeleteAccount}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Изход от акаунта</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
