import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MyIconProps {
  icon: string;
  size: Number;
  color: string;
}
const MyIcon: React.FC<MyIconProps> = ({icon, size, color}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MyIcon;
