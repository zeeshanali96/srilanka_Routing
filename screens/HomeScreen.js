// screens/HomeScreen.js
import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import DashboardCard from '../components/Card/DashboardCard';

import {useNavigation} from '@react-navigation/native';
import constants from '../src/constants';

import {useTranslation} from 'react-i18next';

import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();

  const saveLanguage = async language => {
    try {
      await AsyncStorage.setItem('@language', language);
    } catch (e) {
      console.log(e);
    }
  };

  const getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('@language');
      if (value !== null) {
        i18n.changeLanguage(value);
      } else {
        i18n.changeLanguage(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getLanguage();
  }, []);

  const handleLanguageChange = async lng => {
    i18n.changeLanguage(lng);

    await saveLanguage(lng);
  };

  const handleCardPress = routeName => {
    navigation.navigate(routeName);
  };

  const handleContactUs = () => {
    const phoneNumber = '94772549526';
    const url = `https://wa.me/${phoneNumber}`;

    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <SafeAreaView className="flex-1  p-4">
      <View className="items-center ">
        <Text
          className="text-3xl font-bold mb-4 text-center"
          style={styles.topHeading}>
          {t('topHeading')}
        </Text>

        <View className="mb-6 mt-6">
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={() => handleLanguageChange('en')}>
              <Text style={styles.languageChange}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('si')}>
              <Text style={styles.languageChange}>Sinhala</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('ta')}>
              <Text style={styles.languageChange}>Tamil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <DashboardCard
            title="Direct Bus Schedule"
            icon="bus"
            onPress={() => handleCardPress('DirectBusSchedule')}
          />
          <DashboardCard
            title="Train Schedule"
            icon="train"
            onPress={() => handleCardPress('TrainSchedule')}
          />
        </View>
        <View style={styles.container}>
          <DashboardCard
            title="Contact Us"
            icon="headset"
            onPress={() => handleContactUs()}
          />
          <DashboardCard
            title="Settings"
            icon="screwdriver"
            onPress={() => handleCardPress('Setting')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  topHeading: {
    color: constants.colors.blue,
    fontFamily: constants.fonts.light,
  },
  languageChange: {
    color: '#000',
    fontSize: 20,
    fontFamily: constants.fonts.bold,
    fontWeight: 'bold',
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
