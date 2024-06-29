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
  Button,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTheme } from "../utils/ThemeProvider";
import { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { PDFDocument, rgb } from "pdf-lib";
import { sendEmail } from "../utils/emailjs";
import base64 from "base-64";

const EditableBox = ({ label, category, data, updateUserData }) => {
  const [items, setItems] = useState(Array.isArray(data) ? data : []);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    console.log("EditableBox data updated:", data);
    setItems(Array.isArray(data) ? data : []);
  }, [data]);

  const handleSave = (index, text) => {
    console.log("Saving item at index:", index, "with text:", text);
    const updatedItems = items.map((item, i) =>
      i === index ? { text, isEditable: false } : item
    );
    setItems(updatedItems);
    updateUserData(category, updatedItems);
  };

  const handleEdit = (index) => {
    console.log("Editing item at index:", index);
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, isEditable: !item.isEditable } : item
    );
    setItems(updatedItems);
    setDropdownIndex(null);
  };

  const handleRemove = (index) => {
    console.log("Removing item at index:", index);
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    updateUserData(category, updatedItems);
  };

  const addItem = () => {
    console.log("Adding new item");
    const updatedItems = [...items, { text: newItemText, isEditable: true }];
    setItems(updatedItems);
    setNewItemText("");
  };

  const handleNewItemSave = (text) => {
    if (text) {
      const updatedItems = [...items, { text, isEditable: false }];
      setItems(updatedItems);
      updateUserData(category, updatedItems);
    }
    setNewItemText("");
  };

  return (
    <View
      style={[
        styles.editableBox,
        { backgroundColor: theme.colors.background_b },
      ]}
    >
      <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
        {label}
      </Text>
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
            <Text style={[styles.itemText, { color: theme.colors.text }]}>
              {item.text}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              setDropdownIndex(dropdownIndex === index ? null : index)
            }
            style={styles.moreButton}
          >
            <Icon name="more-vert" size={20} color={theme.colors.icon} />
          </TouchableOpacity>
          {dropdownIndex === index && (
            <View
              style={[
                styles.dropdownMenu,
                { backgroundColor: theme.colors.selected },
              ]}
            >
              {item.isEditable ? (
                <TouchableOpacity
                  onPress={() => handleSave(index, item.text)}
                  style={styles.dropdownItem}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: theme.colors.text },
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEdit(index)}
                  style={styles.dropdownItem}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: theme.colors.text },
                    ]}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                style={styles.dropdownItem}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: theme.colors.text },
                  ]}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      <TextInput
        style={[
          styles.newItemTextInput,
          {
            color: theme.colors.text,
            borderBottomColor: theme.colors.primary,
          },
        ]}
        placeholder="Add new item..."
        placeholderTextColor={theme.colors.placeholder}
        value={newItemText}
        onChangeText={setNewItemText}
        onBlur={() => handleNewItemSave(newItemText)}
      />
    </View>
  );
};

