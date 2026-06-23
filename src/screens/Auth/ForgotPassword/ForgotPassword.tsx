import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './Styles';
import useForgotPassword from './useForgotPassword';

type FormFieldProps = {
  icon: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences';
};

const FormField = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: FormFieldProps) => (
  <View style={styles.fieldRow}>
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
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  </View>
);

const FooterLink = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Remember your password? </Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.footerLink}>Log in</Text>
    </TouchableOpacity>
  </View>
);

const ForgotPassword = () => {
  const {
    username,
    setUsername,
    loading,
    screen,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    SendCode,
    ResetUserPassword,
    navigation,
  } = useForgotPassword();

  const goToLogin = () => {
    (navigation as any).navigate('Login');
  };

  if (screen === 1) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroIconWrap}>
            <Icon name="lock-reset" size={30} color="#1946A9" />
          </View>

          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.subtitle}>
            Enter your account email. We'll send you a code to reset your
            password.
          </Text>

          <View style={styles.card}>
            <FormField
              icon="email-outline"
              label="Email address"
              value={username}
              onChangeText={setUsername}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            onPress={SendCode}
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="send" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Send code</Text>
              </>
            )}
          </TouchableOpacity>

          <FooterLink onPress={goToLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (screen === 2) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroIconWrap}>
            <Icon name="shield-key-outline" size={30} color="#1946A9" />
          </View>

          <Text style={styles.title}>Create new password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from your previously used
            password.
          </Text>

          <View style={styles.card}>
            <FormField
              icon="numeric"
              label="Code"
              value={code}
              onChangeText={setCode}
              placeholder="Enter code"
              keyboardType="number-pad"
            />
          </View>
          <Text style={styles.helperText}>
            Enter the code you received via email
          </Text>

          <View style={styles.card}>
            <FormField
              icon="lock-outline"
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="**********"
              secureTextEntry
            />
          </View>
          <Text style={styles.helperText}>
            Password must be at least 8 characters with special characters
          </Text>

          <View style={styles.card}>
            <FormField
              icon="lock-check-outline"
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="**********"
              secureTextEntry
            />
          </View>
          <Text style={styles.helperText}>Both passwords must match.</Text>

          <TouchableOpacity
            onPress={ResetUserPassword}
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="check" size={22} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Reset password</Text>
              </>
            )}
          </TouchableOpacity>

          <FooterLink onPress={goToLogin} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
};

export default ForgotPassword;
