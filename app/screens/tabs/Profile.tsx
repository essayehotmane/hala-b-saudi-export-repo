import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert, View, ActivityIndicator} from 'react-native';
import HeaderLogo from '../../components/HeaderLogo';
import HistoryItem from '../../components/HistoryItem';
import AccountModal from '../../components/AccountModal';
import LanguageSelectorModal from '../../components/LanguageSelectorModal';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUserFromStorage,
  issueToken,
  updateOrCreateUserInAPI,
} from '../../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import {consts} from '../../../consts';
import {
  fetchTranslations,
  loadingLanguage,
  selectLanguage,
  selectTranslations,
  setLanguage,
} from '../../features/translation/translationSlice'; // Import Firebase auth object

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const connectedUser = route.params?.user;
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] =
    useState(false);
  const [inputUsername, setInputUsername] = useState(null);
  const [username, setUsername] = useState(null);
  const [phone, setPhone] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const dispatch = useDispatch();

  const language = useSelector(selectLanguage);
  const languageLoading = useSelector(loadingLanguage);
  const translations = useSelector(selectTranslations);

  useEffect(() => {
    // Fetch translations when the component mounts
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage) {
          dispatch(setLanguage(savedLanguage));
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };

    loadLanguage();
  }, [dispatch]);

  useEffect(() => {
    if (language) {
      dispatch(fetchTranslations(language));
    }
  }, [language, dispatch]);

  const t = (key: string) => translations[key] || key;

  useEffect(() => {
    const getTokenAndFetchFavorites = async () => {
      try {
        const _token = await dispatch(
          issueToken(connectedUser.phoneNumber?.replace('+', '')),
        ).unwrap();
        const savedUser = await dispatch(getUserFromStorage()).unwrap();
        console.log('saved user ?', savedUser);
        setUsername(savedUser.name);
        setInputUsername(savedUser.name);
        setUserId(savedUser.id);
        setPhone(savedUser.phone);
        setToken(_token.token);
      } catch (error) {
        console.error('Error issuing token in profile tab', error);
      }
    };

    getTokenAndFetchFavorites();
  }, [dispatch]);

  const confirmLogout = () => {
    Alert.alert(
      capitalizeFirstLetter(t('confirm')),
      capitalizeFirstLetter(t('confirm_logout')),
      [
        {
          text: capitalizeFirstLetter(t('cancel')),
          style: 'cancel',
        },
        {
          text: capitalizeFirstLetter(t('ok')),
          onPress: handleLogout,
        },
      ],
      {cancelable: true},
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      capitalizeFirstLetter(t('confirm')),
      capitalizeFirstLetter(t('Are you sure you want to delete your account?')),
      [
        {
          text: capitalizeFirstLetter(t('cancel')),
          style: 'cancel',
        },
        {
          text: capitalizeFirstLetter(t('Ok')),
          onPress: handleDeleteAccount,
        },
      ],
      {cancelable: true},
    );
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.clear();
      navigation.navigate('Login'); // Navigate to Login screen after logout
    } catch (error) {
      alert(`Error during logout: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        await user.delete(); // Delete the Firebase auth account
        handleLogout();
      } else {
        alert('No user found to delete.');
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert(
          'You need to re-login before deleting your account. Please log in again and try.',
        );
        navigation.navigate('Login'); // Navigate to Login to re-authenticate
      } else {
        alert(`Error during account deletion: ${error.message}`);
      }
    }
  };

  const handleUsernameSave = async (newName: string) => {
    try {
      const savedUser = await dispatch(getUserFromStorage()).unwrap();
      const updatedUser = {
        ...savedUser,
        name: newName,
      };
      await dispatch(
        updateOrCreateUserInAPI({name: newName, phone: phone}),
      ).unwrap();
      await AsyncStorage.setItem(
        consts.SAVED_USER,
        JSON.stringify(updatedUser),
      );
      setUsername(newName);
      setIsAccountModalVisible(false);
    } catch (error) {
      console.error('Failed to save username:', error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    console.log('change language to ?', lang);
    dispatch(setLanguage(lang));
    setIsLanguageSelectorVisible(false); // Close the modal after confirming the selection
  };

  const listContent = [
    {
      icon: 'list-outline',
      title: capitalizeFirstLetter(t('discount_history')),
      onClick: () => {
        navigation.navigate('HistoryDetails', {
          userId: userId,
          username: username,
          token: token,
        });
      },
    },
    {
      icon: 'person-outline',
      title: capitalizeFirstLetter(t('account')),
      onClick: () => {
        setIsAccountModalVisible(true);
      },
    },
    {
      icon: 'language-outline',
      title: capitalizeFirstLetter(t('language')),
      onClick: () => {
        setIsLanguageSelectorVisible(true);
      },
    },
    // {
    //   icon: 'trash-outline',
    //   title: capitalizeFirstLetter(t('delete_my_account_and_data')),
    //   onClick: () => {},
    // },
    {
      icon: 'log-out-outline',
      title: capitalizeFirstLetter(t('logout')),
      onClick: confirmLogout,
    },
    {
      icon: 'trash-outline',
      title: capitalizeFirstLetter(t('delete_my_account_and_data')),
      onClick: confirmDelete,
    },
  ];

  if (languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderLogo
        isRtl={language === 'ar'}
        pageTitle={`${capitalizeFirstLetter(
          t('hello'),
        )}, ${capitalizeFirstLetter(username)}`}
      />

      <AccountModal
        visible={isAccountModalVisible}
        username={capitalizeFirstLetter(inputUsername)}
        phoneNumber={phone}
        onClose={() => {
          setIsAccountModalVisible(false);
        }}
        onChange={text => setInputUsername(text)}
        onConfirm={text => handleUsernameSave(text)} // Correct the prop name here
        buttonText={capitalizeFirstLetter(t('save'))}
      />

      <LanguageSelectorModal
        visible={isLanguageSelectorVisible}
        onClose={() => {
          setIsLanguageSelectorVisible(false);
        }}
        onConfirm={handleLanguageChange} // Correct the prop name here
      />

      {listContent.map(_row => (
        <HistoryItem
          key={_row.title} // Use a unique key
          icon={_row.icon}
          title={_row.title}
          isRtl={language === 'ar'}
          onClick={_row.onClick}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    marginBottom: 200,
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
