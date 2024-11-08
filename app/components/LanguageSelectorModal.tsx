import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Text,
} from "react-native";
import MyIcon from "./MyIcon";

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedLanguage: string) => void;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const languagesList = [
    {
      code: 'en',
      name: "English",
      flag: "https://flagsapi.com/GB/flat/64.png",
    },
    {
      code: 'ar',
      name: "العربية",
      flag: "https://flagsapi.com/SA/flat/64.png",
    },
  ];

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    onConfirm(code);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = item.name === selectedLanguage;

    return (
      <TouchableOpacity onPress={() => handleLanguageSelect(item.code)}>
        <View style={styles.flagContainer}>
          <Image
            source={{ uri: item.flag }}
            style={[
              styles.flagImage,
              isSelected && styles.selectedFlagImage, // Apply green border if selected
            ]}
          />
          <Text style={styles.languageName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MyIcon icon="close-circle-outline" color="#00502A" size={30} />
          </TouchableOpacity>

          <FlatList
            data={languagesList}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            contentContainerStyle={styles.languagesList}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#ECF1EE",
    borderRadius: 5,
    padding: 2,
  },
  languagesList: {
    justifyContent: "space-around",
    flexDirection: "row",
  },
  flagContainer: {
    padding: 15,
    alignItems: "center",
  },
  flagImage: {
    width: 64,
    height: 64,
    borderRadius: 64, // Make the image rounded
    resizeMode: "contain",
    borderWidth: 3,
    borderColor: "transparent", // Default border color
  },
  selectedFlagImage: {
    borderColor: "#00b14f", // Green border when selected
    shadowColor: "#00b14f",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  languageName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default LanguageSelectorModal;
