// MyModal.tsx
import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface MyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  number: string;
  title: string;
  editText: string;
  nextText: string;
  code: string;
}

const formatPhoneNumber = (phoneNumber: string): string => {
  // Convert number to string if it isn't already
  let numberString = phoneNumber?.toString();

  // Use regex to insert spaces
  let formattedNumber = numberString?.replace(
    /(\d{3})(\d{3})(\d{3})/,
    '$1 $2 $3',
  );

  return formattedNumber;
};

const MyModal: React.FC<MyModalProps> = ({
  visible,
  onClose,
  onConfirm,
  number,
  title,
  editText,
  nextText,
  code,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {code + ' ' + formatPhoneNumber(number)}
          </Text>
          <Text style={styles.modalContent}>{title}</Text>
          <TouchableOpacity style={styles.editButton} onPress={onClose}>
            <Text style={styles.editButtonText}>{editText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onConfirm}>
            <Text style={styles.closeButtonText}>{nextText}</Text>
          </TouchableOpacity>
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'black',
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalContent: {
    color: 'black',
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: '#00502A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#00502A',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyModal;
