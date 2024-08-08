import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDAafBHFxMpRGc-1tUbuLaRze4q2uxAHPY',
  authDomain: 'route-founder-8db52.firebaseapp.com',
  databaseURL: 'https://route-founder-8db52.firebaseio.com',
  projectId: 'route-founder-8db52',
  storageBucket: 'route-founder-8db52.appspot.com',
  messagingSenderId: '388627227296',
  appId: '1:388627227296:android:a872c8f5dfb4d03d259fc5',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase, storage};
