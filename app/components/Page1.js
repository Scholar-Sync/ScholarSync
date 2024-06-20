import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeProvider'; // Adjust the import path as needed

const Page1 = ({ children, style }) => {
  const { theme } = useTheme(); // Use theme context

  return <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,   
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page1;
