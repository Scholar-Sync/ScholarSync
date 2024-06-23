import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Switch,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { logout } from "../utils/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import emailjs from "@emailjs/browser";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import Icon from "react-native-vector-icons/MaterialIcons";
import { theme } from "../utils/theme"; // Adjust the import path as needed
import Page1 from "../components/Page1";
import { useTheme } from "../utils/ThemeProvider";

const EditableText = ({
  label,
  iconName,
  initialText = "",
  category,
  updateUserData,
  multiline = true,
}) => {
  const [text, setText] = useState(initialText?.toString() || "");
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setIsEditable(false);
  };

  const handleEdit = () => {
    if (isEditable) {
      updateUserData(label, category, text);
    }
    setIsEditable(!isEditable);
    inputRef.current && inputRef.current.focus();
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Icon name={iconName} size={20} style={styles.labelIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.editableContainer}>
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
          <Text style={styles.editButtonText}>
            {isEditable ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingsScreen = ({ userMetadata }) => {
  console.log("SettingsScreen - userMetadata:", userMetadata);

  const { theme, toggleTheme } = useTheme();
  const [bugReportText, setBugReportText] = useState("");
  const [status, setStatus] = useState("");
  const [userData, setUserData] = useState(null);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const sendEmail = () => {
    let templateParams = {
      to_name: "scholarsyncrra@gmail.com",
      to_email: "scholarsyncrra@gmail.com",
      from_name: "scholar sync app",
      message: bugReportText,
    };

    emailjs
      .send(
        "service_r9nrk6w",
        "template_alzjmlj",
        templateParams,
        "2OfAIsT81cPeFczkl"
      )
      .then(
        (response) => {
          setStatus("Report Sent Successfully");
          console.log("SUCCESS!", response.status, response.text);
          setBugReportText("");
          setTimeout(() => {
            setStatus("");
          }, 3000);
        },
        (error) => {
          setStatus("Failed to send the report. Please try again.");
          console.log("FAILED...", error);
          setTimeout(() => {
            setStatus("");
          }, 3000);
        }
      );
  };

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const handleLogout = () => {
    console.log("User logged out");
    logout();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!userMetadata) {
      console.log("No user metadata available");
      return;
    }
    const uid = userMetadata?.uid;
    if (!uid) {
      console.log("No UID found in user metadata");
      return;
    }
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUserData(docSnap.data());
          setIsPrivateMode(docSnap.data().isPrivateMode || false);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, [userMetadata]);

  const updateUserData = async (field, category, value) => {
    if (!userMetadata) {
      console.log("No user metadata available");
      return;
    }
    const uid = userMetadata?.uid;
    const userDBRef = collection(db, "users");
    var newUserData = userData || {};
    if (!newUserData[category]) {
      newUserData[category] = {};
    }
    newUserData[category][field] = value;
    try {
      await setDoc(doc(userDBRef, uid), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const togglePrivateMode = async () => {
    if (!userMetadata) {
      console.log("No user metadata available");
      return;
    }
    setIsLoading(true); // Show loading indicator
    const uid = userMetadata?.uid;
    const userDBRef = doc(db, "users", uid);
    const newUserData = { ...userData, isPrivateMode: !isPrivateMode };
    try {
      await setDoc(userDBRef, newUserData, { merge: true });
      setUserData(newUserData);
      setIsPrivateMode(!isPrivateMode);
      console.log("Private mode updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        backgroundColor: theme.colors.background,
      }}
    >
      <Page1>
        <ScrollView style={{ backgroundColor: "transparent" }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={dismissKeyboard}
            style={[
              styles.container,
              { backgroundColor: theme.colors.background_b },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.colors.background_b },
                ]}
              >
                <View style={styles.toggleContainer}>
                  <Text
                    style={[styles.toggleText, { color: theme.colors.text }]}
                  >
                    Dark Mode
                  </Text>
                  <Switch
                    style={styles.toggleSwitch}
                    value={theme.dark}
                    onValueChange={toggleTheme}
                  />
                </View>
                <View style={styles.toggleContainer}>
                  <Text
                    style={[styles.toggleText, { color: theme.colors.text }]}
                  >
                    Private Mode
                  </Text>
                  <Switch
                    style={styles.toggleSwitch}
                    value={isPrivateMode}
                    onValueChange={togglePrivateMode}
                  />
                </View>
                <Text
                  style={[styles.reportBugText, { color: theme.colors.text }]}
                >
                  Report Bug:
                </Text>
                <TextInput
                  style={[
                    styles.bugReportInput,
                    { backgroundColor: theme.colors.background_b },
                  ]}
                  onChangeText={setBugReportText}
                  value={bugReportText}
                  placeholder="Type here..."
                  placeholderTextColor="#C7C7CD"
                />
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={sendEmail}
                >
                  <Text style={styles.buttonText}>Send Report</Text>
                </TouchableOpacity>
                <Text style={styles.statusText}>{status}</Text>
                <View style={styles.logoutSection}>
                  <MaterialIcons
                    name="exit-to-app"
                    size={24}
                    color="#000"
                    style={styles.iconStyle}
                  />
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.logoutInfoText}>
                  Logging out will bring you back to the Login page.
                </Text>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </ScrollView>
      </Page1>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 30,
    width: "90%",
    alignSelf: "center",
    padding: 25,
    height: 540,
    borderRadius: 15, // Add border radius for the card effect
    shadowColor: "#000", // Add shadow for card effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportBugText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
  },
  bugReportInput: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 40,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  reportButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.selected,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.selected,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6e6e6e",
    flexWrap: "wrap",
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
  logoutSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  iconStyle: {
    marginRight: 10,
  },
  logoutInfoText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6e6e6e",
    flexWrap: "wrap",
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  label: {
    fontSize: 15,
    color: "#C0C0C0",
  },
  labelIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    marginRight: 10,
    color: "#808080",
  },
  inputContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  editableContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleSwitch: {
    marginRight: 10,
  },
  editButtonText: {
    color: "#F6B833",
    fontSize: 12,
  },
  multilineInput: {
    height: 100,
  },
});

export default SettingsScreen;
