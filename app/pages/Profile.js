import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Animated,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import ViewPager from "react-native-pager-view";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditableTextArea = ({ label, data, updateUserData, sectionIndex, removeSection }) => {
  const [text, setText] = useState(data || "");

  const handleChangeText = (newText) => {
    setText(newText);
    updateUserData(sectionIndex, newText);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{label}</Text>
        <TouchableOpacity onPress={() => removeSection(sectionIndex)} style={styles.removeSectionButton}>
          <Icon name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textArea}
        value={text}
        onChangeText={handleChangeText}
        placeholder={`Start typing your ${label.toLowerCase()}...`}
        multiline
      />
      <Text style={styles.sectionTitle}>{label}</Text>
    </View>
  );
};

const ProfileScreen = ({ userMetadata }) => {
  const [userData, setUserData] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sections, setSections] = useState(["Academics", "Extracurriculars", "Honors"]);
  const [currentPage, setCurrentPage] = useState(0);

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

  React.useEffect(() => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata.uid;
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData({});
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, [userMetadata]);

  const updateUserData = async (sectionIndex, value) => {
    const uid = userMetadata.uid;
    const updatedData = { ...userData };
    updatedData[sections[sectionIndex]] = value;
    setUserData(updatedData);
  };

  const saveUserData = async () => {
    const uid = userMetadata.uid;
    try {
      await setDoc(doc(db, "users", uid), userData);
      Alert.alert("Success", "Your data has been saved.");
    } catch (error) {
      console.error("Error saving document: ", error);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  const addSection = () => {
    Alert.prompt(
      "New Section",
      "Enter the name for the new section:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (sectionName) => {
            if (sectionName) {
              setSections([...sections, sectionName]);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const removeSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
    const updatedData = { ...userData };
    delete updatedData[sections[index]];
    setUserData(updatedData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require("../assets/background108.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : null}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.profileContainer}>
                <View style={styles.profileHeader}>
                  <Image
                    source={require("../assets/pfp1.png")}
                    style={styles.profileImage}
                  />
                  <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>Ethan Jackson</Text>
                    <Text style={styles.profileInfo}>
                      Grade: 11th {"\n"}
                      School: Westview High School {"\n"}
                      Graduation Year: 2023 {"\n"}
                      GPA: UW - 3.9 | W - 4.1 {"\n"}
                    </Text>
                  </View>
                </View>
              </View>

              <ViewPager
                style={styles.viewPager}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
              >
                {sections.map((section, index) => (
                  <View key={index} style={styles.page}>
                    <View style={styles.infoContainer}>
                      <EditableTextArea
                        label={section}
                        data={userData[section] || `Example text for ${section}`}
                        updateUserData={updateUserData}
                        sectionIndex={index}
                        removeSection={removeSection}
                      />
                    </View>
                  </View>
                ))}
              </ViewPager>

              <View style={styles.paginationContainer}>
                {sections.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { opacity: currentPage === index ? 1 : 0.3 },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
                <Text style={styles.addSectionButtonText}>+ Add New Section</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={saveUserData} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  profileContainer: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "black",
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  profileInfo: {
    fontSize: 16,
    color: "black",
  },
  infoContainer: {
    backgroundColor: "#F9EFDF",
    margin: 15,
    borderRadius: 10,
    padding: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  removeSectionButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    height: 400,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#4A90E2",
    marginTop: 10,
  },
  addSectionButton: {
    backgroundColor: "#F6B833",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
  },
  addSectionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  viewPager: {
    height: 400,
  },
  page: {
    flex: 1,
  },
});

export default ProfileScreen;