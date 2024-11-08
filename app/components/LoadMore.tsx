import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface HeaderLogoProps {
  onClick(): void;
}
const LoadMore: React.FC<HeaderLogoProps> = ({ onClick }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.loadMoreContainer}>
        <Text style={styles.loadMore}>Load more</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadMoreContainer: {
    flex: 1,
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    paddingVertical: 20,
  },
  loadMore: {
    color: "#737272",
    fontSize: 14,
  },
});

export default LoadMore;
