import React, { useState, useCallback, useRef } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import { signup } from "../utils/auth";
import { db } from "../firebase/config";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

// import ( saveUserData } from "../coongi/firebaseDatabase";

const DEFAULT_USER_DATA = {
  uid: "",
  basic: {
    username: "",
    email: "",
    description: "",
    school: "",
    grade: "",
  },
  academics: {
    gpa: "...",
    psat: "...",
    sat: "...",
    act: "...",
    classRank: "...",
    apCourses: [],
    others: [],
  },
  extracurriculars: {
    clubs: [],
    sports: [],
    volunteering: [],
  },
  honors: {
    awards: [],
    scholarships: [],
    certifications: [],
  },
  bookmarks: [],
  private: false,
};

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Handle navigation to login screen
  const goToLoginScreen = () => {
    navigation.navigate("Login");
  };

  const createNewUserInDatabase = async (uid) => {
    const userDBRef = collection(db, "users");
    var newUser = DEFAULT_USER_DATA;
    newUser.uid = uid;
    newUser.basic.firstName = firstName;
    newUser.basic.email = email;
    newUser.basic.username = username;
    newUser.basic.grade = grade;
    newUser.basic.school = school;
    await setDoc(doc(userDBRef, uid), newUser); // sends data to firestore (database)
  };

  const handleSignup = async () => {
    try {
      const user = await signup(email, password); // tries to sign up a new user
      if (user) {
        // if the user is successfully signed up, add the rest of the data to firestore (database)
        const id = user.uid;
        await createNewUserInDatabase(id); // calls the function a few lines above
        //goToLoginScreen();
      }
    } catch (error) {
      console.log("Error signing up: ", error.code, error.message);
      if ((error.code = a = "auth/email-already-in-use")) {
        alert("Email already in use. Please choose a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("Weak password. Please choose a stronger password.");
      } else {
        alert("Signup error: " + error.message);
      }
    }
  };
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ImageBackground
        source={require("../assets/background.png")} // Specify your background image path here
        style={styles.background}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.container}>
            <Image
              style={styles.logo}
              source={require("../assets/scholar.png")}
            />
            <View style={styles.divider} />

            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="Grade"
              onChangeText={(text) => setGrade(text)}
              value={grade}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaaaaa"
              placeholder="School"
              onChangeText={(text) => setSchool(text)}
              value={school}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
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
              onPress={() => handleSignup()}
            >
              <Text style={styles.buttonTitle}>Create account</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
              <Text style={styles.footerText}>
                {" "}
                <Text
                  onPress={() => navigation.navigate("Welcome")}
                  style={styles.footerLink}
                >
                  Go Back
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </Animated.View>
  );
}

// This is the styling for the Registration screen.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    length: "100%",
    width: "100%",
  },
  divider1: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginTop: 10,
    marginHorizontal: 55,
  },
  divider: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginBottom: 10, // Spacing above and below the line
    marginHorizontal: 55,
  },
  background: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {},
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    flex: 1,
    height: 200,
    width: 200,
    alignSelf: "center",
    margin: 10,
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
    marginBottom: 50,
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
