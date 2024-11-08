// Login.js
import React, {useRef, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import {FIREBASE_AUTH} from '../../../firebaseConfig';
import {PhoneAuthProvider, signInWithCredential} from 'firebase/auth';
import {NavigationProp} from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const GetStarted = ({navigation}: RouterProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    const phoneProvider = new PhoneAuthProvider(FIREBASE_AUTH);
    console.log('2');

    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId)
      .catch(error => {
        console.error(phoneNumber + ' ' + error);
      });

    console.log('2');
  };

  const confirmCode = () => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    signInWithCredential(FIREBASE_AUTH, credential)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <ImageBackground
      source={require('../../../assets/login-bg.png')}
      style={styles.background}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo-white.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          title="Login">
          <Text style={styles.loginButtonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 350,
  },
  logo: {
    width: 260, // Adjust the width as needed
    height: 260, // Adjust the height as needed
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#4B0082',
    fontSize: 18,
  },
});
