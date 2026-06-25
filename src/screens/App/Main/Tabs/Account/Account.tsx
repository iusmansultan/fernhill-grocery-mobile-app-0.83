import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';
import styles from './Styles';
import useAccount from './useAccount';

const Account = () => {
  const {
    image,
    name,
    email,
    stats,
    settingsOptions,
    navigateTo,
    SignOut,
    deleteAccount,
    loading,
  } = useAccount();

  const insets = useSafeAreaInsets();

  const dangerOptions = [
    { key: 'logout', label: 'Log out', icon: 'logout', onPress: SignOut },
    {
      key: 'delete',
      label: 'Delete account',
      icon: 'delete-outline',
      onPress: deleteAccount,
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statusBarContainer,
          { paddingTop: Platform.OS === 'ios' ? insets.top : 0 },
        ]}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1946A9" />
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: image }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{name}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.addresses}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.favourites}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.menuItem,
                index === settingsOptions.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => navigateTo(option.screen)}
            >
              <View style={styles.menuIconWrap}>
                <Icon name={option.icon} size={20} color="#1946A9" />
              </View>
              <Text style={styles.menuLabel}>{option.label}</Text>
              {option.badge ? (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{option.badge}</Text>
                </View>
              ) : null}
              <Icon name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dangerCard}>
          {dangerOptions.map((option, index) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.dangerItem,
                index === dangerOptions.length - 1 && styles.dangerItemLast,
              ]}
              onPress={option.onPress}
            >
              <View style={styles.dangerIconWrap}>
                <Icon name={option.icon} size={20} color="#EF4444" />
              </View>
              <Text style={styles.dangerLabel}>{option.label}</Text>
              <Icon name="chevron-right" size={20} color="#EF4444" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Account;
