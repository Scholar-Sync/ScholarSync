import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../utils/theme'; 

const Page1 = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20, 
    paddingVertical: 10,   
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page1;
