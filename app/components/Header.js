import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../utils/ThemeProvider';

const Header = ({ title }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{" "}</Text>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <MaterialIcons name="menu" size={28} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    marginTop: 40, // Space from the top
  },
  headerTitle: {
    fontSize: 20,
  },
});

export default Header;