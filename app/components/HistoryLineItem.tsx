import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MyIcon from "./MyIcon";

interface HistoryLineItemProps {
  serviceName: string;
  date: string;
  buttonText: string;
  onClick(): void;
}
const HistoryLineItem: React.FC<HistoryLineItemProps> = ({serviceName, date, buttonText, onClick}) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.listElement}>
        <View style={styles.listElementLeftSide}>
          <Text style={styles.textServiceName}>{serviceName}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.listElementRightSide}>
          <Text style={styles.textSeeDetails}>{buttonText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listElement: {
    marginTop: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listElementLeftSide: {
    flex: 5,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  listElementRightSide: {
    flex: 2,
  },
  textServiceName: {
    fontSize: 14,
    marginLeft: 10,
    color: "#2C2C2C",
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    marginLeft: 10,
    color: "#737272",
    fontWeight: "medium",
  },
  textSeeDetails: {
    fontSize: 14,
    marginLeft: 10,
    color: "#447159",
    fontWeight: "600",
  },
});
export default HistoryLineItem;
