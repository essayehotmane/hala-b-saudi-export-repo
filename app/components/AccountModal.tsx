// MyModal.tsx
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import MyIcon from './MyIcon';

interface AccountModalProps {
  visible: boolean;
  onChange: (text: string) => string;
  onClose: () => void;
  onConfirm: (text: string) => string;
  username: string;
  phoneNumber: string;
  buttonText: string;
}

const AccountModal: React.FC<AccountModalProps> = ({
  visible,
  onChange,
  onClose,
  onConfirm,
  username,
  phoneNumber,
  buttonText,
}) => {
  const [inputText, setInputText] = useState(username); // Local state for input

  useEffect(() => {
    setInputText(username);
  }, [username]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={onClose}>
              <MyIcon icon="close-circle-outline" color="#00502A" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.row1}>
            <View style={styles.iconAndInput}>
              <MyIcon color="#1D1B20" icon="person-outline" size={25} />
              <TextInput
                style={styles.nameInput}
                value={inputText}
                autoFocus={true}
                autoCorrect={false}
                onChangeText={text => {
                  setInputText(text); // Update local state
                  onChange(text); // Call the parent function
                }}
              />
            </View>
            <TouchableOpacity onPress={() => onConfirm(inputText)}>
              <Text style={styles.save}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row2}>
            <MyIcon color="#1D1B20" icon="phone-portrait-outline" size={25} />
            <TextInput
              style={styles.numberInput}
              value={phoneNumber}
              editable={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column', // Align items in a column
    justifyContent: 'space-evenly', // Distribute space between items
    height: 200,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalTitle: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 'auto',
    aspectRatio: 1,
    backgroundColor: '#ECF1EE',
    borderRadius: 5,
    padding: 2,
  },
  row1: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconAndInput: {
    flexDirection: 'row',
  },
  save: {
    color: '#447159',
    fontSize: 16,
    fontWeight: 'regular',
  },
  nameInput: {
    color: 'black',
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: 170,
  },
  numberInput: {
    marginLeft: 10,
    color: '#A9A9A9',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: 170,
  },
});

export default AccountModal;
