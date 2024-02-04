// RossMike.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RossMike = ({ onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text>Back</Text>
      </TouchableOpacity>
      {/* ... other RossMike content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ... your container styles
  },
  backButton: {
    marginTop: 50, // Adjust according to your layout
    marginLeft: 20, // Adjust according to your layout
    // ... style your back button
  },
  // ... any other styles you need for RossMike
});

export default RossMike;
