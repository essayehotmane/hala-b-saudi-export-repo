import React, {useState, useEffect} from 'react';
import {Text, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface DistanceFromDeviceProps {
  targetLat: number;
  targetLong: number;
  kmText: string;
  mText: string;
  loadingText: string;
}

const DistanceFromDevice: React.FC<DistanceFromDeviceProps> = ({
  targetLat,
  targetLong,
  kmText,
  mText,
  loadingText,
}) => {
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location to provide better services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          calculateDistance();
        } else {
          setDistance('?');
        }
      } else {
        calculateDistance();
      }
    };

    const calculateDistance = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude: userLat, longitude: userLong} = position.coords;

          const haversineDistance = (
            lat1: number,
            lon1: number,
            lat2: number,
            lon2: number,
          ) => {
            const toRad = (value: number) => (value * Math.PI) / 180;
            const R = 6371; // Radius of the Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
          };

          const distanceInKm = haversineDistance(
            userLat,
            userLong,
            targetLat,
            targetLong,
          );

          // Display in meters if less than 1 km
          if (distanceInKm < 1) {
            const distanceInMeters = distanceInKm * 1000;
            setDistance(distanceInMeters.toFixed(0) + ' ' + mText);
          } else {
            setDistance(distanceInKm.toFixed(2) + ' ' + kmText);
          }
        },
        error => {
          console.error(error);
          setDistance('?');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, [targetLat, targetLong]);

  return distance ? (
    <Text style={{fontSize: 14, color: '#A4A3A3'}}>{distance}</Text>
  ) : (
    <Text style={{fontSize: 8, color: '#A4A3A3'}}>{loadingText}</Text>
  );
};

export default DistanceFromDevice;
