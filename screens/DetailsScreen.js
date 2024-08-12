import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Card, Text, Title, Paragraph} from 'react-native-paper';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';
import constants from '../src/constants';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailsScreen = ({route}) => {
  const {t} = useTranslation();
  const {scheduledata} = route.params;

  const TrainCard = ({data}) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.pickerContainer}>
          <Title style={styles.topHeading}>{data?.train_name}</Title>
          <Title style={styles.express}>({data?.type})</Title>
        </View>
        <Paragraph>
          <Text style={styles.heading}>{t('from')}:</Text> {data?.start_form} -{' '}
          <Text style={styles.heading}>{t('to')}:</Text> {data?.end_to}
        </Paragraph>
        <View style={styles.pickerContainer}>
          <Paragraph>
            <Text style={styles.heading}>{t('date')}:</Text> {data?.date}
          </Paragraph>
          <Paragraph>
            {' '}
            <Text style={styles.heading}>{t('time')}:</Text> {data?.time}
          </Paragraph>
        </View>
        <View>
          <View style={styles.pickerContainer}>
            <Paragraph>
              <Text style={styles.heading}>{t('1st_class_fee')}:</Text>{' '}
              {data?.first_class_fee}
            </Paragraph>
            <Paragraph>
              <Text style={styles.heading}>{t('2nd_class_fee')}:</Text>{' '}
              {data?.second_class_fee}
            </Paragraph>
          </View>
          <View style={styles.pickerContainer}>
            <Paragraph>
              <Text style={styles.heading}>{t('3rd_class_fee')}:</Text>{' '}
              {data?.third_class_fee}
            </Paragraph>
            <Paragraph>
              <Text style={styles.heading}>{t('3rd_class_fee')}:</Text>{' '}
              {data?.semi_class_fee}
            </Paragraph>
          </View>
        </View>
        <Paragraph>
          <Text style={styles.heading}>{t('contact')}:</Text>{' '}
          <Icon name="phone" size={15} color="black" /> {data?.contact}
        </Paragraph>
        <Paragraph style={styles.remark}>
          {t('remark')}: {data?.remark}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View>
      <StatusAppBar title={t('Train Schedule')} />
      <ScrollView contentContainerStyle={styles.container}>
        {scheduledata.length > 0 ? (
          scheduledata.map(train => <TrainCard key={train.id} data={train} />)
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 60,
  },
  card: {
    marginBottom: 10,
    marginTop: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noDataText: {
    fontSize: 18,
    color: 'grey',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  topHeading: {
    color: constants.colors.blue,
    fontWeight: 'bold',
  },
  heading: {
    fontWeight: 'bold',
  },
  express: {
    color: constants.colors.golden,
    fontWeight: 'bold',
  },
  remark: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
