// components/Card.js
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {Avatar, Button, Card, Text} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import constants from '../../src/constants';
import {useTranslation} from 'react-i18next';

const DashboardCard = ({title, icon, onPress}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardWrapper}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={60} color="white" />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleLarge" className="text-white text-center">
            {t(title)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
    margin: '1%',
  },
  card: {
    backgroundColor: constants.colors.blue,
    flex: 1, 
    padding: 16,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
  },
});

export default DashboardCard;
