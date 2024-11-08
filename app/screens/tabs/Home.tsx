import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  saveUserToStorage,
  updateOrCreateUserInAPI,
  getUserFromStorage,
  issueToken,
  saveCityToStorage,
  getCityFromStorage,
} from '../../features/user/userSlice';
import {RootState} from '../../slices/store';
import FullNameModal from '../../components/FullNameModal';
import {useRoute, useNavigation} from '@react-navigation/native';
import HeaderLogo from '../../components/HeaderLogo';
import {fetchCategories} from '../../features/category/categorySlice';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import {fetchCountries} from '../../features/country/countrySlice';
import CountryCitySelector from '../../components/CountryCitySelector';
import {fetchCities} from '../../features/city/citySlice';
import {
  fetchTranslations,
  selectLanguage,
  selectTranslations,
  loadingLanguage,
  setLanguage,
} from '../../features/translation/translationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Service} from '../../Interfaces/IService';

const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {categories, loading, currentPage, totalPages} = useSelector(
    (state: RootState) => state.category,
  );
  const countries = useSelector((state: RootState) => state.country.countries);
  const cities = useSelector((state: RootState) => state.city.cities);
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [
    isCountryAndCitySelectionVisible,
    setIsCountryAndCitySelectionVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const language = useSelector(selectLanguage);
  const languageLoading = useSelector(loadingLanguage);
  const translations = useSelector(selectTranslations);

  const connectedUser = route.params?.user;

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
    // Fetch user from AsyncStorage
    const getUserFromAS = async () => {
      try {
        const _user = await dispatch(getUserFromStorage()).unwrap();
        if (_user) {
          setIsModalVisible(false);
        } else {
          const response = await dispatch(
            issueToken(connectedUser.phoneNumber?.replace('+', '')),
          ).unwrap();
          if (response) {
            if (response.user.name) {
              await dispatch(saveUserToStorage(response.user));
            } else {
              setIsModalVisible(true);
            }
          }
        }
        const selectedCity = await dispatch(getCityFromStorage());
        if (selectedCity) {
          const city = selectedCity.payload || null;
          if (!city) {
            const getCountriesAncCities = async () => {
              try {
                const response = await dispatch(
                  issueToken(connectedUser.phoneNumber?.replace('+', '')),
                ).unwrap();
                if (response) {
                  await dispatch(fetchCountries(response.token)).unwrap();
                  await dispatch(fetchCities(response.token)).unwrap();
                }
              } catch (error) {
                console.error(
                  'Error issuing token or fetching countries and cities:',
                  error,
                );
              }
            };
            getCountriesAncCities();
            setIsCountryAndCitySelectionVisible(true);
          }
        }

        setIsLoading(false);
      } catch (error) {
        setIsModalVisible(true);
        console.error('Error fetching user:', error);
      }
    };
    getUserFromAS();
  }, [dispatch]);

  useEffect(() => {
    const getTokenAndFetchCategories = async () => {
      try {
        const response = await dispatch(
          issueToken(connectedUser.phoneNumber?.replace('+', '')),
        ).unwrap();
        if (response) {
          const token = response.token;
          await dispatch(fetchCategories({token, page: 1})).unwrap();
        }
      } catch (error) {
        console.error('Error issuing token or fetching categories:', error);
      }
    };

    getTokenAndFetchCategories();
  }, [dispatch]);

  const handleSaveUser = async () => {
    if (username.trim()) {
      try {
        const phone = connectedUser?.phoneNumber;
        const response = await dispatch(
          updateOrCreateUserInAPI({
            name: username,
            phone: phone.replace('+', ''),
          }),
        ).unwrap();

        if (response) {
          // Ensure `response.user` is not undefined
          await dispatch(saveUserToStorage(response.user)).unwrap();
        }

        setIsModalVisible(false);
        try {
          const response = await dispatch(
            issueToken(connectedUser.phoneNumber?.replace('+', '')),
          ).unwrap();
          if (response) {
            await dispatch(fetchCategories(response.token)).unwrap();
          }
        } catch (error) {
          console.error('Error issuing token or fetching categories:', error);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error saving user:', error.message);
      }
    }
  };

  const handleUsernameChange = (text: string) => setUsername(text);

  const handleSaveCity = async selectedCity => {
    try {
      await dispatch(saveCityToStorage(selectedCity)).unwrap();
      setIsCountryAndCitySelectionVisible(false);
    } catch (error) {
      console.error('Error saving city:', error);
    }
  };

  const loadMoreCategories = async () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      const response = await dispatch(
        issueToken(connectedUser.phoneNumber?.replace('+', '')),
      ).unwrap();
      if (response) {
        const token = response.token;
        await dispatch(fetchCategories({token, page: nextPage})).unwrap();
      }
    }
  };

  if (isModalVisible) {
    return (
      <View style={styles.container}>
        <FullNameModal
          visible={isModalVisible}
          title={capitalizeFirstLetter(t('your_full_name'))}
          username={username}
          onConfirm={handleSaveUser}
          onChange={handleUsernameChange}
        />
      </View>
    );
  }

  if (isCountryAndCitySelectionVisible) {
    return (
      <Modal
        transparent={true}
        visible={isCountryAndCitySelectionVisible}
        animationType="fade"
        onRequestClose={() => {}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <CountryCitySelector
              title={capitalizeFirstLetter(t('select_country_city'))}
              confirmText={capitalizeFirstLetter(t('confirm'))}
              selectCountryText={capitalizeFirstLetter(t('select_country'))}
              selectCityText={capitalizeFirstLetter(t('select_city'))}
              countries={countries}
              cities={cities}
              onSelect={cityId => {
                handleSaveCity(cityId);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  if (isLoading || loading || languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  // Check if there are no services and display a message
  if (!loading && categories.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderLogo
          isRtl={language === 'ar'}
          pageTitle={capitalizeFirstLetter(t('categories'))}
        />
        <Text style={styles.noDataText}>
          {capitalizeFirstLetter(t('no_categories_available'))}
        </Text>
      </View>
    );
  }

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.categoryContainer}
        onPress={() =>
          navigation.navigate('Service', {category: item, user: connectedUser})
        }>
        <Image source={{uri: item.logo}} style={styles.categoryImage} />
        <View style={styles.overlay}>
          <Text style={styles.categoryText}>
            {capitalizeFirstLetter(t(item.name))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderLogo
        isRtl={language === 'ar'}
        pageTitle={capitalizeFirstLetter(t('categories'))}
      />
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          currentPage < totalPages ? (
            <TouchableOpacity
              onPress={loadMoreCategories}
              style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>
                {capitalizeFirstLetter(t('load_more'))}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
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
  categoryContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 80, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  countrySelectorText: {
    marginTop: 100,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00502A',
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#A4A3A3',
    textAlign: 'center',
    marginTop: 20,
  },
  loadMoreText: {
    color: '#737272',
    fontSize: 16,
    textAlign: 'center',
  },
  loadMoreButton: {
    marginVertical: 20,
    padding: 10,
    alignItems: 'center',
  },
});

export default Home;
