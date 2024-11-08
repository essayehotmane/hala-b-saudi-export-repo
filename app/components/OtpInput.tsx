import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

interface OtpInputProps {
  number: string;
  onChange: (text: string, index: number) => void;
  onKeyPress: (event: any, index: number) => void;
  index: number;
  inputRef: React.RefObject<TextInput>;
}

const OtpInput: React.FC<OtpInputProps> = ({
  number,
  onChange,
  onKeyPress,
  index,
  inputRef,
}) => {
  return (
    <TextInput
      ref={inputRef}
      value={number}
      onChangeText={text => onChange(text, index)}
      onKeyPress={event => onKeyPress(event, index)}
      style={styles.inputNumber}
      keyboardType="numeric"
      // maxLength={1}
    />
  );
};

const styles = StyleSheet.create({
  inputNumber: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    width: 30,
    height: 60,
    borderBottomWidth: 3,
    borderBottomColor: '#666',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
  },
});

export default OtpInput;
