import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Image } from "react-native";


import HomeScreen from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import ShowcaseScreen from "./pages/Showcase";
import BookmarksScreen from "./pages/Bookmarks";
import ProfileScreen from "./pages/Profile";

<<<<<<< HEAD

=======
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
>>>>>>> a0353ce6ea1ca15e8c9d0b5fb303e4cbcc4bbf27

import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "./firebase/config";






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
<<<<<<< HEAD
 return (
   <NavigationContainer>
     <Tab.Navigator>
       <Tab.Screen
         name="Home"
         component={HomeScreen}
         options={{
           headerTitle: () => (
             <CustomHeaderTitle
               title="Home"
               imagePath={require("./assets/scholar.png")}
             />
           ),
         }}
       />
       <Tab.Screen
         name="Bookmarks"
         component={BookmarksScreen}
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
         component={ShowcaseScreen}
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
     </Tab.Navigator>
   </NavigationContainer>
 );
}



=======
  const [initializing, setInitializing] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  // Handle user state changes
  const onAuthStateChangedHandler = (user) => {
   console.log("user", user?.uid);
    setUserLoggedIn(user);
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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconSize = { width: 30, height: 30 }; // Default size

            switch (route.name) {
              case "Home":
                iconName = HomeIcon;
                iconSize = { width: 25, height: 25 }; // Custom size for Home icon
                break;
              case "Bookmarks":
                iconName = BookmarksIcon;
                iconSize = { width: 17, height: 25 }; // Custom size for Bookmarks icon
                break;
              case "Showcase":
                iconName = ShowcaseIcon;
                iconSize = { width: 30, height: 30 };
                break;
              case "Settings":
                iconName = SettingsIcon;
                iconSize = { width: 25, height: 25 };
                break;
              case "Profile":
                iconName = ProfileIcon;
                iconSize = { width: 27, height: 25 }; // Custom size for Profile icon
                break;
            }
            // Return the icon with the specified size
            return <Image source={iconName} resizeMode="contain" style={iconSize} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            height: 65, // Increased height
            backgroundColor: "#F7B500",
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,

          },
          tabBarLabelStyle: {
            fontSize: 12, // Adjust label font size as needed
            marginBottom: 0,
            fontWidth: "bold"
          },
          tabBarIconStyle: {
            flexGrow: 1,
            justifyContent: "center",
          },
        })}
      >
        {
          userLoggedIn ? (
            <>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Home"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Bookmarks"
                component={BookmarksScreen}
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
                component={ShowcaseScreen}
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
          ) :
            <>
              <Tab.Screen
                name="Welcomer"
                component={WelcomeScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Welcome"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }} />
              <Tab.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerTitle: () => (
                    <CustomHeaderTitle
                      title="Login"
                      imagePath={require("./assets/scholar.png")}
                    />
                  ),
                }} />
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
                }} />
            </>

        }

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    backgroundColor: "F7B500",
  },
  icon: {
    width: 20,
    height: 20,
  },
  // ... other styles you might need
});
>>>>>>> a0353ce6ea1ca15e8c9d0b5fb303e4cbcc4bbf27
