import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Animated,
} from "react-native";
import React, { useState, useCallback, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const UserCard = ({ item, handleRemoveBookmark }) => {
  const user = item;
  const userRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    userRef.current && userRef.current.focus();
  };
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleClick()}
    >
      <View
        style={styles.itemContainerInner}
        onPress={() => handleClick()}
      >
        <Icon name="bookmark" size={30} color="#F7B500" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user?.basic?.firstName}</Text>
          <Text style={styles.details}>{user?.basic?.school} </Text>

          <Text style={styles.details}>Grade {user?.basic.grade}</Text>

          <Text
            style={styles.bookmark}
            onPress={() => handleRemoveBookmark(user.uid)}
          >
            Remove Bookmark
          </Text>
        </View>
        {isClicked ? (
        <Icon name="keyboard-arrow-down" size={24} color="#BDBDBD" />
      ) : (
        <Icon name="keyboard-arrow-right" size={24} color="#BDBDBD" />
      )}
      </View>
      {isClicked ? (
        <View style={styles.itemContainerDrop}>
        <Text style={styles.details}>GPA:</Text>
        <Text style={styles.value}>{user.academics.gpa}</Text>
        <Text style={styles.details}>PSAT:</Text>
        <Text style={styles.value}>{user.academics.psat}</Text>
        <Text style={styles.details}>SAT:</Text>
        <Text style={styles.value}>{user.academics.sat}</Text>
        <Text style={styles.details}>ACT:</Text>
        <Text style={styles.value}>{user.academics.act}</Text>
        <Text style={styles.details}>Class Rank:</Text>
        <Text style={styles.value}>{user.academics.classRank}</Text>
        <Text style={styles.details}>AP Courses:</Text>
        <Text style={styles.value}>{user.academics.apCourses}</Text>
        <Text style={styles.details}>Other Courses:</Text>
        <Text style={styles.value}>{user.academics.others}</Text>
        <Text style={styles.details}>Clubs:</Text>
        <Text style={styles.value}>{user.extracurriculars.clubs}</Text>
        <Text style={styles.details}>Sports:</Text>
        <Text style={styles.value}>{user.extracurriculars.sports}</Text>
        <Text style={styles.details}>Volunteering:</Text>
        <Text style={styles.value}>{user.extracurriculars.volunteering}</Text>
        <Text style={styles.details}>Awards:</Text>
        <Text style={styles.value}>{user.honors.awards}</Text>
        <Text style={styles.details}>Scholarships:</Text>
        <Text style={styles.value}>{user.honors.scholarships}</Text>
        <Text style={styles.details}>Certifications:</Text>
        <Text style={styles.value}>{user.honors.certifications
        }</Text>
        </View>
      ) : null}
      

    </TouchableOpacity>
  );
};

const BookmarksScreen = ({ userMetadata }) => {
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
        console.log("item-------", item)
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
    return <UserCard key={item.uid} item={item} handleRemoveBookmark={handleRemoveBookmark} />;
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <TextInput
            placeholder="Search/Filter"
            style={styles.searchBar}
            value={localQuery}
            onChangeText={handleSearch}
          />
          <Text style={styles.refresh} onPress={() => setRefresh(!refresh)}>
            Refresh
          </Text>
          <View style={styles.divider} />
          <FlatList
            data={filteredData}
            renderItem={renderUserCard}
            keyExtractor={(item) => item.id}
            extraData={filteredData}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyMessage}>Bookmarks will go here!</Text>
              </View>
            }
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // This will ensure the image background takes up the whole screen
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  details: {
    fontSize: 14,
    color: "#757575",
    fontWeight: 'bold', // Make labels bold
  },
  value: { // New style for values if needed
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
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 5,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  itemContainerInner: {
    flexDirection: "row",
    paddingBottom: 15,
  },
  itemContainerDrop:{
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
  },
  details: {
    fontSize: 14,
    color: "#757575",
  },
  bookmark: {
    marginTop: 5,
    fontSize: 12,
    color: "#757575",
    textDecorationLine: "underline",
    textAlign: "right",
  },
  refresh: {
    marginTop: 5,
    fontSize: 12,
    color: "#757575",
    textDecorationLine: "underline",
    textAlign: "center",
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
  // ... other styles you might need ...
});

export default BookmarksScreen;

// 1. go to database for jose (uid = mz...) and get his data
// 2. get jose's bookmarks (eg. [uid1, uid2, uid3])
// 3. for each uid in jose's bookmarks, go to database and get the user data
// 4. display the user data in the bookmarks page