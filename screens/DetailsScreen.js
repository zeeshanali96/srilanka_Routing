import React, {useState} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {
  Card,
  Text,
  Title,
  Paragraph,
  Snackbar,
  Portal,
  DefaultTheme,
} from 'react-native-paper';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';
import constants from '../src/constants';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Provider as PaperProvider} from 'react-native-paper';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

const DetailsScreen = ({route}) => {
  const {t} = useTranslation();
  const {scheduledata} = route.params;
  const [visible, setVisible] = useState(true);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: constants.colors.blue,
    },
  };

  const hideSnackbar = () => setVisible(false);

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
    <PaperProvider theme={theme}>
      <StatusAppBar title={t('Train Schedule')} />
      <ScrollView contentContainerStyle={styles.container}>
        {scheduledata.length > 0 ? (
          scheduledata.map((train, index) => (
            <View key={train.id}>
              <TrainCard data={train} />
              {index === 2 && (
                <VideoPlayer
                  source={require('../src/assets/videos/train_route.mp4')}
                />
              )}
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{t('no_data')}</Text>
          </View>
        )}
      </ScrollView>
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {t('request_success')}
        </Snackbar>
      </Portal>
    </PaperProvider>
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
