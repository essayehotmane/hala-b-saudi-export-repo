import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SelectCountry} from 'react-native-element-dropdown';
import {consts} from '../../consts';

interface MySelectCountryProps {
  onChange: (code: string) => void;
}

const MySelectCountry: React.FC<MySelectCountryProps> = ({onChange}) => {
  const localData = consts.LOCAL_DATA;
  const [country, setCountry] = useState(consts.LOCAL_DATA[0].value); // make it 0

  return (
    <SelectCountry
      style={styles.inputCountry}
      selectedTextStyle={styles.selectedTextStyle}
      placeholderStyle={styles.placeholderStyle}
      imageStyle={styles.countryImage}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      search
      maxHeight={200}
      value={country}
      data={localData}
      valueField="value"
      labelField="lable"
      imageField="image"
      placeholder="Select country"
      searchPlaceholder="Search..."
      onChange={e => {
        setCountry(e.value);
        const selectedCountry = localData.find(item => item.value === e.value);
        if (selectedCountry) {
          onChange(selectedCountry.code);
        }
      }}
    />
  );
};

export default MySelectCountry;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 50,
    marginBottom: 100,
  },
  inputCountry: {
    color: '#888',
    width: '100%',
    height: 60,
    padding: 10,
    borderColor: '#ccc',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#ECF1EE',
    marginBottom: 5,
  },
  countryImage: {
    width: 35,
    height: 23,
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  placeholderStyle: {
    color: '#888',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#888',
    fontSize: 16,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
