import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HeaderLogo from '../components/HeaderLogo';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import {Linking, Platform, Alert} from 'react-native';
import DiscountModal from '../components/DiscountModal';
import {useDispatch, useSelector} from 'react-redux';
import {generateDiscountCode} from '../features/discount/discountSlice';
import {RootState} from '../slices/store';
import ServiceImage from '../components/ServiceImage';
import {fetchFavorites} from '../features/favorite/favoriteSlice';
import {getUserFromStorage, issueToken} from '../features/user/userSlice';
import {
  fetchTranslations,
  loadingLanguage,
  selectLanguage,
  selectTranslations,
  setLanguage,
} from '../features/translation/translationSlice';
import CapitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceDetails = ({route}) => {
  const service = route.params;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const {code, discount, loading, error} = useSelector(
    (state: RootState) => state.discount,
  );
  const {loadingFavorite} = useSelector((state: RootState) => state.favorite);
  const connectedUser = route.params?.user;

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
        setUserId(savedUser.id);
        setToken(_token.token);
        await dispatch(
          fetchFavorites({userId: userId, token: _token.token}),
        ).unwrap();
      } catch (error) {
        console.error('Error issuing token or fetching favorites:', error);
      }
    };
    getTokenAndFetchFavorites();
  }, [dispatch]);

  const getDiscountCode = async (
    serviceId: number,
    userId: number,
    token: string,
  ) => {
    try {
      await dispatch(generateDiscountCode({serviceId, userId, token}));

      if (!loading) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error generating discount code:', error?.message);
    }
  };

  const handleGetNewCode = (
    serviceId: number,
    userId: number,
    token: string,
  ) => {
    Alert.alert(
      capitalizeFirstLetter(t('confirm')),
      capitalizeFirstLetter(t('confirm_you_want_new_code')),
      [
        {
          text: capitalizeFirstLetter(t('cancel')),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: capitalizeFirstLetter(t('ok')),
          onPress: () =>
            dispatch(generateDiscountCode({userId, serviceId, token})),
        },
      ],
      {cancelable: false},
    );
  };

  const openInMaps = (latitude: number, longitude: number) => {
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
      default: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });

    Linking.openURL(url!).catch(err => {
      console.error('Failed to open maps:', err);
    });
  };

  if (loading || loadingFavorite || languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DiscountModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        getNewCode={() => {
          handleGetNewCode(service.id, userId, token);
        }}
        code={code}
        discount={discount}
        title={capitalizeFirstLetter(t('your_discount_code_is'))}
        paragraph={
          capitalizeFirstLetter(t('single_use_1')) +
          ' ' +
          capitalizeFirstLetter(t('single_use_2'))
        }
        buttonText={capitalizeFirstLetter(t('redeem_your_discount'))}
      />

      <HeaderLogo />
      <View style={styles.imageContainer}>
        <ServiceImage
          uri={service.logo}
          serviceId={service.id}
          userId={userId}
        />
      </View>

      <View style={styles.serviceDetail}>
        <Text style={styles.title}>{capitalizeFirstLetter(service.name)}</Text>
        <Text numberOfLines={4} ellipsizeMode="tail" style={styles.desc}>
          {capitalizeFirstLetter(service.desc)}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getDiscountButton}
          onPress={() => getDiscountCode(service.id, userId, token)}>
          <Text style={styles.getDiscountText}>
            {CapitalizeFirstLetter(t('get_a_discount_code'))}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.openMapsButton}
          onPress={() => {
            openInMaps(service.lat, service.long);
          }}>
          <Text style={styles.openMapsText}>
            {CapitalizeFirstLetter(t('open_in_maps'))}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceDetails;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceDetail: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  title: {
    color: '#103B2F',
    fontSize: 23,
    fontWeight: 'bold',
  },
  desc: {
    marginTop: 10,
    color: '#5B5B5B',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'column',
    alignContent: 'center',
  },
  getDiscountButton: {
    backgroundColor: '#00502A',
    paddingVertical: 12,
    borderRadius: 15,
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  getDiscountText: {
    color: 'white',
    fontSize: 18,
  },

  openMapsButton: {
    backgroundColor: '#fff',
    borderWidth: 1.7,
    borderColor: '#00502A',
    paddingVertical: 12,
    borderRadius: 15,
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginTop: 15,
  },
  openMapsText: {
    color: '#00502A',
    fontSize: 18,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
});
