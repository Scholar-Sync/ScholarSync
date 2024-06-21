import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {  Platform, UIManager } from "react-native";
import Loading from "./components/Loading";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Nav from "./components/Nav";
import { ThemeProvider } from "./utils/ThemeProvider";
import { theme } from "./utils/theme";

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [userMetadata, setUserMetadata] = useState(null);
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  //user logging in or signing up
  const onAuthStateChangedHandler = (user) => {
    console.log("user", user?.uid);
    setUserMetadata(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  //notifies when user logs out or screen goes out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return unsubscribe;
  }, []);
  //if the page is still loading "loading..." will appear
  if (initializing) {
    return (
      <ThemeProvider>
        <Loading />
      </ThemeProvider>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <ThemeProvider>
        <NavigationContainer>
          <Nav userMetadata={userMetadata} />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
};


export default App;