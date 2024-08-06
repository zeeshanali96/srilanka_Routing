// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, SafeAreaView,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; 

import constants from '../src/constants';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 3000); 
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
    <LottieView 
      style={styles.lottie}
      source={require('../src/assets/lottie/bus_animation.json')} 
      autoPlay 
      loop 
    />
    <Text style={styles.text}>Route Founder</Text>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  lottie: {
    width: 200, 
    height: 200, 
  },
  text: {
    position: 'absolute',
    bottom: 50, 
    fontSize: 24,
    color:constants.colors.inputBorder,
    fontWeight:'bold',
    fontFamily:constants.fonts.medium,
    
  },
});

export default SplashScreen;
