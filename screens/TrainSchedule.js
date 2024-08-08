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

import {Formik} from 'formik';
import * as Yup from 'yup';

import {firebase, storage} from '../firebase';
import XLSX from 'xlsx';

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
  };

  useEffect(() => {
    initializeLanguage();
  }, []);

  const onSubmit = (values, {resetForm}) => {
    setMessage('Request submitted successfully!');
    setVisible(true);
    resetForm();
    console.log(values);
    fetchExcelFile(language);
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

  const fetchExcelFile = async language => {
    let pathType = '';
    console.log(language);
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

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData);
        setData(jsonData);
      };
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error(error);
    }
  };

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
                <TextInput
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
                )}

                <View style={styles.pickerContainer}>
                  <Button
                    mode="elevated"
                    onPress={() => setShowDatePicker(true)}
                    style={styles.button}>
                    Select Date
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
                    Select Time
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
                  Find
                </Button>
              </>
            )}
          </Formik>

          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View>
                <Text>{JSON.stringify(item)}</Text>
              </View>
            )}
          />

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
});

export default TrainSchedule;
