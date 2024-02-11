import React from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function WelcomeScreen() {
  const navigation = useNavigation(); // Use the useNavigation hook

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/scholar.png")}
          style={styles.topImage}
        />
        <Text style={styles.welcomeText}>Scholar Sync!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")} // Navigate to LoginScreen
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")} // Navigate to RegistrationScreen
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    length: "100%",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 28,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  topImage: {
    width: 200, // Set your desired width
    height: 200, // Set your desired height
    resizeMode: "contain", // This ensures the image scales properly
    marginBottom: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#F7B500",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20, // add horizontal padding
    paddingVertical: 15, // increase vertical padding if needed
    marginVertical: 10,
    width: 200, // set a specific width
    height: 50, // set a specific height
    shadowColor: "#F7B500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
