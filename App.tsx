import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import GetStarted from './app/screens/authentication/GetStarted';
import Login from './app/screens/authentication/Login';
import InsideLayout from './app/InsideLayout';
import {store} from './app/slices/store';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import ServicePage from './app/screens/Service';
import ServiceDetailsPage from './app/screens/ServiceDetails';
import HistoryDetailsPage from './app/screens/HistoryDetails';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkUserInStorage = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false); // Set loading to false after checking storage
    };

    checkUserInStorage();

    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        try {
          // Save the user in AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Failed to save user to AsyncStorage', error);
        }
      } else {
        setUser(null);
        try {
          await AsyncStorage.removeItem('user');
        } catch (error) {
          console.error('Failed to remove user from AsyncStorage', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00502A" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {user ? (
            <>
              <Stack.Screen
                name="Inside"
                component={InsideLayout}
                initialParams={{user}}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Service"
                component={ServicePage}
                initialParams={{user}}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ServiceDetails"
                component={ServiceDetailsPage}
                initialParams={{user}}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="HistoryDetails"
                component={HistoryDetailsPage}
                initialParams={{user}}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="GetStarted"
                component={GetStarted}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
