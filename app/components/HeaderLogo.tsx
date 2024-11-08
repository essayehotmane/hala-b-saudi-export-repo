import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface HeaderLogoProps {
  pageTitle?: string;
  isRtl?: boolean;
}
const HeaderLogo: React.FC<HeaderLogoProps> = ({pageTitle, isRtl}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo-black.png')}
          style={styles.logo}
        />
      </View>
      {pageTitle && (
        <View style={styles.titleContainer}>
          <Text style={[styles.title, {textAlign: isRtl ? 'right' : 'left'}]}>
            {pageTitle}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff', // Background color to match the design
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1000, // Ensure it is above other elements
    width: '100%', // Full width
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 150, // Adjust width to fit your logo size
    height: 50, // Adjust height to fit your logo size
  },
  titleContainer: {
    marginTop: 50,
    width: '100%',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#103B2F',
  },
});

export default HeaderLogo;
