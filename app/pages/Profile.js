import * as React from "react";
import { useState, useRef } from "react";
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
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const EditableText = ({ label, initialText, multiline = true }) => {
  const [text, setText] = useState(initialText.toString()); // Convert initialText to string
  // ... rest of your EditableText component
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const handleEditPress = () => {
    setIsEditable(true);
    inputRef.current && inputRef.current.focus();
  };

  const handleBlur = () => {
    setIsEditable(false);
  };

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
      {!isEditable && (
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const Route = ({ data }) => {
  return (
    <ScrollView
      style={{ flex: 1 }} // Ensure ScrollView takes the full height
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollViewContent}
    >
      {data.map((item, index) => (
        <EditableText
          key={index}
          label={item.label}
          initialText={item.value}
          multiline={item.multiline}
        />
      ))}
    </ScrollView>
  );
};
export default function TabViewExample() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [showTabs, setShowTabs] = useState(false);

  const [routes] = useState([
    { key: "first", title: "Academics" },
    { key: "second", title: "Extracurriculars" },
    { key: "third", title: "Honors" },
  ]);

  const [profileName, setProfileName] = useState("Your Name");
  const [profileDetails, setProfileDetails] = useState(
    "Some details about you..."
  );

  const essentialsData = [
    { label: "Username", value: "your_username" },
    { label: "Email", value: "your_email@example.com" },
  ];

  const academicsData = [
    { label: "GPA:", value: "4.0" },
    { label: "PSAT/SAT/ACT:", value: "PSAT: 1250\nSAT: 1490\nACT: 33" },
    { label: "CLASS RANK:", value: "12/496" },
    {
      label: "AP COURSES/SCORES:",
      value:
        "AP Human Geography: 3\nAP World History: 2\nAP Calculus: 5\nAP Biology: 4\nAP Computer Science: 5\nAP Macro Economics: 5\nAP Seminar: 3\nAP US History: 4",
      multiline: true,
    },
    {
      label: "OTHERS:",
      value: "Algorithms\nData Structures\nMachine Learning",
    },
  ];

  const extracurricularsData = [
    { label: "Clubs:", value: "Coding Club, Chess Club" },
    { label: "Sports:", value: "Basketball, Swimming" },
    { label: "Volunteering:", value: "Local Library, Animal Shelter" },
  ];

  const honorsData = [
    { label: "Awards:", value: "Dean's List, Coding Competition Winner" },
    { label: "Scholarships:", value: "Tech Future Scholarship" },
    { label: "Certifications:", value: "AWS Certified Solutions Architect" },
  ];

  const renderScene = SceneMap({
    first: () => <Route data={academicsData} />,
    second: () => <Route data={extracurricularsData} />,
    third: () => <Route data={honorsData} />,
  });


  const DetailToggleButton = ({ onPress }) => (
    <TouchableOpacity
      style={styles.detailButton}
      onPress={onPress}
    >
      <Text style={styles.detailButtonText}>Edit Other Details</Text>
    </TouchableOpacity>
  );
  return (
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
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Image
          source={require("../assets/pfp.jpg")}
          style={styles.profileImage}
        />
        <TextInput
          style={styles.profileName}
          value={profileName}
          onChangeText={setProfileName}
          placeholder="Your Name"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.profileDetails}
          value={profileDetails}
          onChangeText={setProfileDetails}
          placeholder="Some details about you..."
          placeholderTextColor="#666"
          multiline
        />
            <View style={styles.profileTextContainer}>
              <TextInput
                style={styles.profileTextInput}
                value={profileName}
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
            </View>
          </View>

          {essentialsData.map((item, index) => (
        <EditableText
          key={index}
          label={item.label}
          initialText={item.value}
          multiline={false}
        />
      ))}
            <DetailToggleButton onPress={() => setShowTabs(!showTabs)} />

          

      {/* Tabs Section */}
      {showTabs && (
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
    );
  }
const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
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
    overflow: 'hidden', // This ensures that the children do not overlap the corners
  },
  inputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
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
    backgroundColor: '#36454F',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
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
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
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
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center'
  },
  profileDetails: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 8
  },
  detailButton: {
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#F7B500',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
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
    width: '100%', // Ensure it covers the full width of the screen
    height: '100%', // Ensure it covers the full height of the screen
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  
  // Style for the overall container
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Let the background image show through
  },

  // Style for the ScrollView to add padding and align items
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },

  // Style for each input container to give more space
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)', // Slight transparency to let background peek through
    borderRadius: 10, // Rounded corners
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000', // Subtle shadow for depth
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
    color: '#333',
    marginBottom: 10,
  },

  // Style for text inputs
  input: {
    fontSize: 16,
    color: '#555',
    padding: 10,
    borderRadius: 5, // Rounded corners
    backgroundColor: 'white', // White background for the input
    marginBottom: 10, // Add space between inputs
  },

  // Style for multiline inputs to differentiate them
  multilineInput: {
    minHeight: 100, // Minimum height for multiline input
    textAlignVertical: 'top', // Align text at the top
  },

  // Tab bar styles for rounded corners and custom colors
  tabBar: {
    backgroundColor: '#F7B500',
    borderRadius: 20,
    overflow: 'hidden', // Prevent children from overlapping
    marginHorizontal: 20,
    elevation: 3,
  },

  // Tab indicator styles for a subtle look
  indicator: {
    backgroundColor: 'white',
    height: 3, // Make the indicator thicker
  },

  // Tab label styles for a clear, bold look
  labelStyle: {
    fontWeight: "600",
    color: 'white',
  },

  // Style for the 'Edit' button to make it stand out
  editButton: {
    backgroundColor: '#36454F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // Rounded corners
    alignSelf: 'flex-start', // Align to the start of the text input
    marginTop: 10,
  },

  // Text style for the 'Edit' button to make it readable
  editButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
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
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  profileDetails: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Style for the 'Edit Other Details' button to make it more tactile
  detailButton: {
    backgroundColor: '#F7B500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 30, // Add space before the tabs
  },
  detailButtonText: {
    fontWeight: '600',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});
