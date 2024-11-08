import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screens/tabs/Home';
import Favorite from './screens/tabs/Favorite';
import Profile from './screens/tabs/Profile';
import MyIcon from './components/MyIcon';
import {useRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function InsideLayout(props: any) {
  const route = useRoute();
  const user = route.params.user;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00502A',
        tabBarInactiveTintColor: '#d6d6d6',
      }}>
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MyIcon icon="home-outline" size={size} color={color} />
          ),
        }}
        component={Home}
        initialParams={{user}}
      />
      <Tab.Screen
        name="Favorite"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MyIcon icon="heart-outline" size={size} color={color} />
          ),
        }}
        component={Favorite}
        initialParams={{user}}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MyIcon icon="person-outline" size={size} color={color} />
          ),
        }}
        component={Profile}
        initialParams={{user}}
      />
    </Tab.Navigator>
  );
}
