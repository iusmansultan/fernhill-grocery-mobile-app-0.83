import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../../redux/Hooks';
import {
  FetchUserAddresses,
  RemoveAddress,
  SetDefaultAddress,
} from '../../../helpers/Backend';
import Loader from '../../../components/ProductLoader';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const formatAddressLine = (item) =>
  [item.street1, item.street2, item.town, item.postal_code]
    .filter(Boolean)
    .join(', ');

const sortAddresses = (addresses) =>
  [...addresses].sort((a, b) => {
    if (a.default_address === b.default_address) return 0;
    return a.default_address ? -1 : 1;
  });

const AddressCard = ({ item, onEdit, onRemove, onSetDefault }) => {
  const isDefault = item.default_address;

  return (
    <View
      style={[styles.card, isDefault ? styles.cardDefault : styles.cardSecondary]}
    >
      <View style={styles.cardTop}>
        <View
          style={[
            styles.iconWrap,
            isDefault ? styles.iconWrapDefault : styles.iconWrapMuted,
          ]}
        >
          <Icon
            name="map-marker"
            size={22}
            color={isDefault ? '#1946A9' : '#9CA3AF'}
          />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>
              {isDefault ? 'Home' : 'Previous address'}
            </Text>
            {isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressLine}>{formatAddressLine(item)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardActions}>
        {isDefault ? (
          <>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onEdit}>
              <Icon name="pencil-outline" size={18} color="#111827" />
              <Text style={styles.secondaryBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerBtn} onPress={onRemove}>
              <Icon name="trash-can-outline" size={18} color="#EF4444" />
              <Text style={styles.dangerBtnText}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onSetDefault}>
              <Icon name="star-outline" size={18} color="#111827" />
              <Text style={styles.secondaryBtnText}>Set default</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dangerBtn} onPress={onRemove}>
              <Icon name="trash-can-outline" size={18} color="#EF4444" />
              <Text style={styles.dangerBtnText}>Remove</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const Address = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const getUserAddresses = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await FetchUserAddresses(user.userData.id);
      setAddresses(response.data.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.userData.id]);

  useFocusEffect(
    useCallback(() => {
      getUserAddresses(hasLoadedRef.current);
      hasLoadedRef.current = true;
    }, [getUserAddresses])
  );

  const confirmRemove = (id) => {
    Alert.alert('Remove address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeUserAddress(id),
      },
    ]);
  };

  const removeUserAddress = async (id) => {
    try {
      setRefreshing(true);
      await RemoveAddress(token, id);
      await getUserAddresses(true);
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setRefreshing(true);
      const response = await SetDefaultAddress(token, user.userData.id, id);
      if (response?.data) {
        setAddresses(response.data);
      } else {
        await getUserAddresses(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = () => {
    Alert.alert(
      'Edit address',
      'To update an address, remove it and add a new one.',
      [{ text: 'OK' }]
    );
  };

  if (loading && addresses.length === 0) {
    return <Loader />;
  }

  const sortedAddresses = sortAddresses(addresses);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>

        {sortedAddresses.length === 0 ? (
          <Text style={styles.emptyText}>No address added yet</Text>
        ) : (
          sortedAddresses.map((item) => (
            <AddressCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onRemove={() => confirmRemove(item.id)}
              onSetDefault={() => handleSetDefault(item.id)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addAddressBtn}
          onPress={() => navigation.navigate('AddNewAddress')}
        >
          <Icon name="plus" size={22} color="#FFFFFF" />
          <Text style={styles.addAddressText}>Add new address</Text>
        </TouchableOpacity>
      </View>

      {refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1946A9" />
        </View>
      )}
    </View>
  );
};

export default Address;
