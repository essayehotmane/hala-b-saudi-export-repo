import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MyIcon from './MyIcon';

interface DiscountModalProps {
  visible: boolean;
  onClose: () => void;
  getNewCode: () => void;
  code: string;
  discount: string;
  title: string;
  paragraph: string;
  buttonText: string;
}

const DiscountModal: React.FC<DiscountModalProps> = ({
  visible,
  onClose,
  getNewCode,
  code,
  discount,
  title,
  paragraph,
  buttonText,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Aligning the icon to the right */}
          <TouchableOpacity onPress={onClose} style={styles.iconContainer}>
            <MyIcon color="#00502A" icon="close-circle-outline" size={25} />
          </TouchableOpacity>

          <Image
            source={require('../../assets/gift.png')}
            style={{width: 180, height: 180}}
          />

          <Text style={styles.modalTitle}>{title} :</Text>
          <Text style={styles.code}>{code}</Text>
          <Text style={styles.discount}>-{discount}%</Text>
          <Text style={styles.additionalText}>{paragraph}</Text>

          <TouchableOpacity style={styles.nextButton} onPress={getNewCode}>
            <Text style={styles.closeButtonText}>{buttonText}</Text>
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
    marginTop: 40,
    fontSize: 19,
    marginBottom: 15,
    textAlign: 'center',
    color: '#103B2F',
  },
  nextButton: {
    backgroundColor: '#00502A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  iconContainer: {
    alignSelf: 'flex-end', // Align the icon to the right
    marginBottom: 10,
  },
  code: {
    color: '#00502A',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },
  discount: {
    color: '#00502A',
    fontWeight: 'bold',
    fontSize: 46,
    marginBottom: 30,
  },
  additionalText: {
    color: '#5B5B5B',
    fontSize: 12,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default DiscountModal;
