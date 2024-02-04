import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import RossMike from './RossMike'; // Import RossMike component

const BookmarksPage = () => {
  const [currentScreen, setCurrentScreen] = useState('bookmarks');

  const handlePress = () => {
    // This will change the state to 'rossMike' which will render the RossMike component
    setCurrentScreen('rossMike');
  };

  if (currentScreen === 'rossMike') {
    return <RossMike />; // Render RossMike component when currentScreen is 'rossMike'
  }

  // Otherwise, render the Bookmarks page
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Bookmarks.png')}
        style={styles.bookmarksImage}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/orangebookmark.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF', // Set your desired background color
  },
  bookmarksImage: {
    width: '100%', // Set the width as per your requirement
    height: 50, // Set the height as per your requirement
    resizeMode: 'contain',
  },
  button: {
    marginTop: 20, // Adjust the margin as per your layout
    width: '90%', // Set the width as per your requirement
    height: 100, // Set the height as per your requirement
    backgroundColor: '#FFF', // Set your desired button color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Adjust border radius to match your design
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow spread radius for iOS
    elevation: 5, // Elevation for Android
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default BookmarksPage;
