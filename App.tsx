/**
 * @format
 * @flow strict-local
 * @author <iusmansultan>
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AppShell from './src/components/Splash/AppShell';
import { store } from './src/redux/Store';
import {
  registerForegroundHandler,
  registerTokenRefreshHandler,
  requestPermissionAndGetToken,
  saveFcmTokenForUser,
  syncDeviceTokenWithBackend,
} from './src/notifications/Notifications';

let persistor = persistStore(store);

const App = () => {
  useEffect(() => {
    const state = store.getState() as {
      user?: { value?: { isLoggedIn?: boolean; userData?: { id?: number } } };
    };
    const userId = state.user?.value?.userData?.id;
    if (state.user?.value?.isLoggedIn && userId) {
      syncDeviceTokenWithBackend(userId);
    } else {
      requestPermissionAndGetToken();
    }

    const unsubscribeForeground = registerForegroundHandler();
    const unsubscribeTokenRefresh = registerTokenRefreshHandler(token => {
      const currentState = store.getState() as {
        user?: { value?: { userData?: { id?: number } } };
      };
      const currentUserId = currentState.user?.value?.userData?.id;
      if (currentUserId) {
        saveFcmTokenForUser(currentUserId, token);
      }
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Background tap:', remoteMessage.data);
        // Navigate based on remoteMessage.data
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (remoteMessage) {
          console.log('Cold start tap:', remoteMessage.data);
          // Navigate based on remoteMessage.data
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
      unsubscribeTokenRefresh();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppShell />
      </PersistGate>
    </Provider>
  );
};

export default App;
