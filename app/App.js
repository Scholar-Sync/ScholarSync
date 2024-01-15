import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import ShowcaseScreen from "./pages/Showcase";
import BookmarksScreen from "./pages/Bookmarks";
import ProfileScreen from "./pages/Profile";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Showcase" component={ShowcaseScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
