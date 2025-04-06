
import React from 'react';
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
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Login Screen</h2>
    </div>
  </div>
);

const SignupScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Signup Screen</h2>
    </div>
  </div>
);

const ForgotPasswordScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Forgot Password Screen</h2>
    </div>
  </div>
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
