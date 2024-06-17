import React from "react";
import { View, Text, } from "react-native";
import { useTheme } from "../utils/ThemeProvider";


const Loading = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View style={theme.container}>
      <Text>Loading...</Text>
    </View>
  );
};

export default Loading;