const ProfileScreen = ({ userMetadata }) => {
  const layout = useWindowDimensions();
  const [userData, setUserData] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sections, setSections] = useState([
    "Achievements",
    "Extracurricular",
    "Academics",
  ]);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { theme } = useTheme();

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
  const [contentHeight, setContentHeight] = useState(0);
  const contentViewRef = useRef(null);
  const scrollViewRef = useRef();
  const [status, setStatus] = useState("");
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
          console.log("Retrieved user data:", data);
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
          console.log("No user data found");
          setUserData({});
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, [userMetadata]);

  const updateUserData = async (category, value) => {
    if (!userMetadata) {
      console.error("No user metadata available");
      return;
    }
    const uid = userMetadata?.uid;
    const userDBRef = doc(db, "users", uid);
    const newUserData = { ...userData, [category]: value };
    try {
      await setDoc(userDBRef, newUserData, { merge: true });
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
        alert(
          `${socialType.charAt(0).toUpperCase() + socialType.slice(1)} Opened`
        );
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
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    console.log("Image picker result:", result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Image picked:", uri);
      setImageUri(uri);
      setProfileImage(uri);
      uploadImage(uri);
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
            updateUserData("profileImage", downloadURL);
            setUploading(false);
            Alert.alert("Success", "Profile picture updated successfully!");
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setUploading(false);
            Alert.alert(
              "Error",
              "Failed to update profile picture. Please try again."
            );
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setUploading(false);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      });
  };

  const handleSaveName = () => {
    updateUserData("basic", { ...userData.basic, firstName: name });
    setIsNameEditable(false);
  };

  const handleSaveTitle = () => {
    updateUserData("basic", { ...userData.basic, school: title });
    setIsTitleEditable(false);
  };

  const handleSaveAge = () => {
    updateUserData("basic", { ...userData.basic, email: age });
    setIsAgeEditable(false);
  };

  const handleSavePhoneNumber = () => {
    updateUserData("basic", { ...userData.basic, phoneNumber: phoneNumber });
    setIsPhoneNumberEditable(false);
  };

  const handleSaveInterests = () => {
    updateUserData("basic", { ...userData.basic, interests: interests });
    setIsInterestsEditable(false);
  };

  const createPDF = async () => {
    if (!PDF || !PDF.create) {
      console.error("PDF or PDF.create is not available");
      return;
    }
    try {
      let options = {
        html: `<h1>User Profile</h1><p>Name: ${userData?.basic?.firstName}</p>`,
        fileName: "UserProfile",
        directory: "Documents",
      };
      const file = await PDF.create(options);
      Alert.alert("PDF Generated", `Find PDF at ${file.filePath}`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };
  const captureAndSendEmail = async () => {
    try {
      // Capture the view as an image
      const uri = await captureRef(contentViewRef.current, {
        format: "jpg",
        quality: 0.8,
        height: contentHeight,
      });

      // Read the image file directly into a base64 string
      const imageBytes = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(`Captured image size: ${imageBytes.length / 1024} KB`);

      // Create a PDF doc
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);

      // Embed the JPEG image bytes into the PDF
      const jpgImage = await pdfDoc.embedJpg(imageBytes);
      const { width, height } = jpgImage.scale(0.4);
      console.log(`Image dimensions: ${width}x${height}`);

      // Draw the image onto the page
      page.drawImage(jpgImage, {
        x: (page.getWidth() - width) / 2, // center
        y: page.getHeight() - height, // start at top
        width: width,
        height: height,
      });
      console.log("PDF created");

      // Serialize the document to uint8 array
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = base64.encode(
        String.fromCharCode(...new Uint8Array(pdfBytes))
      );
      console.log(`Serialized PDF size: ${pdfBase64.length / 1024} KB`);

      // email to emailjs
      const templateParams = {
        to_name: "scholarsyncrra@gmail.com",
        to_email: "scholarsyncrra@gmail.com",
        from_name: "scholar sync app",
        message: "Please find the attached PDF.",
        variable_tsuwrcg: pdfBase64,
      };

      sendEmail(
        "service_r9nrk6w",
        "template_bpf39fc",
        templateParams,
        "2OfAIsT81cPeFczkl"
      ).then(
        (response) => {
          setStatus("PDF Sent Successfully");
          console.log("SUCCESS!", response.status, response.text);
          setTimeout(() => {
            setStatus("");
          }, 3000);
        },
        (error) => {
          setStatus("Failed to send the PDF. Please try again.");
          console.log("FAILED...", error);
          setTimeout(() => {
            setStatus("");
          }, 3000);
        }
      );
    } catch (error) {
      console.error("Error creating or sending PDF: ", error);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView
          style={{ flex: 1 }}
          ref={scrollViewRef}
          onContentSizeChange={(contentWidth, contentHeight) => {
            setContentHeight(contentHeight);
          }}
        >
          <View ref={contentViewRef}>
            <View
              style={[
                styles.coverContainer,
                { backgroundColor: theme.colors.selected },
              ]}
            />
            <View
              style={[
                styles.headerContainer,
                { backgroundColor: theme.colors.background_b },
              ]}
            >
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
                    <Text
                      style={[styles.userName, { color: theme.colors.text }]}
                    >
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
                    <Text
                      style={[styles.userTitle, { color: theme.colors.text }]}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                )}
                {uploading && (
                  <Text style={{ color: theme.colors.text }}>Uploading...</Text>
                )}
              </View>
              <View style={styles.additionalInfoContainer}>
                {isAgeEditable ? (
                  <TextInput
                    style={[
                      styles.additionalInfo,
                      { color: theme.colors.text },
                    ]}
                    value={age}
                    onChangeText={setAge}
                    onBlur={handleSaveAge}
                    keyboardType="numeric"
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity onPress={() => setIsAgeEditable(true)}>
                    <Text
                      style={[
                        styles.additionalInfo,
                        { color: theme.colors.text },
                      ]}
                    >
                      Email: {age}
                    </Text>
                  </TouchableOpacity>
                )}
                {isPhoneNumberEditable ? (
                  <TextInput
                    style={[
                      styles.additionalInfo,
                      { color: theme.colors.text },
                    ]}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    onBlur={handleSavePhoneNumber}
                    keyboardType="phone-pad"
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsPhoneNumberEditable(true)}
                  >
                    <Text
                      style={[
                        styles.additionalInfo,
                        { color: theme.colors.text },
                      ]}
                    >
                      Phone: {phoneNumber}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {sections.map((section, index) => (
              <View key={index} style={styles.sectionWrapper}>
                <View
                  style={[
                    styles.sectionContainer,
                    { backgroundColor: theme.colors.background_b },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => removeSection(index)}
                    style={styles.trashButton}
                  >
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

            <TouchableOpacity
              onPress={addSection}
              style={[
                styles.addSectionButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.addSectionButtonText,
                  { color: theme.colors.text_b },
                ]}
              >
                + Add New Section
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.socialButtonsContainer,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.socialButton,
                  { backgroundColor: " theme.colors.primary" },
                ]}
                onPress={() => shareToSocial("reddit")}
              >
                <Image
                  source={require("../assets/redditlogo.png")}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.socialButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => shareToSocial("instagram")}
              >
                <Image
                  source={require("../assets/instagram.png")}
                  style={styles.instagramButtonIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.socialButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => shareToSocial("twitter")}
              >
                <Image
                  source={require("../assets/twitterlogo.png")}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { backgroundColor: "transparent" },
                ]}
                onPress={captureAndSendEmail}
              >
                <Image
                  source={require("../assets/gmail.webp")}
                  style={styles.pdfIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: "center", color: "green" }}>
              {status}
            </Text>
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
    marginTop: 15,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: -105,
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
    height: 30,
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
    borderRadius: 20,
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
    marginBottom: -15,
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
  newItemTextInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 5,
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
    marginTop: -35,
    paddingTop: 70,
    marginBottom: 50,
    paddingVertical: 10,
  },
  socialButton: {
    flexDirection: "row",
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  redditIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  buttonIcon: {
    width: 165,
    height: 165,
    resizeMode: "contain",
  },
  instagramButtonIcon: {
    width: 85,
    height: 85,
    resizeMode: "contain",
  },
  pdfIcon: {
    width: 60,
    height: 60,
    marginRight: 0,
  },
});

export default ProfileScreen;
