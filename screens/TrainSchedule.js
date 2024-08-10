import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TextInput,
  Button,
  Snackbar,
  Portal,
  DefaultTheme,
} from 'react-native-paper';

import {Provider as PaperProvider} from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import constants from '../src/constants';

import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import {firebase, storage} from '../firebase';
import XLSX from 'xlsx';

import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

import CustomDropdown from '../components/CustomDropDown/CustomDropDown';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';
import LoadingSchedule from '../components/LoadingComponent/LoadingSchedule';
// Validation Schema
const validationSchema = Yup.object().shape({
  start_form: Yup.string().required('Start Form is required'),
  end_to: Yup.string().required('End To is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
});

const TrainSchedule = () => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [language, setLanguage] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [data, setData] = useState([]);

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingForSchedule, setloadingForSchedule] = useState(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: constants.colors.blue,
    },
  };

  const {t} = useTranslation();

  const getLanguage = async () => {
    try {
      const value = await AsyncStorage.getItem('@language');
      return value !== null ? value : 'en';
    } catch (e) {
      // Error reading value
      return 'en';
    }
  };

  const initializeLanguage = async () => {
    const savedLanguage = await getLanguage();
    // i18n.changeLanguage(savedLanguage);
    setLanguage(savedLanguage);
    fetchCities(savedLanguage);
  };

  useEffect(() => {
    initializeLanguage();
  }, []);

  const fetchCities = async savedLanguage => {
    let pathType = '';
    if (savedLanguage === 'en') {
      pathType = 'enCityDetail.xlsx';
    } else if (savedLanguage === 'si') {
      pathType = `siCityDetail.xlsx`;
    } else {
      pathType = `taCityDetail.xlsx`;
    }
    const path = `cityDetail/${savedLanguage}/${pathType}`;

    // const path = `cityDetail/citydetail.xlsx`;
    const reference = storage().ref(path);

    try {
      const url = await reference.getDownloadURL();
      const response = await fetch(url);
      const blob = await response.blob();

      const fileReader = new FileReader();
      fileReader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const citiesData = jsonData.map(item => ({
          label: item.cityName,
          value: item.cityName,
        }));
        setMessage(t('welcome_message'));
        setVisible(true);
        setCities(citiesData);
        setLoading(false);
      };
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage(t('error_message'));
      setVisible(true);
    }
  };

  const onSubmit = (values, {resetForm}) => {
    setMessage(t('request_success'));
    setVisible(true);
    resetForm();

    setloadingForSchedule(true);
    fetchExcelFile(values, language);
  };

  const hideSnackbar = () => setVisible(false);

  const onDateChange = (event, selectedDate, setFieldValue) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      // Format the date for the form
      setFieldValue('date', selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime, setFieldValue) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      // Format the time for the form
      setFieldValue('time', selectedTime.toLocaleTimeString());
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate());
    const month = String(date.getUTCMonth() + 1); // Months are 0-based
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = timeString => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const decimalToTime = decimal => {
    console.log(decimal);
    const totalMinutes = Math.round(decimal * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  };

  const fetchExcelFile = async (values, language) => {
    let pathType = '';

    if (language === 'en') {
      pathType = 'entranslate.xlsx';
    } else if (language === 'si') {
      pathType = `sitranslate.xlsx`;
    } else {
      pathType = `tatranslate.xlsx`;
    }
    const path = `train_schedule/${language}/${pathType}`;
    const reference = storage().ref(path);
    console.log(path);
    try {
      const url = await reference.getDownloadURL();
      const response = await fetch(url);
      const blob = await response.blob();

      const fileReader = new FileReader();
      fileReader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(sheet);

        // Format data
        // jsonData = jsonData.map(item => ({
        //   ...item,
        //   date: formatDate(item.date),
        //   time: item.time,
        // }));

        const searchCriteria = {
          date: formatDate(values.date),
          end_to: values.end_to,
          start_form: values.start_form,
          time: formatTime(values.time),
        };
        console.log(jsonData);
        // Filter the data
        const filteredData = jsonData.filter(item => {
          const matchesStartForm =
            searchCriteria.start_form === '' ||
            item.start_form === searchCriteria.start_form;
          const matchesEndTo =
            searchCriteria.end_to === '' ||
            item.end_to === searchCriteria.end_to;
          const matchesDate =
            searchCriteria.date === '' || item.date === searchCriteria.date;
          const matchesTime =
            searchCriteria.time === '' || item.time === searchCriteria.time;

          console.log(searchCriteria.date);
          console.log(item.date);
          // console.log(matchesStartForm, matchesEndTo, matchesDate, matchesTime);
          return matchesStartForm && matchesEndTo && matchesDate && matchesTime;
        });

        // Log or use the filtered data
        console.log('Filtered Data:', filteredData);

        // setloadingForSchedule(false);
        setData(jsonData);
      };
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error(error);
      // setloadingForSchedule(false);
      setMessage(t('error_message'));
      setVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingComponent />
      </View>
    );
  }

  if (loadingForSchedule) {
    return (
      <View style={styles.container}>
        <StatusAppBar title={t('Train Schedule')} />
        <LoadingSchedule
          videoSource={require('../src/assets/videos/train_route.mp4')}
          buttonTitle={t('click_here_for_details')}
          navigationTarget="Details"
          setLoadingForSchedule={setloadingForSchedule}
          scheduledata={data}
        />
      </View>
    );
  }

  const timeOptions = {hour: '2-digit', minute: '2-digit'};

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <StatusAppBar title={t('Train Schedule')} />
        <View style={styles.content}>
          <Formik
            initialValues={{start_form: '', end_to: '', date: '', time: ''}}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              formik,
            }) => (
              <>
                {/* <TextInput
                  label="Start From"
                  value={values.start_form}
                  onChangeText={handleChange('start_form')}
                  onBlur={handleBlur('start_form')}
                  style={styles.input}
                  error={touched.start_form && !!errors.start_form}
                />
                {touched.start_form && errors.start_form && (
                  <Text style={styles.errorText}>{errors.start_form}</Text>
                )}

                <TextInput
                  label="End To"
                  value={values.end_to}
                  onChangeText={handleChange('end_to')}
                  onBlur={handleBlur('end_to')}
                  keyboardType="end_to-address"
                  style={styles.input}
                  error={touched.end_to && !!errors.end_to}
                />
                {touched.end_to && errors.end_to && (
                  <Text style={styles.errorText}>{errors.end_to}</Text>
                )} */}

                <Field
                  name="start_form"
                  component={CustomDropdown}
                  label={t('start_from')}
                  data={cities}
                  value={
                    cities.find(option => option.value === values.start_form)
                      ?.label || ''
                  }
                  onSelect={value => setFieldValue('start_form', value)}
                  placeholder={t('start_from')}
                  error={
                    touched.start_form && errors.start_form
                      ? errors.start_form
                      : null
                  }
                  onBlur={() => {}}
                />

                <Field
                  name="end_to"
                  component={CustomDropdown}
                  label={t('end_to')}
                  data={cities}
                  value={
                    cities.find(option => option.value === values.end_to)
                      ?.label || ''
                  }
                  onSelect={value => setFieldValue('end_to', value)}
                  placeholder={t('end_to')}
                  error={touched.end_to && errors.end_to ? errors.end_to : null}
                  onBlur={() => {}}
                />

                <View style={styles.pickerContainer}>
                  <Button
                    mode="elevated"
                    onPress={() => setShowDatePicker(true)}
                    style={styles.button}>
                    {t('select_date')}
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      mode="date"
                      value={date}
                      onChange={(event, selectedDate) => {
                        onDateChange(event, selectedDate, setFieldValue);
                      }}
                    />
                  )}

                  <Button
                    mode="elevated"
                    onPress={() => setShowTimePicker(true)}
                    style={styles.button}>
                    {t('select_time')}
                  </Button>
                  {showTimePicker && (
                    <DateTimePicker
                      mode="time"
                      value={time}
                      onChange={(event, selectedDate) => {
                        onTimeChange(event, selectedDate, setFieldValue);
                      }}
                    />
                  )}
                </View>

                <View className="mt-2" style={styles.pickerContainer}>
                  {touched.end_to && errors.date && (
                    <Text style={styles.errorText}>{errors.date}</Text>
                  )}
                  {touched.end_to && errors.time && (
                    <Text style={styles.errorText}>{errors.time}</Text>
                  )}
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    {date.toLocaleDateString()}
                  </Text>
                  <Text style={styles.infoText}>
                    {time.toLocaleTimeString([], timeOptions)}
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}>
                  {t('find')}
                </Button>
              </>
            )}
          </Formik>

          {/* <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View>
                <Text>{JSON.stringify(item)}</Text>
              </View>
            )}
          /> */}
          <View className="my-5">
            <VideoPlayer
              source={require('../src/assets/videos/train_route.mp4')}
            />
          </View>

          <Portal>
            <Snackbar
              visible={visible}
              onDismiss={hideSnackbar}
              duration={Snackbar.DURATION_SHORT}>
              {message}
            </Snackbar>
          </Portal>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'none',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  infoContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    margin: 5,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
});

export default TrainSchedule;
