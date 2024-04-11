import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

export default function Card({ title, imageUrl }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
    card: {
      flexDirection: "row", // Set the direction to row
      justifyContent: "flex-start",
      borderWidth: 1,
      borderRadius: 8, // Adjust the border radius for rounded corners
      borderColor: "#ddd",
      borderBottomWidth: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 10, // Adjust the margin
      marginRight: 10, // Adjust the margin
      marginTop: 10,
      padding: 10, // Add padding to the card
    },
    image: {
      width: 120, // Adjust the width of the image
      height: 150,
      marginRight: 10, // Add margin to the right of the image
      borderRadius: 4, // Add border radius to the image
    },
    text: {
      flex: 1, // Allow the text to take the remaining space
      fontSize: 16, // Increase the font size for better visibility
    },
  });
