import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import styles from './Styles';
import useAddNewAddress from './useAddNewAddress';
const { googlePlacesApiKey } = require('../../../../helpers/Config');

type FormFieldProps = {
  icon: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'characters';
  maxLength?: number;
  isLast?: boolean;
};

const FormField = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'words',
  maxLength,
  isLast,
}: FormFieldProps) => (
  <View style={[styles.fieldRow, isLast && styles.fieldRowLast]}>
    <View style={styles.fieldIconWrap}>
      <Icon name={icon} size={20} color="#1946A9" />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
    </View>
  </View>
);

const AddNewAddress = () => {
  const {
    loading,
    isEnabled,
    fname,
    lname,
    phone,
    setFName,
    setLName,
    setPhone,
    toggleSwitch,
    SaveAddress,
    onPlaceSelected,
    postcode,
    setPostcode,
  } = useAddNewAddress();

  const formatPostcode = (text: string) => {
    const normalized = text.toUpperCase().replace(/\s+/g, '');
    return normalized.length > 3
      ? `${normalized.slice(0, 3)} ${normalized.slice(3)}`
      : normalized;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>
        <View style={styles.card}>
          <FormField
            icon="account-outline"
            label="First name"
            value={fname}
            onChangeText={setFName}
            placeholder="John"
          />
          <FormField
            icon="account-outline"
            label="Last name"
            value={lname}
            onChangeText={setLName}
            placeholder="Doe"
          />
          <FormField
            icon="phone-outline"
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="0123456789"
            keyboardType="phone-pad"
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>ADDRESS DETAILS</Text>
        <View style={[styles.card, { zIndex: 1000, elevation: 10 }]}>
          <FormField
            icon="map-marker-outline"
            label="Postcode"
            value={postcode}
            onChangeText={(text) => setPostcode(formatPostcode(text))}
            placeholder="e.g. G2 4JR"
            autoCapitalize="characters"
            maxLength={8}
          />
          <View style={[styles.fieldRow, styles.fieldRowLast, styles.placesFieldRow]}>
            <View style={styles.fieldIconWrap}>
              <Icon name="magnify" size={20} color="#1946A9" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Search address</Text>
              <GooglePlacesAutocomplete
                placeholder="Start typing your address"
                fetchDetails
                onPress={(_, details) => onPlaceSelected(details as any)}
                onFail={(err) => console.error(err)}
                query={{
                  key: googlePlacesApiKey,
                  language: 'en',
                  components: 'country:gb',
                }}
                enablePoweredByContainer={false}
                disableScroll
                listViewDisplayed="auto"
                keepResultsAfterBlur
                styles={{
                  textInputContainer: styles.placesTextInputContainer,
                  textInput: styles.placesTextInput,
                  listView: styles.placesListView,
                  row: styles.placesRow,
                  description: styles.placesDescription,
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.defaultCard}>
            <View style={styles.fieldIconWrap}>
              <Icon name="home-outline" size={20} color="#1946A9" />
            </View>
            <View style={styles.defaultTextWrap}>
              <Text style={styles.defaultTitle}>Set as default address</Text>
              <Text style={styles.defaultSubtitle}>for all deliveries</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#1946A9' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={SaveAddress}
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="check" size={22} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save address</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddNewAddress;
