import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MyCheckboxProps {
  onChange: (checked: boolean) => void;
}
const MyCheckbox: React.FC<MyCheckboxProps> = ({onChange}) => {
  const [checked, setChecked] = useState(true);

  const handlePress = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={handlePress}>
      {checked && <Icon name="checkmark" size={20} color="white" />}
    </Pressable>
  );
};
export default MyCheckbox;

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#00502A',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#00502A',
  },
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 18,
  },
});
