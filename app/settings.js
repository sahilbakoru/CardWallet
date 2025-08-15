import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState('free');

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
  const toggleBiometric = () => setIsBiometricEnabled(previousState => !previousState);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0/month',
      features: [ 'No Ads', '7 Card', 'Standard support'],
      color: '#6c757d'
    },
    // {
    //   id: 'pro',
    //   name: 'Pro Plan',
    //   price: '$9.99/month',
    //   features: ['All premium features', 'Unlimited storage', 'Priority support', 'Advanced analytics'],
    //   color: '#007AFF'
    // },
    // {
    //   id: 'premium',
    //   name: 'Premium Plan',
    //   price: '$0.',
    //   subPrice:'99',
    //   subMonth:'/month',
    //   features: ['All Free features', 'Unlimited cards', 'Custom backgrounds', 'Early access to new features','Basic Support','Dark Mode'],
    //   color: '#5856d6'
    // }
  ];

  return (
    <LinearGradient
      colors={isDarkMode ? ['#121212', '#1E1E1E'] : ['#f5f7fa', '#e4e8ed']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerText, isDarkMode && styles.darkText]}>Settings</Text>

          {/* <TouchableOpacity>
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={isDarkMode ? "#fff" : "#000"} 
            />
          </TouchableOpacity> */}
        </View>

        {/* User Profile Card */}
        {/* <View style={[styles.profileCard, isDarkMode && styles.darkCard]}>
          <Image
            source={require('../assets/images/react-logo.png')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isDarkMode && styles.darkText]}>John Doe</Text>
            <Text style={[styles.profileEmail, isDarkMode && styles.darkSubtext]}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={16} color={isDarkMode ? "#fff" : "#007AFF"} />
          </TouchableOpacity>
        </View> */}

        {/* Subscription Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Your Plan</Text>
        <View style={styles.subscriptionContainer}>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity 
              key={plan.id}
              style={[
                styles.subscriptionCard, 
                activeSubscription === plan.id && styles.activeSubscription,
                { borderColor: plan.color }
              ]}
              onPress={() => setActiveSubscription(plan.id)}
            >
              <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.planBadgeText}>{plan.name}</Text>
              </View>
              <Text style={[styles.planPrice, isDarkMode && styles.darkText]}>{plan.price}<Text style={{fontSize:16}} >{plan?.subPrice}</Text> <Text style={[styles.planPrice, isDarkMode && styles.darkText]}>{plan?.subMonth}</Text></Text>
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={activeSubscription === plan.id ? plan.color : (isDarkMode ? '#aaa' : '#555')} 
                    />
                    <Text style={[
                      styles.featureText, 
                      isDarkMode && styles.darkSubtext,
                      activeSubscription === plan.id && { color: plan.color }
                    ]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
              {activeSubscription == plan.id ? (
                <TouchableOpacity 
                  style={[styles.planButton, { backgroundColor: plan.color }]}
                  disabled
                >
                  <Text style={styles.planButtonText}>Current Plan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.planButton, { backgroundColor: plan.color }]}
                >
                  <Text style={styles.planButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
               
            </TouchableOpacity>
          ))}
          <Text style={[styles.versionText, isDarkMode && styles.darkSubtext ]}>
            Cancel anytime . Secure payment . Instant access
          </Text>
        </View>

        {/* App Settings */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>App Settings</Text>
        <View style={[styles.settingsCard, isDarkMode && styles.darkCard]}>
          <SettingItem
            icon="moon-outline"
            name="Dark Mode"
            isDarkMode={isDarkMode}
            rightComponent={
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            }
          />
          {/* <SettingItem
            icon="finger-print"
            name="Biometric Login"
            isDarkMode={isDarkMode}
            rightComponent={
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleBiometric}
                value={isBiometricEnabled}
              />
            }
          />
          <SettingItem
            icon="notifications-outline"
            name="Notifications"
            isDarkMode={isDarkMode}
            rightComponent={
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? "#aaa" : "#888"} 
              />
            }
          /> */}
        </View>

        {/* Account Settings */}
        {/* <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Account</Text>
        <View style={[styles.settingsCard, isDarkMode && styles.darkCard]}>
          <SettingItem
            icon="person-outline"
            name="Profile Information"
            isDarkMode={isDarkMode}
            hasChevron
          />
          <SettingItem
            icon="lock-closed-outline"
            name="Change Password"
            isDarkMode={isDarkMode}
            hasChevron
          />
          <SettingItem
            icon="card-outline"
            name="Payment Methods"
            isDarkMode={isDarkMode}
            hasChevron
          />
        </View> */}

        {/* Support Section */}
        {/* <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Support</Text>
        <View style={[styles.settingsCard, isDarkMode && styles.darkCard]}>
          <SettingItem
            icon="help-circle-outline"
            name="Help Center"
            isDarkMode={isDarkMode}
            hasChevron
          />
          <SettingItem
            icon="mail-outline"
            name="Contact Us"
            isDarkMode={isDarkMode}
            hasChevron
          />
          <SettingItem
            icon="information-circle-outline"
            name="About App"
            isDarkMode={isDarkMode}
            hasChevron
          />
        </View> */}

        {/* Logout Button */}
        {/* <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="#ff3b30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity> */}

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDarkMode && styles.darkSubtext]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const SettingItem = ({ icon, name, isDarkMode, rightComponent, hasChevron }) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={isDarkMode ? "#fff" : "#007AFF"} 
        style={styles.settingIcon}
      />
      <Text style={[styles.settingName, isDarkMode && styles.darkText]}>{name}</Text>
    </View>
    {rightComponent || (hasChevron && (
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? "#aaa" : "#888"} 
      />
    ))}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  subscriptionContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  subscriptionCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeSubscription: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  planBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  planPrice: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  planButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingName: {
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#888',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtext: {
    color: '#aaa',
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
});