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
import {
  collection,
  query,
  doc,
  getDocs,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Updated UserCard to accept handleSaveToBookmark as a prop
const UserCard = ({ item, handleSaveToBookmark }) => {
  const user = item.item;
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleClick()}
    >
      <View style={styles.itemContainerInner} onPress={() => handleClick()}>
        <Icon name="school" size={30} color="#F7B500" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user?.basic?.firstName}</Text>
          <Text style={styles.details}>{user?.basic?.school} </Text>

          <Text style={styles.details}>Grade {user?.basic.grade}</Text>

          <Text
            style={styles.bookmark}
            onPress={() => handleSaveToBookmark(user.uid)}
          >
            Bookmark
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
          <Text style={styles.value}>{user.honors.certifications}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const ShowcasesScreen = ({ userMetadata }) => {
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

      const q = query(collection(db, "users"), where("private", "==", false));
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

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <TextInput
            placeholder="Search/Filter"
            style={styles.searchBar}
            value={localQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.divider} />

          <FlatList
            data={filteredData}
            renderItem={(item) => (
              <UserCard
                key={item.item.uid}
                item={item}
                handleSaveToBookmark={handleSaveToBookmark}
              />
            )}
            keyExtractor={(item) => item.uid.toString()}
            extraData={filteredData}
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    marginBottom: 20,
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
  },
  details: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "bold", // Make labels bold
  },
  value: {
    // New style for values if needed
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

export default ShowcasesScreen;
