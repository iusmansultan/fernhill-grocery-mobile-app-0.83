import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { saveDeviceToken } from '../api/services/notifications';

const DEFAULT_CHANNEL_ID = 'default';

async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('FCM permission status:', authStatus, 'enabled:', enabled);

    if (enabled) {
      await notifee.requestPermission();
    }

    return enabled;
  }

  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function requestPermissionAndGetToken(): Promise<string | null> {
  try {
    const enabled = await ensureNotificationPermissions();
    if (!enabled) {
      console.warn('Notification permissions were not granted');
      return null;
    }

    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}

export function getNotificationContent(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): { title: string; body: string } {
  const title =
    remoteMessage.notification?.title ||
    (remoteMessage.data?.title as string | undefined) ||
    'Fernhill Grocers';

  const body =
    remoteMessage.notification?.body ||
    (remoteMessage.data?.body as string | undefined) ||
    '';

  return { title, body };
}

export async function displayNotification(
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      const channelId = await notifee.createChannel({
        id: DEFAULT_CHANNEL_ID,
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId,
          pressAction: { id: 'default' },
          smallIcon: 'ic_launcher',
        },
      });
      return;
    }

    await notifee.displayNotification({
      title,
      body,
      data,
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  } catch (error) {
    console.error('Failed to display notification:', error);
  }
}

export async function displayNotificationFromRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): Promise<void> {
  const { title, body } = getNotificationContent(remoteMessage);

  if (!body && title === 'Fernhill Grocers') {
    return;
  }

  await displayNotification(
    title,
    body,
    remoteMessage.data as Record<string, string> | undefined
  );
}

export function registerBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage);
    await displayNotificationFromRemoteMessage(remoteMessage);
  });
}

export function registerForegroundHandler(): () => void {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    await displayNotificationFromRemoteMessage(remoteMessage);
  });
}

export async function syncDeviceTokenWithBackend(
  userId: number | string
): Promise<void> {
  if (!userId) {
    return;
  }

  const fcmToken = await requestPermissionAndGetToken();
  if (!fcmToken) {
    return;
  }

  try {
    await saveDeviceToken(userId, fcmToken);
    console.log('FCM token saved for user:', userId);
  } catch (error) {
    console.error('Failed to save FCM token to backend:', error);
  }
}

export async function saveFcmTokenForUser(
  userId: number | string,
  fcmToken: string
): Promise<void> {
  if (!userId || !fcmToken) {
    return;
  }

  try {
    await saveDeviceToken(userId, fcmToken);
    console.log('FCM token updated for user:', userId);
  } catch (error) {
    console.error('Failed to update FCM token on backend:', error);
  }
}

export function registerTokenRefreshHandler(
  onTokenRefresh?: (token: string) => void
): () => void {
  return messaging().onTokenRefresh(token => {
    console.log('FCM token refreshed:', token);
    onTokenRefresh?.(token);
  });
}
