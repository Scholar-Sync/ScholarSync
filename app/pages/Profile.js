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
  Animated
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

const EditableText = ({ label, initialText, category, updateUserData, multiline = true, small = false }) => {
  if (!initialText) {
    return
    (<View style={{ alignItems: "center", padding: 20 }}>
      <Text >loading</Text>
    </View>);
  }
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
      <View style={styles.inputContainerSmall}>
        <Text style={styles.labelSmall}>{label}</Text>
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

        <Text style={styles.editButtonTextSmall} onPress={() => handleEdit()}>{isEditable ? "Save" : "Edit"} </Text>

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
        <Text style={styles.editButtonText} onPress={() => handleEdit()}>{isEditable ? "Save" : "Edit"} </Text>
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
      {Object.keys(data).map((key, index) => (
        <EditableText
          key={index}
          label={key}
          category={category}
          initialText={data[key]}
          updateUserData={updateUserData}
          multiline={false}
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
    console.log(userMetadata)
    const uid = userMetadata?.uid
    console.log(uid, "uid")
    const docRef = doc(db, "users", uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        console.log("------Document data:", docSnap.data());
        setUserData(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return {};
      }

    }
    ).catch((error) => {
      console.log("Error getting document:", error);
    }
    )
  }, [userMetadata]);


  // This gets the user id, field and value to update the database with the data saved in the "value" variable.
  const updateUserData = async (field, category, value) => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata?.uid;
    const userDBRef = collection(db, "users");
    var newUserData = userData;
    newUserData[category][field.toLowerCase()] = value;
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
    first: () => <Route data={userData?.academics} category={"academics"} updateUserData={updateUserData} />,
    second: () => <Route data={userData?.extracurriculars} category={"extracurriculars"} updateUserData={updateUserData} />,
    third: () => <Route data={userData?.honors} category={"honors"} updateUserData={updateUserData} />,
  });

  const DetailToggleButton = ({ onPress }) => (
    <TouchableOpacity style={styles.detailButton} onPress={onPress}>
      <Text style={styles.detailButtonText}>Edit Other Details</Text>
    </TouchableOpacity>
  );
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
              source={require("../assets/pfp.jpg")}
              style={styles.profileImage}
            /></View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.9)", margin: 15, borderRadius:10, padding: 10 }}>
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
</View>

          {/* <TextInput
              style={styles.profileName}
              value={userData?.basics?.firstName}
              onChangeText={setProfileName}
              placeholder={userData?.basic?.firstName}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.label}
              value={userData?.basics?.school}
              onChangeText={setProfileName}
              placeholder={userData?.basic?.school}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.label}
              value={userData?.basics?.grade}
              onChangeText={setProfileName}
              placeholder={userData?.basic?.grade}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.label}
              value={userData?.basics?.email}
              onChangeText={setProfileName}
              placeholder={userData?.basic?.email}
              placeholderTextColor="#666"
            /> */}
          {/* <TextInput
              style={styles.profileDetails}
              value={userData?.description}
              onChangeText={setProfileDetails}
              placeholder="Some details about you..."
              placeholderTextColor="#666"
              multiline
            /> */}
          {/* <View style={styles.profileTextContainer}>
              <TextInput
                style={styles.profileTextInput}
                value={userData?.firstName}
                onChangeText={setProfileName}
                editable={true}
              />
              <TextInput
                style={[styles.profileTextInput, styles.profileDetailsInput]}
                value={profileDetails}
                onChangeText={setProfileDetails}
                editable={true}
                multiline
              />
            </View> */}



          <DetailToggleButton onPress={() => setShowTabs(!showTabs)} />

          {/* Tabs Section */}
          {showTabs && userData && (
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
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginHorizontal: 30,
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
    borderRadius: 15, // Set borderRadius for rounded corners
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
    minWidth: 60,
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
    width: 75,
    height: 75,
    borderRadius: 50,
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

  // Text labels for inputs
  label: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
   // Text labels for inputs
   labelSmall: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 2,
  },


  // Style for text inputs
  input: {
    fontSize: 16,
    color: "#555",
    padding: 10,
    borderRadius: 5, // Rounded corners
    backgroundColor: "white", // White background for the input
    marginBottom: 10, // Add space between inputs
  },
   // Style for text inputs
   inputSmall: {
    fontSize: 16,
    color: "#555",
    padding: 3,
    borderRadius: 5, // Rounded corners
    backgroundColor: "white", // White background for the input
    marginBottom: 1, // Add space between inputs
  },

  // Style for multiline inputs to differentiate them
  multilineInput: {
    minHeight: 100, // Minimum height for multiline input
    textAlignVertical: "top", // Align text at the top
  },

  // Tab bar styles for rounded corners and custom colors
  tabBar: {
    backgroundColor: "#F7B500",
    borderRadius: 20,
    overflow: "hidden", // Prevent children from overlapping
    marginHorizontal: 20,
    elevation: 3,
  },

  // Tab indicator styles for a subtle look
  indicator: {
    backgroundColor: "white",
    height: 3, // Make the indicator thicker
  },

  // Tab label styles for a clear, bold look
  labelStyle: {
    fontWeight: "600",
    color: "white",
  },

  // Style for the 'Edit' button to make it stand out
  editButton: {
    backgroundColor: "#36454F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded corners
    alignSelf: "flex-start", // Align to the start of the text input
    marginTop: 10,
  },

  // Text style for the 'Edit' button to make it readable
  editButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },

  // Text style for the 'Edit' button to make it readable
  editButtonTextSmall: {
    color: "#aaa",
    fontWeight: "500",
    marginLeft: 5,
    fontSize: 12,
  },

  // Styles for the profile image and text to make them standout
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  profileDetails: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  // Style for the 'Edit Other Details' button to make it more tactile
  detailButton: {
    backgroundColor: "#F7B500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 30, // Add space before the tabs
  },
  detailButtonText: {
    fontWeight: "600",
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});