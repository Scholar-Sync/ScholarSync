import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon component

// Sample data for the list of bookmarks
const bookmarksData = [
  { id: '1', name: 'Ross Mike', grade: '9th grade', school: 'Antilles High School' },
  { id: '2', name: 'Dana Rosanski', grade: '9th grade', school: 'Washington High School' },
  // Add other bookmarks here
  { id: '3', name: 'Elena Lasella', grade: '12th grade', school: 'Harvard Westlake High School' },
  { id: '4', name: 'Garret Smith', grade: '11th grade', school: 'Kingston High School' },
  { id: '5', name: 'Luke Oakwood', grade: '9th grade', school: 'American International School' },
];

const BookmarksScreen = () => {
  // Render


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Icon name="bookmark" size={24} color="#FFD700" style={styles.bookmarkIcon} />
      <View style={styles.textContainer}></View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.grade}</Text>
      <Text style={styles.details}>{item.school}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarksData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        // If you have a header or a footer, make sure they are not pushing the list off the screen
        // ListHeaderComponent={<YourHeaderComponent />}
        // ListFooterComponent={<YourFooterComponent />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // This ensures that the container takes up all available space
    backgroundColor: '#fff', // Replace with the actual background color of the app
  },
  itemContainer: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically in the container
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bookmarkIcon: {
    marginRight: 10, // Add some spacing between the icon and the text
  },
  textContainer: {
    flex: 1, // Take up remaining space
  },
  // Other styles...
});
  
  export default BookmarksScreen;