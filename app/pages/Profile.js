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
import { db } from "../firebase/config";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditableBox = ({ label, category, data, updateUserData }) => {
  const [items, setItems] = useState(data || []);
  const [isEditable, setIsEditable] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleBlur = (index, text) => {
    const updatedItems = items.map((item, i) => (i === index ? { text } : item));
    setItems(updatedItems);
    updateUserData(label, category, updatedItems);
  };

  const handleEdit = () => {
    setIsEditable(!isEditable);
  };

  const addItem = () => {
    const updatedItems = [...items, { text: newItem }];
    setItems(updatedItems);
    updateUserData(label, category, updatedItems);
    setNewItem("");
  };

  return (
    <View style={styles.editableBox}>
      <Text style={styles.label}>{label}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TextInput
            style={[
              styles.itemText,
              item.text.includes("Example:") && { color: "#DFD0B8" },
            ]}
            value={item.text}
            editable={isEditable}
            onFocus={() => {
              if (item.text.includes("Example:")) {
                const updatedItems = items.map((item, i) =>
                  i === index ? { text: "" } : item
                );
                setItems(updatedItems);
              }
            }}
            onChangeText={(text) => {
              const updatedItems = items.map((item, i) =>
                i === index ? { text } : item
              );
              setItems(updatedItems);
            }}
            onBlur={() => handleBlur(index, item.text)}
          />
        </View>
      ))}
      {isEditable && (
        <View style={styles.newItemContainer}>
          <TextInput
            style={styles.newItemInput}
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add new item"
            placeholderTextColor="#DFD0B8"
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Icon name="add" size={20} color="#EEEEEE" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>
          {isEditable ? <Icon name="save" size={20} color="#EEEEEE" /> : <Icon name="edit" size={20} color="#EEEEEE" />}
        </Text>
      </TouchableOpacity>
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
  const [showRemoveButtons, setShowRemoveButtons] = useState({});

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
        : `https://twitter.com/intent/tweet?text=${encodeURI(payload)}`;

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

  const toggleRemoveButton = (index) => {
    setShowRemoveButtons((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const removeSection = (index) => {
    Alert.alert(
      "Remove Section",
      "Are you sure you want to remove this section?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            const updatedSections = sections.filter((_, i) => i !== index);
            setSections(updatedSections);
            setShowRemoveButtons((prevState) => ({
              ...prevState,
              [index]: false,
            }));
          },
          style: "destructive",
        },
      ]
    );
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

  const icons = {
    Achievements: "star",
    Extracurricular: "emoji-events",
    Academics: "school",
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: "#DFD0B8" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={{ flex: 1 }}>
          

          <View style={styles.headerContainer}>
            {sections.map((section, index) => (
              <View key={index} style={styles.iconContainer}>
                <Icon name={icons[section]} size={40} color="#153448" />
                <Text style={styles.iconLabel}>{section}</Text>
              </View>
            ))}
          </View>
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

          <View style={styles.infoContainer}>
            {sections.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeader}>{section}</Text>
                  <TouchableOpacity onPress={() => toggleRemoveButton(index)} style={styles.moreButton}>
                    <Icon name="more-vert" size={20} color="#3C5B6F" />
                  </TouchableOpacity>
                </View>
                {showRemoveButtons[index] && (
                  <TouchableOpacity onPress={() => removeSection(index)} style={styles.confirmRemoveButton}>
                    <Text style={styles.confirmRemoveButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
                <EditableBox
                  label={`Add ${section}`}
                  category={section.toLowerCase()}
                  data={userData?.[section.toLowerCase()]?.custom || prefilledData[section.toLowerCase()]}
                  updateUserData={updateUserData}
                />
              </View>
            ))}
            <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
              <Text style={styles.addSectionButtonText}>+ Add New Section</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: "#DFD0B8",
    marginBottom: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3C5B6F",
    paddingVertical: 5,
    marginRight: 10,
    color: "#DFD0B8",
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
    backgroundColor: "#153448",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#DFD0B8",
    fontSize: 12,
  },
  socialButtonsTitleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  socialButtonsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#3C5B6F",
    marginLeft: -250,
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "left",
    marginTop: 10,
    marginLeft: 20
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#3C5B6F",
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
    marginRight: 1,
  },
  socialButton2: {
    flexDirection: "row",
    backgroundColor: "#153448",
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
    marginLeft: 15,
  },
  buttonIcon: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  multilineInput: {
    height: 100,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#DFD0B8",
    padding: 30,
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
    color: "#DFD0B8",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#DFD0B8",
  },
  infoContainer: {
    backgroundColor: "#DFD0B8",
    margin: 15,
    borderRadius: 10,
    padding: 20,
  },
  sectionContainer: {
    backgroundColor: "#948979",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    marginLeft: -15,
    marginRight: -15,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DFD0B8",
    marginBottom: 10,
  },
  moreButton: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  confirmRemoveButton: {
    marginTop: 5,
    backgroundColor: "tomato",
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
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#948979",
  },
  removeButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  newItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  newItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3C5B6F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    marginRight: 10,
    color: "#DFD0B8",
  },
  addButton: {
    backgroundColor: "#153448",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addSectionButton: {
    backgroundColor: "#153448",
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
    color: "#DFD0B8",
    marginBottom: 5,
  },
  sectionTitleContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DFD0B8",
  },
});

export default ProfileScreen;
