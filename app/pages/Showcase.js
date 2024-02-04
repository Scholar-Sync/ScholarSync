<<<<<<< HEAD
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

const SettingsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Replace with your image path
      style={styles.backgroundImage}
      resizeMode="cover" // or 'stretch' or 'contain', depending on how you want it displayed
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Rest of your component code */}
        {/* Make sure to close the ImageBackground tag after all your components */}
      </ScrollView>
=======
import React from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

const ShowcaseScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/background.png")} // Replace with the path to your image
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      {/* Search bar at the top */}
      <TextInput
        placeholder="Search/Filter"
        style={styles.searchBar}
      />
      <View style={styles.divider} />

      {/* Scrollable container for showcase items */}
      <ScrollView style={styles.scrollView}>
        {/* Each showcase item is a separate white card button */}
        {Array.from({ length: 7 }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.showcaseItem}
            onPress={() => { /* this is intentionally left blank */ }}
          >
            {/* Placeholder for item content */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
>>>>>>> a0353ce6ea1ca15e8c9d0b5fb303e4cbcc4bbf27
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  backgroundImage: {
    flex: 1, // This ensures that the background image will cover the entire screen
  },
  container: {
    flexGrow: 1, // This ensures that the ScrollView will expand to fit the content
    // ... other styles for your container
  },
  // ... rest of your styles
});

export default SettingsScreen;
=======
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'stretch'
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  showcaseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 70, // Adjusted from 70 to 20 for a more typical padding
    marginBottom: 20,
    // Shadow styles
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  divider: {
    height: 5, // or 2 for a thicker line
    width: '89%',
    marginLeft: 20, 
    marginBottom: 20,
    marginRight: 20,
    backgroundColor: '#FFD700', // You can choose any color
    marginVertical: 5, // Spacing above and below the line
  },
  // ... other styles you might need ...
});

export default ShowcaseScreen;
      
>>>>>>> a0353ce6ea1ca15e8c9d0b5fb303e4cbcc4bbf27
