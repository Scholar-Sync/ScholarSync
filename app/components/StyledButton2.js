// StyledButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme'; // Adjust the import path as needed

const StyledButton2 = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.selected, // Use the selected color from the theme
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    width: 75, // Set a max width to avoid excessively large buttons
    height: 25, // Set a fixed height for buttons
    flexDirection: 'row', // Ensures that children will be displayed in a row

  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
});

export default StyledButton2;
