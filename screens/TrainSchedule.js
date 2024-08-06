import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import StatusAppBar from '../components/StatusBar/Appbar';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput, Button, Snackbar, Portal} from 'react-native-paper';

import {Formik} from 'formik';
import * as Yup from 'yup';

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const TrainSchedule = () => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');

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
    console.log(savedLanguage);
  };

  useEffect(() => {
    initializeLanguage();
  }, []);

  const onSubmit = (values, {resetForm}) => {
    setMessage('Form submitted successfully!');
    setVisible(true);
    resetForm(); // Reset the form fields after submission
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <StatusAppBar title={t('Train Schedule')} />
      <View style={styles.content}>
        <Formik
          initialValues={{name: '', email: '', password: ''}}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInput
                label="Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                style={styles.input}
                error={touched.name && !!errors.name}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <TextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                style={styles.input}
                error={touched.email && !!errors.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                style={styles.input}
                error={touched.password && !!errors.password}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}>
                Submit
              </Button>
            </>
          )}
        </Formik>

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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default TrainSchedule;
