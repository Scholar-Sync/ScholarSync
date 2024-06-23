import React from "react";
import { useTheme } from "../utils/ThemeProvider"; // Ensure correct path
import HomeScreen from "../pages/Home";
import SettingsScreen from "../pages/Settings";
import ShowcaseScreen from "../pages/Showcase";
import BookmarksScreen from "../pages/Bookmarks";
import ProfileScreen from "../pages/Profile";
import UserProfileScreen from "../pages/UserProfileScreen"; // Import User Profile Screen
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "./Header";

// Auth pages
import WelcomeScreen from "../pages/Welcome";
import LoginScreen from "../pages/Login";
import RegisterScreen from "../pages/Register";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack"; // Import stack navigator

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); // Initialize stack navigator

const DrawerNavigator = ({ userMetadata }) => {
  const { theme } = useTheme();

  const screenOptions = ({ route }) => ({
    header: () => <Header title={route.name} />,
    headerStyle: {
      backgroundColor: theme.colors.background, // Header background color
    },
    headerTintColor: theme.colors.text, // Header text color
    drawerStyle: {
      backgroundColor: theme.colors.background_b, // Drawer background color
    },
    drawerPosition: "right",
    drawerActiveTintColor: theme.colors.selected, // Active drawer item color
    drawerInactiveTintColor: theme.colors.text, // Inactive drawer items color
  });

  return (
    <Drawer.Navigator screenOptions={screenOptions}>
      {userMetadata === null ? (
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
      ) : (
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
      )}
    </Drawer.Navigator>
  );
};

const Nav = ({ userMetadata }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        options={{ headerShown: false }}
        children={() => <DrawerNavigator userMetadata={userMetadata} />}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={({ navigation }) => ({
          headerTitle: "User Profile",
          headerLeft: () => (
            <MaterialIcons
              name="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default Nav;
