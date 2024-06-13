import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";

import HomeScreen from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import ShowcaseScreen from "./pages/Showcase";
import BookmarksScreen from "./pages/Bookmarks";
import ProfileScreen from "./pages/Profile";

// Auth pages
import WelcomeScreen from "./pages/Welcome";
import LoginScreen from "./pages/Login";
import RegisterScreen from "./pages/Register";

// Import icons
import HomeIcon from "./assets/homeicon.png";
import BookmarksIcon from "./assets/bookmarkicon.png";
import ShowcaseIcon from "./assets/showcaseicon.png";
import SettingsIcon from "./assets/settingsicon.png";
import ProfileIcon from "./assets/profileicon.png";

import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "./firebase/config";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

if (typeof localStorage === 'undefined') {
  global.localStorage = {
    storage: {},
    setItem: function (key, value) {
      this.storage[key] = value;
    },
    getItem: function (key) {
      return this.storage[key] || null;
    },
    removeItem: function (key) {
      delete this.storage[key];
    },
    clear: function () {
      this.storage = {};
    }
  };
}
if (typeof global.location === 'undefined') {
  global.location = {
    href: '',
    // Add other properties and methods as needed
  };
}

const Tab = createBottomTabNavigator();

function CustomHeaderTitle({ title, imagePath }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 180,
        marginBottom: 20,
      }}
    >
      <Image
        source={imagePath}
        style={{ width: 75, height: 75, marginLeft: -20, marginBottom: 1 }}
      />
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>{title}</Text>
    </View>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userMetadata, setUserMetadata] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Enable layout animation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Handle user state changes
  const onAuthStateChangedHandler = (user) => {
    console.log("user", user?.uid);
    setUserMetadata(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 21, backgroundColor: "transparent" }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case "Welcome":
                  iconName = "tab";
                  break;
                case "Login":
                  iconName = "login";
                  break;
                case "Register":
                  iconName = "account-box";
                  break;
                case "Home":
                  iconName = "home";
                  break;
                case "Bookmarks":
                  iconName = "bookmark";
                  break;
                case "Showcase":
                  iconName = "dashboard";
                  break;
                case "Settings":
                  iconName = "settings";
                  break;
                case "Profile":
                  iconName = "person";
                  break;
              }
              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 12, textAlign: 'center' }}>
                {route.name}
              </Text>
            ),
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "black",
            tabBarStyle: {
              height: isExpanded ? 65 : 0, // Use state to determine height
              backgroundColor: "white", // Make tab bar background transparent
              borderTopWidth: 0, // Remove border top if present
              elevation: 0, // Remove elevation shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              
            },
            tabBarIconStyle: {
              marginTop: 15,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 10,
              fontWeight: "900",
            },
            headerStyle: {
              height: 65,
              backgroundColor: "#F9EFDF", // Make header background transparent
              borderBottomWidth: 0, // Remove border bottom if present
              elevation: 0, // Remove elevation shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
          })}
        >
          {userMetadata ? (
            <>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Home    "
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Bookmarks"
                children={() => <BookmarksScreen userMetadata={userMetadata} />}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Bookmarks"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Showcase"
                children={() => <ShowcaseScreen userMetadata={userMetadata} />}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Showcase"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                children={() => <SettingsScreen userMetadata={userMetadata} />}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Settings"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Profile"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Tab.Screen
                name="Welcome"
                component={WelcomeScreen}
              />
              <Tab.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Login     "
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Register"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
      <TouchableOpacity style={[styles.arrowContainer, { bottom: isExpanded ? 55 : -10 }]} onPress={toggleExpand}>
        <MaterialIcons name={isExpanded ? "expand-more" : "expand-less"} size={30} color="black" />
        <Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  divider1: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginBottom: -70,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensure it fills the tab bar height
    paddingHorizontal: 10, // Optional: depending on your design
  },
  verticalDivider: {
    borderRightWidth: 1,
    borderColor: 'gray', // Choose a color that matches your design
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    backgroundColor: "#F7B500",
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: -50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -15 }],
    alignItems: 'center',
  },
});

