import React from 'react';
import { useTheme } from '../utils/ThemeProvider';
import HomeScreen from '../pages/Home';
import SettingsScreen from '../pages/Settings';
import ShowcaseScreen from '../pages/Showcase';
import BookmarksScreen from '../pages/Bookmarks';
import ProfileScreen from '../pages/Profile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './Header'; 

// Auth pages
import WelcomeScreen from '../pages/Welcome';
import LoginScreen from '../pages/Login';
import RegisterScreen from '../pages/Register';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const Nav = ({ userMetadata }) => {
  const { theme } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ route }) => <Header title={route.name} />, 
        headerStyle: {
          backgroundColor: theme.colors.primary, 
        },
        headerTintColor: theme.colors.text, 
        drawerStyle: {
          backgroundColor: theme.colors.background_b,
        },
        drawerPosition: 'right', 
        drawerActiveTintColor: theme.colors.selected,
        drawerInactiveTintColor: theme.colors.text,
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
                <MaterialIcons
                  name="bookmark"
                  size={size}
                  color={theme.color}
                />
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
                <MaterialIcons
                  name="account-box"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default Nav;