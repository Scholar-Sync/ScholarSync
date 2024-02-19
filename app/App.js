import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Image, StyleSheet } from "react-native";

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


// POLYFILLS TODO delete
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
    <SafeAreaView style={{ flex: 21, backgroundColor: "#F2C64E" }}>
      <NavigationContainer>
      <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      switch (route.name) {
        case "Welcome":
          iconName = "tab"
          break;
        case "Login":
          iconName = "login"
          break;
        case "Register":
          iconName = "account-box"
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
              const isLastIcon = route.name === "Profile"; // Assuming "Profile" is the last tab
              return (
                  <MaterialIcons name={iconName} size={size} color={color} />
                  
                 );
            },
        
            tabBarLabel: ({ focused, color }) => (
              // Adjusting here to include a custom label with a pseudo divider
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    height: "40%",
                    width: 3,
                    backgroundColor: color,
                    marginRight: 2,
                  }}
                />

                <Text style={{ color, fontSize: 12 }}>{route.name}</Text>
                {/* Adding a pseudo divider as a View element */}
                <View
                  style={{
                    height: "40%",
                    width: 3,
                    backgroundColor: color,
                    marginLeft: 2,
                  }}
                />
              </View>
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text style={{ color, fontSize: 12, textAlign: 'center' }}>
                {route.name}
              </Text>
            ),            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "black",
            tabBarStyle: {
              height: 65,
              backgroundColor: "#FFEAA9",
              borderTopStartRadius: 0,
              borderTopEndRadius: 0,
              // Shadow properties for iOS
              shadowColor: "#FFEAA9",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0,
              shadowRadius: 10,
              // Elevation for Android
              elevation: 8, // Adjust the elevation value as needed
              paddingBottom: 5, // Added padding at the bottom for extra space
            },
            tabBarIconStyle: {
              marginTop: 15, // Reduced marginTop to move icons up
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 10,
              fontWeight: "900", // Make the label text thicker
            },
            headerStyle: {
              backgroundColor: "#FFEAA9",
              borderBottomStartRadius: 0,
              borderBottomEndRadius: 0,
              // Shadow properties for iOS
              shadowColor: "#FFEAA9",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0,
              shadowRadius: 10,
              // Elevation for Android
              elevation: 8, // Adjust the elevation value as needed
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
                component={SettingsScreen}
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
                children={() => <ProfileScreen userMetadata={userMetadata} />}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Profile     "
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
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Welcome"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
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
  },
  // ... other styles you might need
});