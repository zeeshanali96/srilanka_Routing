import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';

const DirectBusSchedule = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <StatusAppBar title={t('Direct Bus Schedule')} />
      <View style={styles.content}>
        <Text>{t('Direct Bus Schedule')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DirectBusSchedule;
