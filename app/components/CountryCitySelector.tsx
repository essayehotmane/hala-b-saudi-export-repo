import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

interface CountryCitySelectorProps {
  countries: {id: number; name: string; phone_code: string; flag?: string}[];
  cities: {id: number; name: string; country_id: number}[];
  onSelect: (cityId: number) => number;
  title: string;
  confirmText: string;
  selectCountryText: string;
  selectCityText: string;
}

const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({
  countries = [],
  cities = [],
  onSelect,
  title,
  confirmText,
  selectCountryText,
  selectCityText,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [filteredCities, setFilteredCities] = useState<
    {id: number; name: string; country_id: number}[]
  >([]);

  // useEffect to filter cities based on selectedCountry
  useEffect(() => {
    console.log('...', countries, cities);
    if (selectedCountry !== null) {
      console.log('selected cities...', cities);

      // Ensure cities is not empty
      if (cities.length > 0) {
        const citiesForCountry = cities.filter(
          city => city.country_id === selectedCountry,
        );
        console.log('selected cities ? ', citiesForCountry);
        setFilteredCities(citiesForCountry);
        setSelectedCity(null); // Reset city selection when country changes
      }
    }
  }, [selectedCountry]); // Only depend on selectedCountry

  const renderDropdownItem = (item: any) => (
    <View style={styles.itemContainer}>
      {item.flag ? (
        <Image source={{uri: item.flag}} style={styles.flagImage} />
      ) : null}
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  const handleCountrySelect = (item: any) => {
    setSelectedCountry(item.id);
    console.log('Selected Country ID:', item.id);
  };

  const handleCitySelect = (item: any) => {
    setSelectedCity(item.id);
    console.log('Selected City ID:', item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Dropdown
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        style={styles.dropdown}
        data={countries}
        labelField="name"
        valueField="id"
        placeholder={selectCountryText}
        value={selectedCountry}
        onChange={handleCountrySelect}
        renderItem={renderDropdownItem}
        renderLeftIcon={() => (
          <Image
            source={{
              uri: countries.find(country => country.id === selectedCountry)
                ?.flag,
            }}
            style={styles.selectedFlagImage}
          />
        )}
      />

      {selectedCountry && (
        <Dropdown
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          style={styles.dropdown}
          data={filteredCities}
          labelField="name"
          valueField="id"
          placeholder={selectCityText}
          search
          searchPlaceholder="Search City"
          value={selectedCity}
          onChange={handleCitySelect}
          renderItem={item => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
        />
      )}

      {selectedCountry && selectedCity && (
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              onSelect(selectedCity);
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  title: {
    color: 'black',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 35,
    textAlign: 'center',
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#ECF1EE',
    marginBottom: 15,
    fontSize: 16,
    padding: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  flagImage: {
    width: 30,
    height: 20,
    marginRight: 12,
    borderRadius: 4,
  },
  selectedFlagImage: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00502A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonView: {
    backgroundColor: 'res',
    width: '100%',
  },
  placeholder: {
    color: '#888',
  },
  selectedText: {
    color: 'black',
  },
});

export default CountryCitySelector;
