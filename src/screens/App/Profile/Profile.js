import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from '../../../redux/Hooks';
import { saveUser } from '../../../redux/auth/AuthSlice';
import { UpdateUserDetailsWithImage, UpdateUserImage } from '../../../helpers/Backend';
import Loader from '../../../components/ProductLoader';

const FALLBACK_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/barber-2you.appspot.com/o/User%20Icon.png?alt=media&token=f6e510ad-487c-4501-bcc5-7019e1c60036';

const COLORS = {
  primary: '#1946A9',
  background: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  iconBg: '#EEF2FF',
};

const Profile = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState(
    user.userData.image !== '' ? user.userData.image : FALLBACK_IMAGE
  );
  const [name, setName] = useState(user.userData.username);
  const [email, setEmail] = useState(user.userData.email);
  const [phone, setPhone] = useState(user.userData.phone);
  const [loading, setLoading] = useState(false);

  const saveDetails = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const response = await UpdateUserDetailsWithImage(token, {
        userId: user.userData.id,
        userDetails: {
          image: profile,
          email,
          phone,
          username: name,
        },
      });

      dispatch(
        saveUser({
          isLoggedIn: true,
          userData: response.data,
        })
      );
      navigation.pop();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = async () => {
    try {
      setLoading(true);
      const response = await UpdateUserDetailsWithImage(token, {
        userId: user.userData.id,
        userDetails: {
          image: '',
          email,
          phone,
          username: name,
        },
      });

      dispatch(
        saveUser({
          isLoggedIn: true,
          userData: response.data,
        })
      );
      setProfile(FALLBACK_IMAGE);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    return true;
  };

  const uploadImage = async (imageAsset) => {
    try {
      setLoading(true);
      const response = await UpdateUserImage(token, imageAsset, user.userData.id);
      setProfile(response.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const selectImage = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel || !response.assets?.[0]?.uri) return;
      uploadImage(response.assets[0]);
    });
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change password',
      'To reset your password, sign out and use Forgot password on the login screen.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {loading ? <Loader /> : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: profile }} style={styles.avatar} />
            <TouchableOpacity style={styles.avatarEditBtn} onPress={selectImage}>
              <Icon name="camera-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity onPress={selectImage}>
              <Text style={styles.uploadText}>Upload photo</Text>
            </TouchableOpacity>
            <Text style={styles.photoDivider}>|</Text>
            <TouchableOpacity onPress={removePhoto}>
              <Text style={styles.removeText}>Remove photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PERSONAL INFO</Text>
        <View style={styles.card}>
          <ProfileField
            icon="account-outline"
            label="Full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <ProfileField
            icon="email-outline"
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={true}
          />
          <ProfileField
            icon="phone-outline"
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            isLast
          />
        </View>

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.securityRow} onPress={handleChangePassword}>
            <View style={styles.fieldIconWrap}>
              <Icon name="lock-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.securityTextWrap}>
              <Text style={styles.securityTitle}>Change password</Text>
              <Text style={styles.securitySubtitle}>Update your account password</Text>
            </View>
            <Icon name="chevron-right" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={saveDetails}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>Save details</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const ProfileField = ({
  icon,
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  isLast,
  disabled,
}) => (
  <View style={[styles.fieldRow, isLast && styles.fieldRowLast]}>
    <View style={styles.fieldIconWrap}>
      <Icon name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'none'}
        placeholderTextColor={COLORS.textMuted}
        disabled={disabled}
      />
    </View>
    {!disabled ? <Icon name="pencil-outline" size={18} color={COLORS.textMuted} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrap: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: COLORS.primary,
    overflow: 'visible',
    marginBottom: 14,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 54,
    resizeMode: 'cover',
  },
  avatarEditBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  photoDivider: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  removeText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: 24,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
    paddingRight: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  fieldInput: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  securityTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Profile;
