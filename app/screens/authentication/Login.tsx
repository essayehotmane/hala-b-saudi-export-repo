import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {initializeFirebase} from '../../../firebaseConfig';
import auth from '@react-native-firebase/auth';
import {NavigationProp} from '@react-navigation/native';
import MyCheckbox from '../../components/MyCheckbox';
import MySelectCountry from '../../components/MySelectCountry';
import HeaderLogo from '../../components/HeaderLogo';
import MyModal from '../../components/MyModal';
import OtpInput from '../../components/OtpInput';
import {consts} from '../../../consts';
import {Linking} from 'react-native';
import {
  fetchTranslations,
  selectLanguage,
  selectTranslations,
  loadingLanguage,
  setLanguage,
} from '../../features/translation/translationSlice';
import {useDispatch, useSelector} from 'react-redux';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({navigation}: RouterProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(consts.LOCAL_DATA[0].code);
  const [showNumberForm, setshowNumberForm] = useState(true);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(true);
  const [isTermsChecked, setIsTermsChecked] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const dispatch = useDispatch();
  const [confirmResult, setConfirmResult] = useState(null);
  const otpInputs = useRef<Array<TextInput | null>>([]);
  const language = useSelector(selectLanguage);
  const languageLoading = useSelector(loadingLanguage);
  const translations = useSelector(selectTranslations);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // const [copiedText, setCopiedText] = useState('');

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    // setCopiedText(text);
    const newOtp = [...otp];

    text.split('').forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  useEffect(() => {
    // Fetch translations when the component mounts
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        console.log('savedLanguage ? ', savedLanguage);
        if (savedLanguage) {
          dispatch(setLanguage(savedLanguage));
        } else {
          dispatch(setLanguage('en')); // if there is any language in AS set 'en'
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };

    loadLanguage();
  }, [dispatch]);

  useEffect(() => {
    if (language) {
      console.log('loaded language ? ', language);
      dispatch(fetchTranslations(language));
    }
  }, [language, dispatch]);

  const t = (key: string) => translations[key] || key;

  useEffect(() => {
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, []);

  const handleNextPress = () => {
    if (phoneNumber.length >= 9) {
      // TODO : check this
      // Adjusted for phone number length
      if (isPrivacyChecked && isTermsChecked) {
        setModalVisible(true);
      } else {
        console.log('sdfsdf');
        Alert.alert(
          capitalizeFirstLetter(t('confirm')),
          capitalizeFirstLetter(t('accept_pp_and_tou')),
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
      }
    } else {
      Alert.alert(
        capitalizeFirstLetter(t('confirm')),
        capitalizeFirstLetter(t('alert_valid_number')),
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Remove non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Format the cleaned number
    return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
  };

  const handleChangeText = (text: string) => {
    // Format the phone number
    const formattedText = formatPhoneNumber(text);
    setPhoneNumber(formattedText);
  };

  useEffect(() => {
    initializeFirebase(); // Initialize Firebase when the app starts
  }, []);

  const signInWithPhoneNumber = async phoneNumber => {
    try {
      console.log('number ?', code + phoneNumber);
      setIsLoginLoading(true);

      const confirmation = await auth().signInWithPhoneNumber(
        code + phoneNumber,
      );
      setConfirmResult(confirmation);
      setshowNumberForm(false);
      setModalVisible(false);
    } catch (error) {
      setIsLoginLoading(false);
      console.log('Error signing in: ', error);
    }
  };

  const confirmCode = async () => {
    const fullOtpCode = otp.join('');
    if (fullOtpCode.length < 6) {
      Alert.alert(
        capitalizeFirstLetter(t('confirm')),
        capitalizeFirstLetter(t('fill_the_code')),
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
      return;
    }

    if (confirmResult) {
      try {
        await confirmResult.confirm(fullOtpCode);
        console.log('Phone authentication successful');
      } catch (error) {
        Alert.alert(
          capitalizeFirstLetter(t('confirm')),
          capitalizeFirstLetter(t('invalid_code')),
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        console.error('Sign-in error:', error);
      }
    } else {
      console.error('No confirmation result available');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      fetchCopiedText();
      otpInputs.current[5]?.focus();
      return;
    }

    // hide the keyboard if is the last input
    if (index >= 5) {
      Keyboard.dismiss();
    }

    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < otpInputs.current.length - 1) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  if (languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderLogo />
      {showNumberForm ? (
        <View style={styles.form}>
          <MySelectCountry onChange={value => setCode(value)} />
          <TextInput
            style={styles.phoneInput}
            placeholder={capitalizeFirstLetter(t('your_phone_number'))}
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handleChangeText}
            maxLength={15} // Adjust length as needed
          />

          <View style={styles.checkboxRow}>
            <MyCheckbox
              checked={isPrivacyChecked}
              onChange={() => setIsPrivacyChecked(!isPrivacyChecked)}
              label="I accept the privacy policy"
            />
            <Text style={styles.checkboxText}>
              {capitalizeFirstLetter(t('privacy_policy_1'))}{' '}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL(consts.PRIVACY_POLICY_LINK)}>
                {capitalizeFirstLetter(t('privacy_policy_2'))}{' '}
              </Text>
              {capitalizeFirstLetter(t('privacy_policy_3'))}
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <MyCheckbox
              checked={isTermsChecked}
              onChange={() => setIsTermsChecked(!isTermsChecked)}
              label="I accept the terms of use"
            />
            <Text style={styles.checkboxText}>
              {capitalizeFirstLetter(t('terms_1'))}{' '}
              <Text
                style={styles.linkText}
                onPress={() => Linking.openURL(consts.TERMS_OF_USE_LINK)}>
                {capitalizeFirstLetter(t('terms_2'))}
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={handleNextPress} style={styles.button}>
            <Text style={styles.buttonText}>
              {capitalizeFirstLetter(t('next'))}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>
            {capitalizeFirstLetter(t('enter_code_sent'))}
            {' : '}{' '}
          </Text>
          <Text style={styles.label}>{code + ' ' + phoneNumber}</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <OtpInput
                key={index}
                number={digit}
                onChange={handleOtpChange}
                onKeyPress={handleOtpKeyPress}
                index={index}
                inputRef={ref => (otpInputs.current[index] = ref)}
              />
            ))}
          </View>
          <TouchableOpacity onPress={confirmCode} style={styles.button}>
            <Text style={styles.buttonText}>
              {capitalizeFirstLetter(t('confirm'))}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <MyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => signInWithPhoneNumber(phoneNumber)}
        code={code}
        number={phoneNumber}
        title={capitalizeFirstLetter(t('is_this_the_correct_number'))}
        editText={capitalizeFirstLetter(t('edit'))}
        nextText={capitalizeFirstLetter(t('next'))}
        isLoading={isLoginLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: 130,
  },
  phoneInput: {
    color: 'black',
    marginBottom: 50,
    width: '100%',
    height: 60,
    padding: 10,
    borderColor: '#ccc',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#ECF1EE',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00502A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  label: {
    textAlign: 'center',
    color: '#666',
    fontSize: 20,
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 20,
  },
  checkboxRow: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
    textAlign: 'left',
  },
  linkText: {
    color: '#447159',
    textDecorationLine: 'underline',
  },
  otpContainer: {
    marginTop: 40,
    marginBottom: 120,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default Login;
