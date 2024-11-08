import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import MyIcon from '../../components/MyIcon';
import DistanceFromDevice from '../../components/DistanceFromDevice';
import OpenClosedStatus from '../../components/OpenClosedStatus';
import {useDispatch, useSelector} from 'react-redux';
import {Service} from '../../Interfaces/IService';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import HeaderLogo from '../../components/HeaderLogo';
import {RootState} from '../../slices/store';
import {fetchFavorites} from '../../features/favorite/favoriteSlice';
import {getUserFromStorage, issueToken} from '../../features/user/userSlice';
import {
  fetchTranslations,
  loadingLanguage,
  selectLanguage,
  selectTranslations,
  setLanguage,
} from '../../features/translation/translationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const Favorite = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {favorites, loadingFavorite, error} = useSelector(
    (state: RootState) => state.favorite,
  );
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

  const getTokenAndFetchFavorites = useCallback(async () => {
    try {
      const _token = await dispatch(
        issueToken(connectedUser.phoneNumber?.replace('+', '')),
      ).unwrap();
      const savedUser = await dispatch(getUserFromStorage()).unwrap();
      await dispatch(
        fetchFavorites({userId: savedUser.id, token: _token.token}),
      ).unwrap();
    } catch (error) {
      console.error('Error issuing token or fetching favorites:', error);
    }
  }, [dispatch, connectedUser]);

  useFocusEffect(
    useCallback(() => {
      getTokenAndFetchFavorites();
    }, [getTokenAndFetchFavorites]),
  );

  const renderItem = ({item}: {item: Service}) => (
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
            kmText={capitalizeFirstLetter(t('km'))}
            mText={capitalizeFirstLetter(t('m'))}
            loadingText={capitalizeFirstLetter(t('loading'))}
          />
        </View>
        <View style={styles.itemClosedOpenView}>
          <OpenClosedStatus
            openAt={item?.open_at || '00:00'}
            closeAt={item?.close_at || '00:00'}
            openText={capitalizeFirstLetter(t('open'))}
            closeText={capitalizeFirstLetter(t('closed'))}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loadingFavorite || languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  // Check if there are no favorite and display a message
  if (!loadingFavorite && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderLogo pageTitle={capitalizeFirstLetter(t('favorites'))} />
        <Text style={styles.noDataText}>
          {capitalizeFirstLetter(t('no_favorites_available'))}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderLogo
        isRtl={language === 'ar'}
        pageTitle={capitalizeFirstLetter(t('favorites'))}
      />
      <FlatList
        data={favorites || []} // Ensure favorites is an array
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
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
});

export default Favorite;
