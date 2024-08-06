import React from 'react';
import {StyleSheet, Text, View, Alert,BackHandler } from 'react-native';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';

import {List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Setting = ({ navigation }) => {
  const {t} = useTranslation();

  const handleExit = () => {
    Alert.alert(
      t('exit'),
      t('exit_confirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('ok'),
          onPress: () => {
            BackHandler.exitApp();
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <StatusAppBar title={t('Settings')} />
      <View style={styles.content}>
        <List.Item
          title={t('about')}
          left={props => <List.Icon {...props} icon="information-outline" />}
          right={props => <Icon {...props} name="chevron-right" size={24} />}
          onPress={() => navigation.navigate('About')}
        />
        <List.Item
          title={t('terms')}
          left={props => <List.Icon {...props} icon="file-document-outline" />}
          right={props => <Icon {...props} name="chevron-right" size={24} />}
          onPress={() => navigation.navigate('Terms')}
        />
        <List.Item
          title={t('privacy')}
          left={props => <List.Icon {...props} icon="lock-outline" />}
          right={props => <Icon {...props} name="chevron-right" size={24} />}
          onPress={() => navigation.navigate('Privacy')}
        />
        <List.Item
          title={t('exit')}
          left={props => <List.Icon {...props} icon="exit-to-app" />}
          right={props => <Icon {...props} name="chevron-right" size={24} />}
          onPress={handleExit}
        />
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
    padding: 5,
  }
});

export default Setting;
