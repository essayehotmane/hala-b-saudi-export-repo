import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import MyIcon from './MyIcon';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToFavorites,
  removeFromFavorites,
} from '../features/favorite/favoriteSlice';
import {RootState} from '../slices/store';

interface ServiceImageProps {
  uri: string;
  serviceId: number;
  userId: number;
}

const ServiceImage: React.FC<ServiceImageProps> = ({
  uri,
  serviceId,
  userId,
}) => {
  const dispatch = useDispatch();
  const favoritesIds = useSelector(
    (state: RootState) => state.favorite.favoritesIds,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const {loadingAddRemoveFavorite} = useSelector(
    (state: RootState) => state.favorite,
  );
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const favoriteExists = favoritesIds.includes(serviceId);
    setIsFavorite(favoriteExists);
  }, [favoritesIds, serviceId]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites({userId, serviceId, token}));
    } else {
      dispatch(addToFavorites({userId, serviceId, token}));
    }
  };

  return (
    <>
      <Image source={{uri: uri}} style={styles.image} />
      <View style={styles.favoriteIconContainer}>
        <TouchableOpacity onPress={handleFavoriteToggle}>
          {loadingAddRemoveFavorite ? (
            <ActivityIndicator size={'large'} color={'#DE3E33'} />
          ) : (
            <MyIcon
              color="#DE3E33"
              icon={isFavorite ? 'heart' : 'heart-outline'}
              size={35}
            />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
  },
  favoriteIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 5,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ServiceImage;
