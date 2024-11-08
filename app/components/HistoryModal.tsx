// MyModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MyIcon from "./MyIcon";

interface MyModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  discount: string;
  serviceName: string;
  date: string;
}

const HistoryModal: React.FC<MyModalProps> = ({visible, title, onClose, discount, serviceName, date}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={onClose}>
              <MyIcon icon="close-circle-outline" color="#00502A" size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.row1}>
            <Text style={styles.youGot}>{title}</Text>
          </View>
          <View style={styles.row2}>
            <Text style={styles.discount}>-{discount}%</Text>
          </View>
          <View style={styles.row3}>
            <Text style={styles.serviceName}>{serviceName}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
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
    width: "80%",
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "column", // Align items in a column
    justifyContent: "space-between", // Distribute space between items
    height: 280,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalTitle: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    width: "auto",
    aspectRatio: 1,
    backgroundColor: "#ECF1EE",
    borderRadius: 5,
    padding: 2,
  },
  row1: {
    marginTop: 40,
  },
  row2: {},
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%", // Adjust width as needed
  },
  youGot: {
    color: "#103B2F",
    fontSize: 19,
    fontWeight: "regular",
  },
  discount: {
    color: "#00502A",
    fontSize: 46,
    fontWeight: "bold",
  },
  serviceName: {
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
  },
  date: {
    color: "#737272",
    fontSize: 14,
    fontWeight: "medium",
  },
});

export default HistoryModal;
