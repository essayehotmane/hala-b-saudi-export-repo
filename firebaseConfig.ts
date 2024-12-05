// firebaseConfig.js
import {initializeApp} from '@react-native-firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
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
//let rnfbProvider;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
//     rnfbProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
// rnfbProvider.configure({
//   web: {
//     provider: 'reCaptchaV3',
//     siteKey: '6LccPYoqAAAAAL_WMyF3O7vWwQK22EcQsJkunf1K',
//   },
// });
//     firebase.appCheck().initializeAppCheck({ provider: rnfbProvider, isTokenAutoRefreshEnabled: true });
  }
};

// site key  captcha: 6LccPYoqAAAAAL_WMyF3O7vWwQK22EcQsJkunf1K
// secret key: 6LccPYoqAAAAACuTEds8uXsuaoLE6TxahP04JZGY