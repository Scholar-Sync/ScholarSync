import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Linking,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTheme } from "../utils/ThemeProvider"; // Import the theme context

const EditableBox = ({ label, category, data, updateUserData }) => {
  const [items, setItems] = useState(data || []);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const { theme } = useTheme(); // Use theme context

  const handleSave = (index, text) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { text, isEditable: false } : item
    );
    setItems(updatedItems);
    updateUserData(label, category, updatedItems);
  };

  const handleEdit = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, isEditable: !item.isEditable } : item
    );
    setItems(updatedItems);
    setDropdownIndex(null); // Close the dropdown after edit
  };

  const handleRemove = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    updateUserData(label, category, updatedItems);
  };

  const addItem = () => {
    Alert.prompt(
      "New Item",
      "Enter the text for the new item:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: (newItemText) => {
            if (newItemText) {
              const updatedItems = [
                ...items,
                { text: newItemText, isEditable: false },
              ];
              setItems(updatedItems);
              updateUserData(label, category, updatedItems);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <View style={[styles.editableBox, { backgroundColor: theme.colors.background_b }]}>
      <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>{label}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {item.isEditable ? (
            <TextInput
              style={[
                styles.itemTextInput,
                {
                  color: theme.colors.text,
                  borderBottomColor: theme.colors.primary,
                },
              ]}
              value={item.text}
              onChangeText={(text) => {
                const updatedItems = items.map((item, i) =>
                  i === index ? { ...item, text } : item
                );
                setItems(updatedItems);
              }}
              onBlur={() => handleSave(index, item.text)}
              autoFocus
              multiline
            />
          ) : (
            <Text style={[styles.itemText, { color: theme.colors.text }]}>{item.text}</Text>
          )}
          <TouchableOpacity
            onPress={() => setDropdownIndex(dropdownIndex === index ? null : index)}
            style={styles.moreButton}
          >
            <Icon name="more-vert" size={20} color={theme.colors.icon} />
          </TouchableOpacity>
          {dropdownIndex === index && (
            <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.selected }]}>
              {item.isEditable ? (
                <TouchableOpacity onPress={() => handleSave(index, item.text)} style={styles.dropdownItem}>
                  <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleEdit(index)} style={styles.dropdownItem}>
                  <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleRemove(index)} style={styles.dropdownItem}>
                <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
        <Icon name="add" size={20} color={theme.colors.icon} />
        <Text style={[styles.addItemButtonText, { color: theme.colors.text }]}>Add New Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileScreen = ({ userMetadata }) => {
  const layout = useWindowDimensions();
  const [userData, setUserData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sections, setSections] = useState(["Achievements", "Extracurricular", "Academics"]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { theme } = useTheme(); // Use theme context

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interests, setInterests] = useState("");
  const [isAgeEditable, setIsAgeEditable] = useState(false);
  const [isPhoneNumberEditable, setIsPhoneNumberEditable] = useState(false);
  const [isInterestsEditable, setIsInterestsEditable] = useState(false);

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

  useEffect(() => {
    if (!userMetadata) {
      return;
    }
    const uid = userMetadata?.uid;
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
          if (data.basic) {
            setName(data.basic.firstName);
            setTitle(data.basic.school || "School");
            setAge(data.basic.email || "");
            setPhoneNumber(data.basic.phoneNumber || "");
            setInterests(data.basic.interests || "");
          }
        } else {
          return {};
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, [userMetadata]);

  const updateUserData = async (field, category, value) => {
    if (!userMetadata) {
      console.error("No user metadata available");
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
      console.log("User data updated:", newUserData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const shareToSocial = (socialType) => {
    if (!userData) return;
    const payload =
      "Check out my stats on ScholarSync! " +
      "\nSchool: " +
      (userData["basic"]?.["school"] || "N/A") +
      "\nGrade: " +
      (userData["basic"]?.["grade"] || "N/A") +
      "\nSAT: " +
      (userData["academics"]?.["sat"] || "N/A") +
      "\nACT: " +
      (userData["academics"]?.["act"] || "N/A");
    const url =
      socialType === "reddit"
        ? `https://www.reddit.com/submit?title=My ScholarSync Profile&url=${payload}`
        : socialType === "twitter"
        ? `https://twitter.com/intent/tweet?text=${encodeURI(payload)}`
        : `https://www.instagram.com/create/story`;

    Linking.openURL(url)
      .then(() => {
        alert(`${socialType.charAt(0).toUpperCase() + socialType.slice(1)} Opened`);
      })
      .catch(() => {});
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
            setSections([...sections, sectionName]);
          },
        },
      ],
      "plain-text"
    );
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image picker result:", result); // Log the full result object

    if (!result.canceled) {
      const uri = result.assets[0].uri; // Access the URI from the assets array
      console.log("Image picked:", uri);
      setImageUri(uri);
      setProfileImage(uri); // Update profile image immediately
      uploadImage(uri); // Upload image immediately after picking it
    } else {
      console.log("Image pick cancelled");
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    console.log("Uploading image:", uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const uid = userMetadata.uid;
    const storageRef = ref(storage, `profilePictures/${uid}`);
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Image uploaded, getting download URL");
        getDownloadURL(snapshot.ref)
          .then((downloadURL) => {
            console.log("Download URL:", downloadURL);
            setProfileImage(downloadURL);
            updateUserData("profileImage", "basic", downloadURL);
            setUploading(false);
            Alert.alert("Success", "Profile picture updated successfully!");
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setUploading(false);
            Alert.alert("Error", "Failed to update profile picture. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setUploading(false);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      });
  };

  const handleSaveName = () => {
    updateUserData("firstName", "basic", name);
    setIsNameEditable(false);
  };

  const handleSaveTitle = () => {
    updateUserData("school", "basic", title);
    setIsTitleEditable(false);
  };

  const handleSaveAge = () => {
    updateUserData("email", "basic", age);
    setIsAgeEditable(false);
  };

  const handleSavePhoneNumber = () => {
    updateUserData("phoneNumber", "basic", phoneNumber);
    setIsPhoneNumberEditable(false);
  };

  const handleSaveInterests = () => {
    updateUserData("interests", "basic", interests);
    setIsInterestsEditable(false);
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.coverContainer, { backgroundColor: theme.colors.selected }]} />
          <View style={[styles.headerContainer, { backgroundColor: theme.colors.background_b }]}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../assets/pfp1.png")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.profileInfoContainer}>
              {isNameEditable ? (
                <TextInput
                  style={[styles.userName, { color: theme.colors.text }]}
                  value={name}
                  onChangeText={setName}
                  onBlur={handleSaveName}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsNameEditable(true)}>
                  <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              )}
              {isTitleEditable ? (
                <TextInput
                  style={[styles.userTitle, { color: theme.colors.text }]}
                  value={title}
                  onChangeText={setTitle}
                  onBlur={handleSaveTitle}
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsTitleEditable(true)}>
                  <Text style={[styles.userTitle, { color: theme.colors.text }]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              )}
              {uploading && <Text style={{ color: theme.colors.text }}>Uploading...</Text>}
            </View>
            <View style={styles.additionalInfoContainer}>
              {isAgeEditable ? (
                <TextInput
                  style={[styles.additionalInfo, { color: theme.colors.text }]}
                  value={age}
                  onChangeText={setAge}
                  onBlur={handleSaveAge}
                  keyboardType="numeric"
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsAgeEditable(true)}>
                  <Text style={[styles.additionalInfo, { color: theme.colors.text }]}>
                    Email: {age}
                  </Text>
                </TouchableOpacity>
              )}
              {isPhoneNumberEditable ? (
                <TextInput
                  style={[styles.additionalInfo, { color: theme.colors.text }]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onBlur={handleSavePhoneNumber}
                  keyboardType="phone-pad"
                  autoFocus
                />
              ) : (
                <TouchableOpacity onPress={() => setIsPhoneNumberEditable(true)}>
                  <Text style={[styles.additionalInfo, { color: theme.colors.text }]}>
                    Phone: {phoneNumber}
                  </Text>
                </TouchableOpacity>
              )}
              
            </View>
          </View>

          {sections.map((section, index) => (
            <View key={index} style={styles.sectionWrapper}>
              <View style={[styles.sectionContainer, { backgroundColor: theme.colors.background_b }]}>
                  <TouchableOpacity onPress={() => removeSection(index)} style={styles.trashButton}>
                    <Icon name="delete" size={20} color="#BDBDBD" />
                  </TouchableOpacity>
                
                <EditableBox
                  label={`Add ${section}`}
                  category={section.toLowerCase()}
                  data={userData?.[section.toLowerCase()] || []}
                  updateUserData={updateUserData}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity onPress={addSection} style={[styles.addSectionButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.addSectionButtonText, { color: theme.colors.text_b }]}>
              + Add New Section
            </Text>
          </TouchableOpacity>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.socialButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => shareToSocial("twitter")}
            >
              <Image source={require("../assets/twitterlogo.png")} style={styles.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.socialButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => shareToSocial("reddit")}
            >
              <Image source={require("../assets/redditlogo.png")} style={styles.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.socialButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => shareToSocial("instagram")}
            >
              <Image source={require("../assets/instagram.png")} style={styles.instagramButtonIcon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    width: "100%",
    height: 150,
  },
  headerContainer: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  additionalInfoContainer: {
    marginLeft: 20,
    justifyContent: "center",
    marginTop: 15
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: -105
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: -95,
  },
  userTitle: {
    fontSize: 14,
    color: "#777",
    marginLeft: -95,

  },
  additionalInfo: {
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadImageButton: {
    paddingHorizontal: 5,
    paddingTop: 8,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
    height: 30
  },
  uploadImageButtonText: {
    fontSize: 10,
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionWrapper: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    borderRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
    paddingBottom: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  trashButton: {
    backgroundColor: "transparent",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 255,
    marginBottom: -15
  },
  editableBox: {
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemTextInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
  },
  moreButton: {
    marginLeft: 10,
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 5,
    borderRadius: 5,
    
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  addItemButtonText: {
    fontSize: 16,
    marginLeft: 5,
  },
  addSectionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addSectionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  socialButtonsTitleContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  socialButtonsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  socialButton: {
    flexDirection: "row",
    borderRadius: 100,
    height: 45,
    backgroundColor: 'transparent',
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonIcon: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  instagramButtonIcon: {
    width: 77,
    height: 77,
    resizeMode: "contain",
  },
});

export default ProfileScreen;