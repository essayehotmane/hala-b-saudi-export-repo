// firebaseConfig.js
import {initializeApp} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBGhocrxzl-ktl71kLLGa31oJHZ_M0HgcA',
  authDomain: 'hala-b-saudi-dev-rn.firebaseapp.com',
  projectId: 'hala-b-saudi-dev-rn',
  storageBucket: 'hala-b-saudi-dev-rn.appspot.com',
  messagingSenderId: '1011836830979',
  appId: '1:1011836830979:web:606d5bde53e437e2f51536',
};

let firebaseApp;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
};
