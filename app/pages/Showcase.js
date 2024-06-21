import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, query, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Page1 from "../components/Page1";
import { useTheme } from "../utils/ThemeProvider"; // Adjust the import path as needed
import StyledButton2 from "../components/StyledButton2";
import { theme } from '../utils/theme'; // Adjust the import path as needed

const UserCard = ({ item, handleSaveToBookmark }) => {
  const user = item;
  const userRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  const { theme } = useTheme(); // Use theme context

  const handleClick = () => {
    setIsClicked(!isClicked);
    userRef.current && userRef.current.focus();
  };

  return (
    <View style={[styles.itemContainer, { backgroundColor: theme.colors.background_b }]}>
      <View style={styles.itemContainerInner}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require("../assets/pfp1.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{user?.basic?.firstName}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>{user?.basic?.school}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Grade {user?.basic.grade}</Text>
          <TouchableOpacity>
            <Text
              style={[styles.bookmark, { color: theme.colors.text }]}
              onPress={() => handleSaveToBookmark(user.uid)}
            >
            <Icon name= "bookmark" size={25} color="#BDBDBD" />

            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isClicked && (
        <View style={styles.itemContainerDrop}>
          <Text style={[styles.details, { color: theme.colors.text }]}>GPA:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.gpa}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>PSAT:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.psat}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>SAT:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.sat}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>ACT:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.act}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Class Rank:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.classRank}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>AP Courses:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.apCourses}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Other Courses:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.others}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Clubs:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.clubs}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Sports:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.sports}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Volunteering:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.volunteering}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Awards:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.awards}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Scholarships:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.scholarships}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Certifications:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.certifications}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.viewButton}>
        <StyledButton2 title="View" onPress={() => handleClick()}>
          <Icon name={isClicked ? "remove" : "add"} size={16} color="#BDBDBD" />
        </StyledButton2>
      </TouchableOpacity>
    </View>
  );
};

const ShowcasesScreen = ({ userMetadata }) => {
  const { theme } = useTheme(); // Use theme context
  const [localQuery, setLocalQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value for fade-in effect

  useFocusEffect(
    useCallback(() => {
      // Reset the animation state to 0
      fadeAnim.setValue(0);

      // Start the fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade to full opacity
        duration: 600, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [fadeAnim]) // Add fadeAnim to the dependency array
  );

  const navigation = useNavigation();

  const handleSaveToBookmark = async (newBookmarkUID) => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata.uid; // Assuming uid is always defined in userMetadata
    const userDBRef = doc(db, "users", uid); // Reference to the user's document

    // Fetch the current user's data to ensure we have the latest bookmarks
    const currentUserSnap = await getDoc(userDBRef);
    if (!currentUserSnap.exists()) {
      console.error("Current user document does not exist!");
      return;
    }
    var newUserData = currentUserSnap.data();

    // Initialize bookmarks as an empty array if it's not defined or not an array
    if (!Array.isArray(newUserData.bookmarks)) {
      console.error(
        "Bookmarks is not an array. Initializing as an empty array."
      );
      newUserData.bookmarks = [];
    }

    if (newUserData.bookmarks.includes(newBookmarkUID)) {
      console.log("Already bookmarked", newBookmarkUID);
      return;
    }

    // Add the new bookmark and update the user's document
    newUserData.bookmarks.push(newBookmarkUID);
    try {
      await setDoc(userDBRef, newUserData);
      console.log("Bookmark added successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userMetadata) {
        return;
      }

      const uid = userMetadata?.uid;
      const docRef = doc(db, "users", uid);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
            return {};
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      const q = query(collection(db, "users"));
      getDocs(q)
        .then((docSnap) => {
          let users = [];
          docSnap.forEach((doc) => {
            if (doc.data().uid !== uid) {
              users.push(doc.data());
            }
          });

          setUsers(users);
          setFilteredData(users);
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }, [userMetadata])
  );

  const handleSearch = (text) => {
    setLocalQuery(text);
    if (text === "") {
      setFilteredData(users);
    } else {
      const filtered = users.filter((item) =>
        `${item.basic.firstName} ${item.basic.grade} ${item.basic.school}`
          .toLowerCase()
          .includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const renderUserCard = ({ item }) => {
    if (!item || typeof item !== "object") {
      console.log("Invalid item:", item);
      return null;
    }
    console.log("Rendering item:", item);
    return (
      <UserCard
        key={item.uid}
        item={item}
        handleSaveToBookmark={handleSaveToBookmark}
      />
    );
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: theme.colors.background }}>
      <Page1>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.background_b, borderColor: theme.colors.surface }]}>
            <Icon
              name="search"
              size={24}
              color={theme.colors.placeholderText}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search/Filter"
              style={[styles.searchBar, { color: theme.colors.text }]}
              value={localQuery}
              onChangeText={handleSearch}
              placeholderTextColor={theme.colors.placeholderText}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
          <FlatList
            data={filteredData}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.uid}
            extraData={filteredData}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={[styles.emptyMessage, { color: theme.colors.text }]}>Showcases will go here!</Text>
              </View>
            }
          />
        </View>
      </Page1>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 380,
    height: "100%",
  },
  value: {
    fontSize: 14,
    color: "#757575",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#757575",
  },
  itemContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: 'center',
    width: '90%',
    paddingTop: 5,
    paddingBottom: 30,
    backgroundColor: theme.colors.background_b,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    borderRadius: 10,
    marginTop: 20,
  },
  itemContainerInner: {
    flexDirection: "row",
    paddingBottom: 15,
  },
  itemContainerDrop: {
    alignItems: "right",
    textAlign: "right",
    borderTopWidth: 1,
    borderTopColor: "gray",
    paddingTop: 15,
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
    marginTop: -10,
  },
  details: {
    fontSize: 14,
    color: "#757575",
    marginRight: 50
  },
  bookmark: {
    marginLeft: 160,
    marginTop: -57,
  },
  searchContainer: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    padding: 7,
    width: 300,
    height: 40,
    alignSelf: "center",
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 25,
    marginLeft: -30
  },
  viewButton: {
    width: 100,
    height: 30,
    marginTop: 100,
    position: 'absolute',
    marginLeft: 110,
    marginBottom: 100,
  },
  viewButtonText: {
    fontSize: 16,
    color: "black",
    position: 'absolute'
  },
  divider: {
    height: 5,
    width: "89%",
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 20,
    backgroundColor: theme.colors.surface,
    marginVertical: 5,
  },
});

export default ShowcasesScreen;