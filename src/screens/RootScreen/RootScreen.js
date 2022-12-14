import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import WellcomeScreen from '../WellcomeScreen/WellcomeScreen';

const Stack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="wellcome"
      component={WellcomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="signin"
      component={SignIn}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="signup"
      component={SignUp}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default RootStackScreen;
