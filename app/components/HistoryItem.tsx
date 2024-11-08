import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MyIcon from "./MyIcon";

interface HistoryItemProps {
  icon: string;
  title: string;
  isRtl: boolean;
  onClick(): void;
}
const HistoryItem: React.FC<HistoryItemProps> = ({ icon, title, isRtl, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={[styles.listElement, {flexDirection: isRtl ? "row-reverse" : "row"}]}>
        <View style={[styles.listElementLeftSide, {flexDirection: isRtl ? "row-reverse" : "row"}]}>
          <View style={styles.iconView}>
            <MyIcon icon={icon} color="#1D1B20" size={35} />
          </View>
          <Text style={[
            styles.textElement,
            { marginLeft: isRtl ? 0 : 12, marginRight: isRtl ? 12 : 0 }
          ]}>{title}</Text>
        </View>
        <View style={styles.listElementRightSide}>
          <MyIcon
              icon={`chevron-${isRtl ? 'back' : 'forward'}-outline`}
              color="#B6B6B6"
              size={25}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listElement: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  listElementLeftSide: {
    flex: 5,
    alignItems: "center",
  },
  listElementRightSide: {
    flex: 1,
  },
  textElement: {
    fontSize: 18,
    color: "#2C2C2C",
    fontWeight: "600",
  },
  iconView: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
  }
});
export default HistoryItem;
