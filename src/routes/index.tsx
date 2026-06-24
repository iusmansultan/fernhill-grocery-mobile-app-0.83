import React, { useEffect } from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../redux/Hooks';
import { syncDeviceTokenWithBackend } from '../notifications/Notifications';

const Router = () => {
  const user = useAppSelector((state: any) => state.user.value);
  const isLoggedIn: boolean = user.isLoggedIn;
  const userId = user.userData?.id;

  useEffect(() => {
    if (isLoggedIn && userId) {
      syncDeviceTokenWithBackend(userId);
    }
  }, [isLoggedIn, userId]);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Router;
