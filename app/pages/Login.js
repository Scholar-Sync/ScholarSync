import React, { useState, useRef, useCallback } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated, // Import Animated for the fade-in effect
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { login } from "../utils/auth";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value for fade-in effect

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); // Reset the opacity to 0
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade to full opacity
        duration: 600, // Adjust the duration as needed
        useNativeDriver: true,
      }).start();
    }, [])
  );

  const onFooterLinkPress = () => {
    navigation.navigate("RegistrationScreen");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        console.log("User signed in: ", user);
      }
    } catch (error) {
      setLoading(false);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Invalid email or password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many unsuccessful login attempts. Please try again later.");
      } else {
        alert("Sign-in error: " + error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
          <Image
            style={styles.logo}
            source={require("../assets/scholar.png")}
          />
          <View style={styles.divider} />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <View style={styles.divider1} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLogin(email, password)}
          >
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              <Text
                onPress={() => navigation.navigate("Welcome")}
                style={styles.footerLink}
              >
                Go Back
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%", // Ensure container fills the width
    height: "100%", // Ensure container fills the height
  },
  divider1: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginTop: 10,
    marginHorizontal: 55
  },
  divider: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginBottom: 10, // Spacing above and below the line
    marginHorizontal: 55
  },

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {},
  logo: {
    flex: 1,
    height: 200,
    width: 200,
    alignSelf: "center",
    marginTop: 23,
  },

  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#F7B500",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginVertical: 20,
    shadowColor: "#F7B500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginRight: 75,
    marginLeft: 75,
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#F7B500",
    fontWeight: "bold",
    fontSize: 16,
  },
});