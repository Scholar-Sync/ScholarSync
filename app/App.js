import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Image } from "react-native";

import HomeScreen from "./pages/Home";
import SettingsScreen from "./pages/Settings";
import ShowcaseScreen from "./pages/Showcase";
import BookmarksScreen from "./pages/Bookmarks";
import ProfileScreen from "./pages/Profile";

const Tab = createBottomTabNavigator();

function CustomHeaderTitle({ title, imagePath }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={imagePath}
        style={{ width: 75, height: 75, marginRight: 8 }} // Increased size
      />
      <Text style={{ fontWeight: "bold", fontSize: 30 }}>{title}</Text>{" "}
    </View>
  );
}

export default function App() {
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
