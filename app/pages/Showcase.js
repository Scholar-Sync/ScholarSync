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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  showcaseItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 70, // Adjusted from 70 to 20 for a more typical padding
    marginBottom: 5,
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
      