import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme'; // Adjust the import path as needed

const LogoutButton1 = ({ title, onPress }) => {
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
    width: 150, // Set a max width to avoid excessively large buttons
    height: 100, // Set a fixed height for buttons
    flexDirection: 'row', // Ensures that children will be displayed in a row

  },
  buttonText: {
    color: 'white',
    fontSize: 13,
  },
});

export default LogoutButton1;
