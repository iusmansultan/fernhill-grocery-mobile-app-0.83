import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStoreInfo } from '../helpers/StoreHours';

interface StoreClosedModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const StoreClosedModal: React.FC<StoreClosedModalProps> = ({ visible, onClose }) => {
  const storeInfo = getStoreInfo();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Icon name="store-clock" size={60} color="#1946A9" />
          </View>

          <Text style={styles.title}>We're Currently Closed</Text>
          
          <Text style={styles.subtitle}>
            Sorry, we're not available right now. Please come back during our opening hours.
          </Text>

          <View style={styles.hoursContainer}>
            <View style={styles.hoursSection}>
              <View style={styles.hoursTitleRow}>
                <Icon name="store" size={20} color="#1946A9" />
                <Text style={styles.hoursTitle}>Store Hours</Text>
              </View>
              <Text style={styles.hoursText}>{storeInfo.storeHoursText.weekday}</Text>
              <Text style={styles.hoursText}>{storeInfo.storeHoursText.saturday}</Text>
              <Text style={styles.hoursText}>{storeInfo.storeHoursText.sunday}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.hoursSection}>
              <View style={styles.hoursTitleRow}>
                <Icon name="truck-delivery" size={20} color="#1946A9" />
                <Text style={styles.hoursTitle}>Delivery Hours</Text>
              </View>
              <Text style={styles.hoursText}>{storeInfo.deliveryHoursText.weekday}</Text>
              <Text style={styles.hoursText}>{storeInfo.deliveryHoursText.sunday}</Text>
            </View>
          </View>

          <View style={styles.contactContainer}>
            <Icon name="phone" size={18} color="#1946A9" />
            <Text style={styles.contactText}>Contact: {storeInfo.phone}</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  hoursContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  hoursSection: {
    marginVertical: 5,
  },
  hoursTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1946A9',
    marginLeft: 8,
  },
  hoursText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 28,
    marginVertical: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 14,
    color: '#1946A9',
    fontWeight: '600',
    marginLeft: 8,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#1946A9',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StoreClosedModal;
