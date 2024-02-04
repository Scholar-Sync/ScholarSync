import React, { useState } from "react";
import {
 View,
 Text,
 Image,
 StyleSheet,
 ImageBackground,
 Switch,
 TextInput,
 TouchableOpacity,
 Keyboard,
 KeyboardAvoidingView,
 Platform
} from "react-native";


const SettingsScreen = () => {
 const [isDarkMode, setIsDarkMode] = useState(false);
 const [bugReportText, setBugReportText] = useState('');
 const [problemReportText, setProblemReportText] = useState('');


 const toggleSwitch = () => setIsDarkMode(previousState => !previousState);


 // Function to handle the logout action
 const handleLogout = () => {
   // Implement your logout functionality here
   console.log("User logged out");
 };


 // Dismiss the keyboard when clicking outside of the TextInput
 const dismissKeyboard = () => {
   Keyboard.dismiss();
 };


 return (
   <ImageBackground
     source={require("../assets/background.png")}
     style={styles.backgroundImage}
     resizeMode="cover"
   >
     <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard} style={styles.container}>
       <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1 }}
       >
         <View style={styles.card}>
         {/* Profile section */}
         <View style={styles.profileSection}>
           <Image
             source={require("../assets/profile_image.png")}
             style={styles.profileImage}
           />
           <Text style={styles.usernameText}>Change Username: EthanScholar1</Text>
         </View>
         {/* Email section */}
         <View style={styles.emailSection}>
           <Image
             source={require("../assets/letter.png")}
             style={styles.emailIcon}
           />
           <Text style={styles.usernameText}>Email: ***************</Text>
         </View>
         {/* Password section */}
         <View style={styles.passwordSection}>
           <Image
             source={require("../assets/lock.png")}
             style={styles.lockIcon}
           />
           <Text style={styles.usernameText}>Password: ********</Text>
         </View>
         {/* Verify Email Link */}
         <Text style={styles.verifyEmailText}>VERIFY EMAIL?</Text>
         {/* Dark Mode / Light Mode section */}
         <View style={styles.darkModeSection}>
           <Text style={styles.darkModeText}>Dark Mode / Light Mode</Text>
           <Switch
             trackColor={{ false: "#767577", true: "#81b0ff" }}
             thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
             ios_backgroundColor="#3e3e3e"
             onValueChange={toggleSwitch}
             value={isDarkMode}
           />
         </View>
         {/* Report Bug section */}
         <Text style={styles.reportBugText}>Report Bug:</Text>
         <TextInput
           style={styles.bugReportInput}
           onChangeText={setBugReportText}
           value={bugReportText}
           placeholder="Type here..."
           placeholderTextColor="#C7C7CD"
         />   
{/* Report Problem section */}
<Text style={styles.reportText}>Report Problem:</Text>
         <TextInput
           style={styles.input}
           onChangeText={setProblemReportText}
           value={problemReportText}
           placeholder="Type here..."
           placeholderTextColor="#C7C7CD"
         />
           {/* Logout Section */}
           <View style={styles.logoutSection}>
             <Image
               source={require("../assets/door.png")} // Make sure you have the door.png in your assets directory
               style={styles.doorIcon}
             />
             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
               <Text style={styles.logoutButtonText}>Logout</Text>
             </TouchableOpacity>
           </View>
             {/* Logout Info Text */}
             <Text style={styles.logoutInfoText}>
             Logging out will bring you back to the Login page.
           </Text>
          
           {/* ... any other settings sections you may have */}
         </View>
       </KeyboardAvoidingView>
     </TouchableOpacity>
   </ImageBackground>
 );
};


const styles = StyleSheet.create({
 backgroundImage: {
   flex: 1, // This ensures that the background image will cover the entire screen
 },
 container: {
   flex: 1,
   justifyContent: 'center', // Centers the child components vertically in the container
   alignItems: 'center', // Centers the child components horizontally in the container
 },
 card: {
   backgroundColor: 'white',
   borderRadius: 10,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.2,
   shadowRadius: 2,
   elevation: 2,
   margin: 20,
   padding: 20,
   width: 340, // Specify the width of the card
   height: 530, // Specify the height of the card, adjust as needed
   marginTop: 12,
 },
 profileSection: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 20,
 },
 emailSection: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 5, // Reduced bottom margin for email section
 },
 passwordSection: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 10, // Bottom margin for password section, adjust if necessary
 },
 profileImage: {
   width: 25, // Adjust size as necessary for the profile image
   height: 25, // Adjust size as necessary for the profile image
   marginRight: 10,
 },
 emailIcon: { // Style for the email icon
   width: 50, // Adjust width as necessary for the email icon
   height: 50, // Adjust height as necessary for the email icon
   marginLeft: -14,
   marginRight: 1,
   marginTop: 5,
 },
 usernameText: {
   fontSize: 16, // Adjust size as necessary
   fontFamily: 'Lexend', // Make sure 'Lexend-Regular' is correctly linked in your project
 },
 lockIcon: {
   width: 35, // Adjust the size to fit your layout
   height: 35, // Adjust the size to fit your layout
   marginLeft: -7,
   marginRight: 9,
   marginBottom: 2,
 },
 verifyEmailText: {
   fontSize: 9,
   color: 'blue',
   textDecorationLine: 'underline',
   marginLeft: 38,
   marginTop: -14
 },
 darkModeSection: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginTop: 27,
   paddingHorizontal: 25,
   marginLeft: -9,
 },
 darkModeText: {
   fontSize: 16,
   fontWeight: 'bold',
 },
 reportBugText: {
   fontSize: 16,
   fontWeight: 'bold',
   marginTop: 20, // Add margin as needed
 },
 bugReportInput: {
   backgroundColor: 'white', // Background color for the text input
   borderRadius: 10, // Match to your card's border radius
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2, // Adjust shadow offset as needed
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
   height: 40, // Adjust height as needed
   paddingHorizontal: 10, // Padding for the text inside the text input
   marginTop: 10, // Space above the text input
   fontFamily: 'Lexend', // Ensure this font is linked in your project if you're using it
 },
 reportText: {
   fontSize: 16,
   fontWeight: 'bold',
   marginTop: 20,
 },
 input: {
   backgroundColor: 'white',
   borderRadius: 10,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
   height: 40,
   paddingHorizontal: 10,
   marginTop: 10,
 },
 logoutSection: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   marginTop: 20,
 },
 doorIcon: {
   width: 24,
   height: 24,
   marginRight: 12,
   marginLeft: -180,
 },
 logoutButton: {
   // Apply styles for the button
   paddingVertical: 10,
   paddingHorizontal: 20,
   backgroundColor: '#FFF',
   borderRadius: 20,
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.2,
   shadowRadius: 2,
   elevation: 2,
 },
 logoutButtonText: {
   fontWeight: 'bold',
 },
 logoutInfoText: {
   marginTop: 10,
   fontSize: 14,
   color: '#6e6e6e',
   flexWrap: 'wrap',
   width: '80%',
   alignSelf: 'center',
   // Any other styling I need for this text
 },




  // ... rest of my styles
});


export default SettingsScreen;
