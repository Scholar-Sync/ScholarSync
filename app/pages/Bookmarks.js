import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Sample data for the list of bookmarks
const bookmarksData = [
  {
    id: "1",
    name: "Ross Mike",
    grade: "9th grade",
    school: "Antilles High School",
  },
  {
    id: "2",
    name: "Dana Rosanski",
    grade: "9th grade",
    school: "Washington High School",
  },
  {
    id: "3",
    name: "Elena Lasella",
    grade: "12th grade",
    school: "Harvard Westlake High School",
  },
  {
    id: "4",
    name: "Garret Smith",
    grade: "11th grade",
    school: "Kingston High School",
  },
  {
    id: "5",
    name: "Luke Oakwood",
    grade: "9th grade",
    school: "American International School",
  },
];

const BookmarksScreen = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(bookmarksData);

  const handleSearch = (text) => {
    setQuery(text);
    if (text === "") {
      setFilteredData(bookmarksData);
    } else {
      const filtered = bookmarksData.filter((item) =>
        `${item.name} ${item.grade} ${item.school}`.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Icon name="school" size={30} color="#F7B500" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.grade} - {item.school}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search bar at the top */}
      <TextInput
        placeholder="Search/Filter"
        style={styles.searchBar}
        value={query}
        onChangeText={handleSearch}
      />
      <View style={styles.divider} />

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={filteredData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 5,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  details: {
    fontSize: 14,
    color: "#757575",
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
  divider: {
    height: 5, // or 2 for a thicker line
    width: "89%",
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    backgroundColor: "#FFD700", // You can choose any color
    marginVertical: 5, // Spacing above and below the line
  },
  // Add additional styles if needed
});

export default BookmarksScreen;
