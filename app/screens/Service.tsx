import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import HeaderLogo from '../components/HeaderLogo';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import MyIcon from '../components/MyIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../slices/store';
import {clearServices, fetchServices} from '../features/service/serviceSlice';
import {Service} from '../Interfaces/IService';
import OpenClosedStatus from '../components/OpenClosedStatus';
import DistanceFromDevice from '../components/DistanceFromDevice';
import {useNavigation} from '@react-navigation/native';
import {getCityFromStorage, issueToken} from '../features/user/userSlice';
import {
  fetchTranslations,
  loadingLanguage,
  selectLanguage,
  selectTranslations,
  setLanguage,
} from '../features/translation/translationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const ServicePage = ({route}) => {
  const {category, user} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {services, loading, error, currentPage, totalPages} = useSelector(
    (state: RootState) => state.service,
  );
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

  // Fetch services when the component mounts
  useEffect(() => {
    const getTokenAndFetchServices = async () => {
      try {
        const selectedCity = await dispatch(getCityFromStorage());
        const response = await dispatch(
          issueToken(user.phoneNumber?.replace('+', '')),
        ).unwrap();
        if (response && selectedCity) {
          const token = response.token;
          const categoryId = category.id;
          const cityId = selectedCity.payload;

          dispatch(clearServices());

          await dispatch(
            fetchServices({token, categoryId, cityId: 1, page: 1}), // get all DOHA's services
          ).unwrap();
        }
      } catch (error) {
        console.error('Error issuing token or fetching services:', error);
      }
    };

    getTokenAndFetchServices();
  }, [dispatch]);

  const loadMoreServices = async () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      const selectedCity = await dispatch(getCityFromStorage());
      const response = await dispatch(
        issueToken(user.phoneNumber?.replace('+', '')),
      ).unwrap();
      if (response && selectedCity) {
        const token = response.token;
        const categoryId = category.id;
        const cityId = selectedCity.payload;
        await dispatch(
          fetchServices({token, categoryId, cityId: 1, page: nextPage}), // get all DOHA's services
        ).unwrap();
      }
    }
  };

  const renderItem = ({item}: {item: Service}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ServiceDetails', item)}>
        <Image source={{uri: item.logo}} style={styles.itemImage} />
        <Text style={styles.itemTitle} numberOfLines={1}>
          {capitalizeFirstLetter(item.name)}
        </Text>
        <View style={styles.itemDetails}>
          <View style={styles.itemDistanceView}>
            <MyIcon color="red" icon="location" size={16} style={styles.icon} />
            <DistanceFromDevice
              targetLat={parseFloat(item?.lat || '0')}
              targetLong={parseFloat(item?.long || '0')}
              kmText={t('km')}
              mText={t('km')}
              loadingText={capitalizeFirstLetter(t('loading'))}
            />
          </View>
          <View style={styles.itemClosedOpenView}>
            <OpenClosedStatus
              openAt={item?.open_at || '00:00'}
              closeAt={item?.close_at || '00:00'}
              openText={t('open')}
              closeText={t('closed')}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading || languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  // Check if there are no services and display a message
  if (!loading && services.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderLogo
          isRtl={language === 'ar'}
          pageTitle={capitalizeFirstLetter(t(category.name))}
        />
        <Text style={styles.noDataText}>
          {capitalizeFirstLetter(t('no_services_available'))}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderLogo
        isRtl={language === 'ar'}
        pageTitle={capitalizeFirstLetter(t(category.name))}
      />
      <FlatList
        data={services} // Directly use the services array
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        ListFooterComponent={
          currentPage < totalPages ? (
            <TouchableOpacity
              onPress={loadMoreServices}
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

export default ServicePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: width / 2 - 40,
    margin: 5,
    padding: 5,
    paddingBottom: 10,
    backgroundColor: '#ECF1EE',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    color: 'black',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  itemImage: {
    maxWidth: '100%',
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  itemDistanceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemClosedOpenView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: 14,
    color: '#A4A3A3',
    marginLeft: 5,
  },
  openClosedText: {
    fontSize: 14,
    color: '#00502A',
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
