import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

const SettingsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Replace with your image path
      style={styles.backgroundImage}
      resizeMode="cover" // or 'stretch' or 'contain', depending on how you want it displayed
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Rest of your component code */}
        {/* Make sure to close the ImageBackground tag after all your components */}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // This ensures that the background image will cover the entire screen
  },
  container: {
    flexGrow: 1, // This ensures that the ScrollView will expand to fit the content
    // ... other styles for your container
  },
  // ... rest of your styles
});

export default SettingsScreen;
