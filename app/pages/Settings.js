import { useState, useRef, useCallback } from "react";
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
 Platform,
 Animated,
 ScrollView
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {logout} from "../utils/auth";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import emailjs from '@emailjs/browser';
const SettingsScreen = () => {
 const [isDarkMode, setIsDarkMode] = useState(false);
 const [bugReportText, setBugReportText] = useState('');
 const [status, setStatus] = useState('');

 const [problemReportText, setProblemReportText] = useState('');
 const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value for fade-in effect


 const sendEmail = () => {

  let templateParams = {
    to_name: "scholarsyncrra@gmail.com",
    to_email: "scholarsyncrra@gmail.com",
    from_name: 'scholar sync app',
    message: bugReportText,
  };

  emailjs.send("service_r9nrk6w", "template_alzjmlj", templateParams, "2OfAIsT81cPeFczkl").then(
    (response) => {
      setStatus("Report Sent Successfully");
      console.log('SUCCESS!', response.status, response.text);
      setBugReportText(''); // Clear the text field

      setTimeout(() => {
        setStatus('');
      }, 3000);
    
    },
 (error) => {
      setStatus('Failed to send the report. Please try again.');
      console.log('FAILED...', error);
      

      setTimeout(() => {
        setStatus('');
      }, 3000);
    }
  );
 }
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

 const toggleSwitch = () => setIsDarkMode(previousState => !previousState);


 // Function to handle the logout action
 const handleLogout = () => {
   // Implement your logout functionality here
   console.log("User logged out");
   logout();
 };


 // Dismiss the keyboard when clicking outside of the TextInput
 const dismissKeyboard = () => {
   Keyboard.dismiss();
 };


 return (
  <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Wrap the TouchableOpacity with ScrollView */}
      <ScrollView>
        <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard} style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
         <View style={styles.card}>
         
           
         {/* Report Bug section */}
         <Text style={styles.reportBugText}>Report Bug:</Text>
         <TextInput
           style={styles.bugReportInput}
           onChangeText={setBugReportText}
           value={bugReportText}
           placeholder="Type here..."
           placeholderTextColor="#C7C7CD"
         />   
 <TouchableOpacity style={styles.reportButton} onPress={sendEmail}>
        <Text style={styles.logoutButtonText}>Send Report</Text>
      </TouchableOpacity>
      <Text style={styles.reportInfoText}>{status !== ''? status : ""}</Text>

{/* Report Problem section */}
{/* <Text style={styles.reportText}>Report Problem:</Text>
         <TextInput
           style={styles.input}
           onChangeText={setProblemReportText}
           value={problemReportText}
           placeholder="Type here..."
           placeholderTextColor="#C7C7CD"
         />
           Logout Section */}
           <View style={styles.logoutSection}>
           <MaterialIcons name="exit-to-app" size={24} color="#000" style={styles.iconStyle} />
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
     </ScrollView>
   </ImageBackground>
   </Animated.View>
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
   height: 340, // Specify the height of the card, adjust as needed
   marginTop: 20,
   

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
  //  fontFamily: 'Lexend', // Make sure 'Lexend-Regular' is correctly linked in your project
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
  //  fontFamily: 'Lexend', // Ensure this font is linked in your project if you're using it
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
   marginRight: 160,
 },
 iconStyle: {
  // You can apply any style here
  marginRight: 10,
  marginLeft: -20,
  color: 'tomato', // Set the color of the icon
  // Add more styling as needed:
  // padding, margin, backgroundColor, etc.
},
 logoutButton: {
   // Apply styles for the button
   paddingVertical: 10,
   paddingHorizontal: 20,
   backgroundColor: 'tomato',
   borderRadius: 20,
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.2,
   shadowRadius: 2,
   elevation: 2,
   
 },
 reportButton: {
  // Apply styles for the button
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: 'tomato',
  borderRadius: 20,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
  marginTop: 10,
  
},
 logoutButtonText: {
   fontWeight: 'bold',
   color: 'white'
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
 reportInfoText: {
  marginTop: 10,
  fontSize: 14,
  color: '#6e6e6e',
  flexWrap: 'wrap',
  width: '80%',
  alignSelf: 'center',
  textAlign: 'center',
  // Any other styling I need for this text
},



  // ... rest of my styles
});


export default SettingsScreen;