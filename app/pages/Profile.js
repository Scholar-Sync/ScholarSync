import * as React from "react";
import { useState, useRef, useCallback } from "react";
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
import { launchImageLibrary } from 'react-native-image-picker';

const EditableBox = ({ label, category, data, updateUserData }) => {
  const [items, setItems] = useState(data || []);
  const [dropdownIndex, setDropdownIndex] = useState(null);

  const calculateFontSize = (text) => {
    const length = text.length;
    if (length < 20) return 24;
    if (length < 50) return 20;
    if (length < 100) return 16;
    return 12;
  };

  const handleSave = (index, text) => {
    const updatedItems = items.map((item, i) => (i === index ? { text, isEditable: false } : item));
    setItems(updatedItems);
    updateUserData(label, category, updatedItems);
  };

  const handleEdit = (index) => {
    const updatedItems = items.map((item, i) => (i === index ? { ...item, isEditable: !item.isEditable } : item));
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
              const updatedItems = [...items, { text: newItemText, isEditable: false }];
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
    <View style={styles.editableBox}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal style={styles.horizontalScrollView}>
        {items.map((item, index) => (
          <View key={index} style={styles.squareBox}>
            {item.isEditable ? (
              <TextInput
                style={[styles.itemTextInput, { fontSize: calculateFontSize(item.text) }]}
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
              <Text style={[styles.itemText, { fontSize: calculateFontSize(item.text) }]}>{item.text}</Text>
            )}
            <TouchableOpacity onPress={() => setDropdownIndex(dropdownIndex === index ? null : index)} style={styles.moreButton}>
              <Icon name="more-vert" size={20} color="#e74c3c" />
            </TouchableOpacity>
            {dropdownIndex === index && (
              <View style={styles.dropdownMenu}>
                {item.isEditable ? (
                  <TouchableOpacity onPress={() => handleSave(index, item.text)} style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleEdit(index)} style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleRemove(index)} style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.newSquareBox} onPress={addItem}>
          <Icon name="add" size={40} color="#ecf0f1" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ProfileScreen = ({ userMetadata }) => {
  const layout = useWindowDimensions();
  const [userData, setUserData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sections, setSections] = useState([
    "Achievements",
    "Extracurricular",
    "Academics",
  ]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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
    const uid = userMetadata?.uid;
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          if (docSnap.data().profileImage) {
            setProfileImage(docSnap.data().profileImage);
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
        : `https://www.instagram.com/create/story

`;

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
    setSectionDropdownIndex(null); // Close the dropdown after removing the section
  };

  const uploadImage = async (uri) => {
    if (!userMetadata) return;
    const uid = userMetadata.uid;
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`profilePictures/${uid}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  };

  const handleProfileImageChange = () => {
    launchImageLibrary({ mediaType: 'photo' })
      .then((response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const source = response.assets[0].uri;
          setImageUri(source);
        }
      })
      .catch((error) => {
        console.error('Error launching image library: ', error);
      });
  };

  const handleSavePhoto = async () => {
    if (imageUri) {
      try {
        const downloadURL = await uploadImage(imageUri);
        setProfileImage(downloadURL);
        await updateUserData('profileImage', 'basic', downloadURL);
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        console.error('Error saving profile picture: ', error);
        Alert.alert('Error', 'Failed to update profile picture. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select an image first.');
    }
  };

  const prefilledData = {
    achievements: [{ text: "Example: Valedictorian" }, { text: "Example: National Merit Scholar" }],
    extracurricular: [{ text: "Example: Debate Team Captain" }, { text: "Example: Varsity Soccer" }],
    academics: [
      { text: "SAT: " },
      { text: "PSAT: " },
      { text: "ACT: " },
      { text: "Class Rank: " },
    ],
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: "#2c3e50" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleProfileImageChange}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/pfp1.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfileImageChange} style={styles.uploadImageButton}>
              <Text style={styles.uploadImageButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSavePhoto} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Photo</Text>
            </TouchableOpacity>
          </View>
          
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionWrapper}>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeader}>{section}</Text>
                  <TouchableOpacity onPress={() => removeSection(index)} style={styles.trashButton}>
                    <Icon name="delete" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
                <EditableBox
                  label={`Add ${section}`}
                  category={section.toLowerCase()}
                  data={userData?.[section.toLowerCase()]?.custom || prefilledData[section.toLowerCase()]}
                  updateUserData={updateUserData}
                />
              </View>
              {index < sections.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          <View style={styles.socialButtonsTitleContainer}>
            <Text style={styles.socialButtonsTitle}>Share to:</Text>
          </View>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.socialButton}
              onPress={() => shareToSocial("twitter")}
            >
              <Image
                source={require("../assets/twitterlogo.png")} // Adjust the path as necessary
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.socialButton2}
              onPress={() => shareToSocial("reddit")}
            >
              <Image
                source={require("../assets/redditlogo.png")} // Adjust the path as necessary
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.instagramButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.instagramButton}
              onPress={() => shareToSocial("instagram")}
            >
              <Image
                source={require("../assets/instagram.png")} // Adjust the path as necessary
                style={styles.instagramButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
            <Text style={styles.addSectionButtonText}>+ Add New Section</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
    paddingVertical: 5,
    marginRight: 10,
    color: "#34495e",
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
    backgroundColor: "#34495e",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  socialButtonsTitleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  socialButtonsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#34495e",
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 200,
    marginBottom: 30
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#34495e",
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginRight: 2,
  },
  socialButton2: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginLeft: 10,
    marginRight: 20

  },
  instagramButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -75,
    marginLeft: -45,
    marginBottom: 20

    
  },
  instagramButton: {
    backgroundColor: "#d35400",
    borderRadius: 100,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  instagramButtonIcon: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  buttonIcon: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  multilineInput: {
    height: 100,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#2c3e50",
    padding: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "black",
    marginBottom: 10,
  },
  profileLabel: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    margin: 15,
    borderRadius: 10,
    padding: 20,
  },
  sectionWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    marginRight: 15,
    marginLeft: 15
  },
  sectionContainer: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    marginRight: -15,
    marginLeft: -15
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 10,
  },
  moreButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trashButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  confirmRemoveButton: {
    marginTop: 5,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-end",
  },
  confirmRemoveButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  editableBoxContainer: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  squareBox: {
    width: 150,
    height: 150,
    borderColor: "#34495e",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    position: "relative",
    padding: 10,
    backgroundColor: '#ecf0f1'
  },
  newSquareBox: {
    width: 150,
    height: 150,
    borderColor: "#34495e",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "black",
    textAlign: "center",
    paddingHorizontal: 10,
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  itemTextInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
    textAlign: "center",
    paddingHorizontal: 10,
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  newItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  newItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#34495e",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: "#34495e",
  },
  addButton: {
    backgroundColor: "#34495e",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addSectionButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addSectionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  boxLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  sectionTitleContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  horizontalScrollView: {
    flexDirection: "row",
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 5,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  uploadImageButton: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  uploadImageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#34495e",
    marginVertical: 20,
  },
});

export default ProfileScreen;
