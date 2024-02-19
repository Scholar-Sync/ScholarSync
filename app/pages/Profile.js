import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  Button,
  View,
  Text,
  TextInput,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Animated,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditableText = ({
  label,
  initialText,
  category,
  updateUserData,
  multiline = true,
  small = false,
}) => {
  if (!initialText) {
    return;
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text>loading</Text>
    </View>;
  }
  const icons = {
    Username: "account-circle",
    Email: "email",
    School: "school",
    Grade: "grade", // Example, adjust as needed
  };

  const [text, setText] = useState(initialText.toString()); // Convert initialText to string
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setIsEditable(false);
  };

  const handleEdit = () => {
    if (isEditable) {
      // update the database with the new value
      updateUserData(label, category, text);
    }

    setIsEditable(!isEditable);
    inputRef.current && inputRef.current.focus();
  };

  if (small) {
    return (
      <View style={small ? styles.inputContainerSmall : styles.inputContainer}>
        <View style={styles.labelContainer}>
          {icons[label] && (
            <Icon
              name={icons[label]}
              size={20}
              color="#666"
              style={styles.iconStyle}
            />
          )}
          <Text style={small ? styles.labelSmall : styles.label}>{label}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.inputSmall, multiline && styles.multilineInput]}
          value={text}
          onChangeText={setText}
          multiline={multiline}
          editable={isEditable}
          textAlignVertical={multiline ? "top" : "center"}
          onBlur={handleBlur}
        />
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonTextSmall} onPress={() => handleEdit()}>
            {isEditable ? "Save" : "Edit"}{" "}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, multiline && styles.multilineInput]}
        value={text}
        onChangeText={setText}
        multiline={multiline}
        editable={isEditable}
        textAlignVertical={multiline ? "top" : "center"}
        onBlur={handleBlur}
      />

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText} onPress={() => handleEdit()}>
          {isEditable ? "Save" : "Edit"}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Route = ({ data, category, updateUserData }) => {
  return (
    <ScrollView
      style={{ flex: 1 }} // Ensure ScrollView takes the full height
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollViewContent}
    >
      {Object.keys(data)
        .sort()
        .map((key, index) => (
          <EditableText
            key={index}
            label={key}
            category={category}
            initialText={data[key]}
            updateUserData={updateUserData}
            multiline={true}
          />
        ))}
    </ScrollView>
  );
};
export default function ProfileScreen({ userMetadata }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [showTabs, setShowTabs] = useState(false);
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

  // Get data from the database as soon as the profile page is loaded.
  React.useEffect(() => {
    if (!userMetadata) {
      return;
    }
    console.log(userMetadata);
    const uid = userMetadata?.uid;
    console.log(uid, "uid");
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log("------Document data:", docSnap.data());
          setUserData(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          return {};
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [userMetadata]);

  // This gets the user id, field and value to update the database with the data saved in the "value" variable.
  const updateUserData = async (field, category, value) => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata?.uid;
    const userDBRef = collection(db, "users");
    var newUserData = userData;
    newUserData[category][field] = value;
    try {
      await setDoc(doc(userDBRef, uid), newUserData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const [routes] = useState([
    { key: "first", title: "Academics" },
    { key: "second", title: "Extracurriculars" },
    { key: "third", title: "Honors" },
  ]);

  const [profileName, setProfileName] = useState("Your Name");
  const [profileDetails, setProfileDetails] = useState(
    "Some details about you..."
  );

  const renderScene = SceneMap({
    first: () => (
      <Route
        data={userData?.academics}
        category={"academics"}
        updateUserData={updateUserData}
      />
    ),
    second: () => (
      <Route
        data={userData?.extracurriculars}
        category={"extracurriculars"}
        updateUserData={updateUserData}
      />
    ),
    third: () => (
      <Route
        data={userData?.honors}
        category={"honors"}
        updateUserData={updateUserData}
      />
    ),
  });

  const DetailToggleButton = ({ onPress }) => (
    <TouchableOpacity style={styles.detailButton} onPress={onPress}>
      <Text style={styles.detailButtonText}>Edit Other Details</Text>
    </TouchableOpacity>
  );
  const shareLinkContent = {
    contentType: "link",
    contentUrl: "https://www.example.com",
  };

  const shareToSocial = (socialType) => {
    if (socialType == "reddit") {
      const payload =
        "Check out my stats on ScholarSync! " +
        "\nSchool: " +
        userData["basic"]["school"] +
        "\nSchool: " +
        userData["basic"]["grade"] +
        "\nSAT: " +
        userData["academics"]["sat"] +
        "\nACT: " +
        userData["academics"]["act"];
      const url =
        "https://www.reddit.com/submit?title=My ScholarSync Profile&url" +
        payload;
      Linking.openURL(url)
        .then((data) => {
          alert("Reddit Opened");
        })
        .catch(() => {});
    } else if (socialType == "twitter") {
      let twitterParameters = [];
      const payload =
        "Check out my stats on ScholarSync! " +
        "\nSchool: " +
        userData["basic"]["school"] +
        "\nSchool: " +
        userData["basic"]["grade"] +
        "\nSAT: " +
        userData["academics"]["sat"] +
        "\nACT: " +
        userData["academics"]["act"];
      twitterParameters.push("text=" + encodeURI(payload));

      const url =
        "https://twitter.com/intent/tweet?" + twitterParameters.join("&");
      Linking.openURL(url)
        .then((data) => {
          alert("Twitter Opened");
        })
        .catch(() => {});
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require("../assets/background.png")} // Replace with your image path
        style={styles.backgroundImage}
        resizeMode="cover" // or 'stretch' or 'contain' depending on how you want it to be displayed
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <ScrollView style={{ flex: 1 }}>
            <View style={{ alignItems: "center", padding: 20 }}>
              <Image
                source={require("../assets/pfp1.png")}
                style={styles.profileImage}
              />
                <Text style={styles.profileLabel}>Your Profile</Text> 

            </View>
            
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                margin: 15,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <EditableText
                label={"Username"}
                category="Basics"
                initialText={userData?.basic?.username}
                updateUserData={updateUserData}
                multiline={false}
                small={true}
              />
              <EditableText
                label={"Email"}
                initialText={userData?.basic?.email}
                updateUserData={updateUserData}
                multiline={false}
                small={true}
              />
              <EditableText
                label={"School"}
                category="basics"
                initialText={userData?.basic?.school}
                updateUserData={updateUserData}
                multiline={false}
                small={true}
              />
              <EditableText
                label={"Grade"}
                category="basics"
                initialText={userData?.basic?.grade}
                updateUserData={updateUserData}
                multiline={false}
                small={true}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.socialButton}
                onPress={() => shareToSocial("twitter")}
              >
                <Image
                  source={require("../assets/twitterlogo.png")} // The path to your twitter icon
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextStyle}>Share to Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.socialButton2}
                onPress={() => shareToSocial("reddit")}
              >
                <Image
                  source={require("../assets/redditlogo.png")} // The path to your reddit icon
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonTextStyle}>Share to Reddit</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs Section */}
            {userData && (
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{ height: layout.height / 2 }} // Adjust the height as needed
                renderTabBar={(props) => (
                  <TabBar
                    {...props}
                    indicatorStyle={styles.indicator}
                    style={styles.tabBar}
                    labelStyle={styles.labelStyle}
                    contentContainerStyle={styles.tabBarContentContainer}
                  />
                )}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold", // Make text bold
    fontSize: 16, // Adjust size as needed
    marginBottom: 5,
    // any other styling you need
  },
  // Style for smaller label
  labelSmall: {
    fontWeight: "bold", // Make text bold
    fontSize: 14, // Adjust size as needed for smaller text
    marginBottom: 5,
    // any other styling you need
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginHorizontal: 30,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginLeft: -5
  },
  iconStyle: {
    marginRight: 5, // Add spacing between icon and label text
    // Any other icon styling
    height: 20,
    width: 20,
    color: "#CFD0D3",
    marginTop: -3
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#4A90E2", // Example color for Twitter, adjust as needed
    borderRadius: 10,
    height: 60,
    width: 285,
    padding: 0,
    marginVertical: 5, // Add vertical margin for spacing between buttons
    marginHorizontal: 20, // Add horizontal margin for spacing from the container edges
    alignItems: "center", // Center align the text within the button
    opacity: 0.9, // Starting opacity to give a slight transparency effect
    shadowColor: "#000", // Optional: shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow effect
  },
  socialButton2: {
    flexDirection: "row",
    backgroundColor: "#FF591C", // Example color for Twitter, adjust as needed
    borderRadius: 10,
    height: 60,
    width: 285,
    padding: 0,
    marginVertical: 5, // Add vertical margin for spacing between buttons
    marginHorizontal: 20, // Add horizontal margin for spacing from the container edges
    alignItems: "center", // Center align the text within the button
    opacity: 0.9, // Starting opacity to give a slight transparency effect
    shadowColor: "#000", // Optional: shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow effect
  },

  buttonTextStyle: {
    color: "white", // Text color that contrasts with the button background
    fontWeight: "bold",
    marginRight: 40,
  },
  buttonIcon: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginRight: -30,
    marginHorizontal: 15,
  },
  multilineInput: {
    height: 100,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 30,
  },
  tabBar: {
    backgroundColor: "black",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5, // Set borderRadius for rounded corners
    overflow: "hidden", // This ensures that the children do not overlap the corners
  },
  inputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    marginHorizontal: 15, // Add horizontal margin to the input container
  },
  inputContainerSmall: {
    padding: 3,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#aaa",
    marginHorizontal: 15, // Add horizontal margin to the input container
  },
  tabView: {
    flex: 1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 50,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  scrollViewContent: {
    padding: 15, // This will add padding around the entire scroll view content
    // ... other properties
  },
  indicator: {
    backgroundColor: "black",
  },
  labelStyle: {
    fontWeight: "bold",
  },
  tabBarContentContainer: {
    justifyContent: "center",
    flexGrow: 1,
    marginHorizontal: 15,
  },
  editButtonTextSmall: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  editButton: {
    backgroundColor: "#36454F",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 70,
    marginRight: 0,
    marginRight: 270,
  },

  editButtonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    borderColor: 'black',
    marginBottom: -50
  },
  profileLabel: { // Add this new style
    marginTop: 10, // Adjust the space between the profile image and text
    fontSize: 20, // Set the font size
    fontWeight: 'bold', // Make the text bold
    color: '#333', // Set the text color
    // Add any other styling as needed
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  profileTextInput: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Increased border radius
    marginBottom: 5,
    textAlign: "left",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  profileDetails: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 8,
  },
  detailButton: {
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#F7B500",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  profileDetailsInput: {
    fontSize: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Increased border radius
    height: 100, // Increased height for more text
    width: "100%", // Full width
  },
  input: {
    // ... [Keep existing styles, add borderRadius if needed]
    borderRadius: 10, // Optional: Increase border radius for rounded corners
  },
  // ... [Add or modify other styles as needed]
  backgroundImage: {
    flex: 1,
    width: "100%", // Ensure it covers the full width of the screen
    height: "100%", // Ensure it covers the full height of the screen
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },

  // Style for the overall container
  container: {
    flex: 1,
    backgroundColor: "transparent", // Let the background image show through
  },

  // Style for the ScrollView to add padding and align items
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },

  // Style for each input container to give more space
  inputContainer: {
    backgroundColor: "rgba(255,255,255,0.9)", // Slight transparency to let background peek through
    borderRadius: 10, // Rounded corners
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000", // Subtle shadow for depth
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    marginHorizontal: 10,
  },
});
