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
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Page1 from "../components/Page1";
import { useTheme } from "../utils/ThemeProvider"; // Adjust the import path as needed
import StyledButton2 from "../components/StyledButton2";
import { theme } from '../utils/theme'; // Adjust the import path as needed

const UserCard = ({ item, handleRemoveBookmark }) => {
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
            <Icon onPress={() => handleRemoveBookmark(user.uid)}
              name="delete"
              size={24}
              color="#BDBDBD"
              style={styles.trashIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isClicked && (
        <View style={styles.itemContainerDrop}>
          <Text style={[styles.details, { color: theme.colors.text }]}>Email: {user.basic.email}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Phone: {user.basic.phoneNumber}</Text>
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
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.apCourses.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Other Courses:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.academics.others.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Clubs:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.clubs.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Sports:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.sports.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Volunteering:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.extracurriculars.volunteering.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Awards:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.awards.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Scholarships:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.scholarships.join(', ')}</Text>
          <Text style={[styles.details, { color: theme.colors.text }]}>Certifications:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{user.honors.certifications.join(', ')}</Text>
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

const BookmarksScreen = ({ userMetadata }) => {
  const { theme } = useTheme(); // Use theme context
  const [localQuery, setLocalQuery] = useState("");
  const [bookmarkedUsers, setBookmarkedUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(false);
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

  const handleRemoveBookmark = async (newBookmarkUID) => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata?.uid;
    const userDBRef = collection(db, "users");
    let newUserData = userData;
    let oldBookmarks = newUserData["bookmarks"];
    let newBookmarks = oldBookmarks.filter(
      (bookmark) => bookmark !== newBookmarkUID
    );
    newUserData["bookmarks"] = newBookmarks;
    try {
      await setDoc(doc(userDBRef, uid), newUserData);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  // Get data from the database as soon as the profile page is loaded.
  useFocusEffect(
    useCallback(() => {
      if (!userMetadata) {
        return;
      }

      const uid = userMetadata.uid; // Assuming uid is always defined in userMetadata
      const docRef = doc(db, "users", uid);

      // Fetch the user's data and update state
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Ensure bookmarks is an array
            if (!Array.isArray(userData.bookmarks)) {
              console.log(
                "Bookmarks is not an array. Initializing as an empty array."
              );
              userData.bookmarks = [];
            }

            setUserData(userData);

            // Ensure userBookmarks is always an array
            let userBookmarks = Array.isArray(userData.bookmarks)
              ? userData.bookmarks
              : [];

            // Fetch each user's data using their bookmarked user IDs
            let promises = userBookmarks.map((userId) => {
              console.log("Fetching user data for userId:", userId);
              const userRef = doc(db, "users", userId);
              return getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                  let bookmarkUserData = doc.data();
                  console.log("userData.bookmarks:", bookmarkUserData); // Check if bookmarks is defined
                  return bookmarkUserData;
                } else {
                  console.log(`No data for userId ${userId}`);
                  return null;
                }
              });
            });

            // Wait for all user data promises to resolve
            Promise.all(promises)
              .then((usersData) => {
                let filteredUsersData = usersData.filter(Boolean);
                setBookmarkedUsers(filteredUsersData);
                setFilteredData(filteredUsersData);
              })
              .catch((error) => {
                console.error("Error fetching bookmarked users:", error);
              });
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }, [userMetadata, refresh])
  );

  const handleSearch = (text) => {
    setLocalQuery(text);
    if (text === "") {
      setFilteredData(bookmarkedUsers);
    } else {
      const filtered = bookmarkedUsers.filter((item) => {
        console.log("item-------", item);
        const searchContent = [
          item?.basic?.firstName,
          item?.basic?.grade,
          item?.basic?.school,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        console.log(`searchContent for ${item.id}:`, searchContent);
        return searchContent.includes(text.toLowerCase());
      });
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
        handleRemoveBookmark={handleRemoveBookmark}
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
          <Text style={[styles.refresh, { color: theme.colors.text }]} onPress={() => setRefresh(!refresh)}>
            <Icon name="refresh" size={24} color={theme.colors.text} />
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.surface }]} />
          <FlatList
            data={filteredData}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.uid} // Ensuring unique key
            extraData={filteredData}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={[styles.emptyMessage, { color: theme.colors.text }]}>Bookmarks will go here!</Text>
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
  trashIcon: {
    marginLeft: 180,
    marginTop: -57,
  },
  refresh: {
    fontSize: 12,
    color: "black",
    marginLeft: 345,
    marginBottom: 20,
    marginTop: -32,
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
    marginleft: 10,
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
});

export default BookmarksScreen;
