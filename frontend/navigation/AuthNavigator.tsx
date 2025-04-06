
import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREENS, defaultScreenOptions } from './navigationConfig';

// Define the auth stack param list
type AuthStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.SIGNUP]: undefined;
  [SCREENS.FORGOT_PASSWORD]: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder screen components
const LoginScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Login Screen</Text>
  </View>
);

const SignupScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Signup Screen</Text>
  </View>
);

const ForgotPasswordScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Forgot Password Screen</Text>
  </View>
);

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      initialRouteName={SCREENS.LOGIN}
      screenOptions={defaultScreenOptions}
    >
      <AuthStack.Screen 
        name={SCREENS.LOGIN} 
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen 
        name={SCREENS.SIGNUP} 
        component={SignupScreen}
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen 
        name={SCREENS.FORGOT_PASSWORD} 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
