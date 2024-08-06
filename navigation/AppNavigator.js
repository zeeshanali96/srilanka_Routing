import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SplashScreen from '../screens/SplashScreen'; 
import HomeScreen from '../screens/HomeScreen';

{/* Dashboard Card Route  */}
import DirectBusSchedule from '../screens/DirectBusSchedule';
import TrainSchedule from '../screens/TrainSchedule';
import Setting from '../screens/Setting';
import AboutScreen from '../screens/Settings/AboutScreen';
import TermsScreen from '../screens/Settings/TermsScreen';
import PrivacyScreen from '../screens/Settings/PrivacyScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash"  screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Dashboard Card Routes  */}
        <Stack.Screen name="DirectBusSchedule" component={DirectBusSchedule} />
        <Stack.Screen name="TrainSchedule" component={TrainSchedule} />
        <Stack.Screen name="Setting" component={Setting} />

        {/* Setting Routes  */}
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}