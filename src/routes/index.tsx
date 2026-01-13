import React from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../redux/Hooks';

const Router = () => {
  const user = useAppSelector((state: any) => state.user.value);
  const isLoggedIn: boolean = user.isLoggedIn;

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Router;
