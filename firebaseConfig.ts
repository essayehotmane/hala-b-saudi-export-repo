// firebaseConfig.js
import {initializeApp} from '@react-native-firebase/app';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCt4uclZlMYmPJRNLLEpqNaYQyT9Przcm0',
//   authDomain: 'hala-b-saudi-test.firebaseapp.com',
//   projectId: 'hala-b-saudi-test',
//   storageBucket: 'hala-b-saudi-test.appspot.com',
//   messagingSenderId: '779379508475',
//   appId: '1:779379508475:web:9fc1f20e48508c3b561c5e',
//   measurementId: 'G-M33QM9EME8',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyA6dRC22bmr79LQBZ-ipoXhLJcyvpULizk',
  authDomain: 'hala-b-saudi.firebaseapp.com',
  projectId: 'hala-b-saudi',
  storageBucket: 'hala-b-saudi.appspot.com',
  messagingSenderId: '939551727593',
  appId: '1:939551727593:web:20cb4b5b1f39be1fa83578',
  measurementId: 'G-3B770ZRGMK',
};

let firebaseApp;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
};
