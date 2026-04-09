import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Auth/Login/Login';
import Welcome from '../screens/Auth/Welcome/Welcome';
import SignUp from '../screens/Auth/Register/SignUp';
import ConfirmSignUp from '../screens/Auth/ConfirmSignUp/ConfirmSignUp';
import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';
import PostcodeCheck from '../screens/Auth/PostcodeCheck/PostcodeCheck';

const Stack = createStackNavigator();


const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='PostcodeCheck'

        >
            <Stack.Screen
                name="PostcodeCheck"
                component={PostcodeCheck}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ConfirmSignUp"
                component={ConfirmSignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                    title: 'Reset Password',
                    headerStyle: {
                        borderBottomWidth: 1
                    }
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
