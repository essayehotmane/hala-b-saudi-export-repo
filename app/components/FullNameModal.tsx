import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

interface FullNameModalProps {
  visible: boolean;
  title: string;
  username: string;
  onConfirm: () => void;
  onChange: (text: string) => void;
}

const FullNameModal: React.FC<FullNameModalProps> = ({
  visible,
  onChange,
  onConfirm,
  title,
  username,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={username}
            onChangeText={onChange}
            placeholderTextColor="#999" // Ensure placeholder color is visible
          />

          <TouchableOpacity style={styles.nextButton} onPress={onConfirm}>
            <Text style={styles.closeButtonText}>Confirm</Text>
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
    marginBottom: 35,
  },
  nextButton: {
    backgroundColor: '#00502A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    color: 'black',
    width: '100%',
    height: 50, // Adjust as needed
    paddingHorizontal: 10, // Ensure padding is enough
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#ECF1EE',
    marginBottom: 15,
    fontSize: 16, // Make sure the font size is readable
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FullNameModal;
