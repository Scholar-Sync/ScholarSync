import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/config";
import { useTheme } from "../utils/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize fadeAnim with useRef

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("User data fetched:", data);
          setUserData(data);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (userData.isPrivateMode) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.text }}>
          This profile is private.
        </Text>
      </View>
    );
  }

  const renderSection = (label, data) => {
    if (!data) {
      return null;
    }

    if (Array.isArray(data)) {
      return (
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: theme.colors.background_b },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
          {data.map((item, index) => (
            <Text
              key={index}
              style={[styles.itemText, { color: theme.colors.text }]}
            >
              {item.text || item}
            </Text>
          ))}
        </View>
      );
    } else if (typeof data === "object") {
      return (
        <View
          style={[
            styles.sectionContainer,
            { backgroundColor: theme.colors.background_b },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
          {Object.entries(data).map(([key, value], index) => (
            <Text
              key={index}
              style={[styles.itemText, { color: theme.colors.text }]}
            >
              {`${key}: ${value}`}
            </Text>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
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
          <Image
            source={
              userData.profileImage
                ? { uri: userData.profileImage }
                : require("../assets/pfp1.png")
            }
            style={styles.profileImage}
          />
          <View style={styles.profileInfoContainer}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {userData.basic?.firstName}
            </Text>
            <Text style={[styles.userTitle, { color: theme.colors.text }]}>
              {userData.basic?.school}
            </Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <Text style={[styles.additionalInfo, { color: theme.colors.text }]}>
              Grade: {userData.basic?.grade}
            </Text>
            <Text style={[styles.additionalInfo, { color: theme.colors.text }]}>
              Email: {userData.basic?.email}
            </Text>
            <Text style={[styles.additionalInfo, { color: theme.colors.text }]}>
              Phone: {userData.basic?.phoneNumber}
            </Text>
          </View>
        </View>
        {renderSection(
          "Achievements",
          userData.achievements?.custom || userData.achievements
        )}
        {renderSection(
          "Extracurriculars",
          userData.extracurricular?.custom || userData.extracurricular
        )}
        {renderSection(
          "Academics",
          userData.academics?.custom || userData.academics
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
    marginTop: -130,
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

  sectionContainer: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default UserProfileScreen;
