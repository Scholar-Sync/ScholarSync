import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Platform, UIManager } from "react-native";

import HomeScreen from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import ShowcaseScreen from "./pages/Showcase";
import BookmarksScreen from "./pages/Bookmarks";
import ProfileScreen from "./pages/Profile";

// Auth pages
import WelcomeScreen from "./pages/Welcome";
import LoginScreen from "./pages/Login";
import RegisterScreen from "./pages/Register";

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

const Drawer = createDrawerNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userMetadata, setUserMetadata] = useState(null);

  // Enable layout animation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Handle user state changes
  const onAuthStateChangedHandler = (user) => {
    console.log('user', user?.uid);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerShown: true, // Show the header with the hamburger icon
            drawerStyle: {
              backgroundColor: '#DFD0B8',
            },
            drawerActiveTintColor: 'tomato',
            drawerInactiveTintColor: 'black',
          }}
        >
          {userMetadata ? (
            <>
              <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="home" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Bookmarks"
                children={() => <BookmarksScreen userMetadata={userMetadata} />}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="bookmark" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Showcase"
                children={() => <ShowcaseScreen userMetadata={userMetadata} />}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="dashboard" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Settings"
                children={() => <SettingsScreen userMetadata={userMetadata} />}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="settings" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Profile"
                children={() => <ProfileScreen userMetadata={userMetadata} />}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="person" size={size} color={color} />
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Drawer.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="tab" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="login" size={size} color={color} />
                  ),
                }}
              />
              <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="account-box" size={size} color={color} />
                  ),
                }}
              />
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  divider1: {
    height: 1,
    width: '70%',
    backgroundColor: 'black',
    marginBottom: -70,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  verticalDivider: {
    borderRightWidth: 1,
    borderColor: 'gray',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#F7B500',
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: -50,
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
