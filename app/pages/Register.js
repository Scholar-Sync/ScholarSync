import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import { signup } from "../utils/auth";
import { db } from "../firebase/config";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

// import ( saveUserData } from "../coongi/firebaseDatabase";

const DEFAULT_USER_DATA = {
  basic: {
    username: "",
    email: "",
    description: "",
  },
  academics: {
    gpa: "",
    psat: -1,
    sat: -1,
    act: -1,
    classRank: -1,
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
};

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle navigation to login screen
  const goToLoginScreen = () => {
    navigation.navigate("LoginScreen");
  };

  const createNewUserInDatabase = async (uid, firstName, email) => {
    const userDBRef = collection(db, "users");
    var newUser = DEFAULT_USER_DATA;
    newUser.basic.firstName = firstName;
    newUser.basic.email = email;
    newUser.basic.username = username;
    await setDoc(doc(userDBRef, uid), newUser);
  };

  const handleSignup = async (password, firstName, email) => {
    try {
      const user = await signup(email, password);
      if (user) {
        const id = user.uid;
        await createNewUserInDatabase(id, firstName, email);
        goToLoginScreen();
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSignup(password, firstName, email)}
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
  );
}

// This is the styling for the Registration screen.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    length: "100%",
    width: "100%",
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
