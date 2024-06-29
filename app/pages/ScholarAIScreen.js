import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../utils/ThemeProvider";
import AIChat from "../components/AIChat"; // Ensure the path is correct
import Icon from "react-native-vector-icons/MaterialIcons";

const ScholarAIScreen = () => {
  const { theme } = useTheme();
  const initialPrompt =
    "Hello! I'm ScholarAI, your academic assistant. How can I help you with resume building, college recommendations, or any other school-related queries today?";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          ScholarAI
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          Welcome to ScholarAI, your personalized academic assistant. Here you
          can find resources, tools, and support to enhance your learning
          experience.
        </Text>
      </View>
      <AIChat initialPrompt={initialPrompt} />
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.infoButton}>
          <Icon name="info" size={24} color={theme.colors.primary} />
          <Text
            style={[styles.infoButtonText, { color: theme.colors.primary }]}
          >
            How to Use ScholarAI
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScholarAIScreen;
