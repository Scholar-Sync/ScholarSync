import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

const SettingsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Change Username: EthanScholar1</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Gmail: ************</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Password: ********</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.verifyText}>VERIFY EMAIL?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.settingText}>Dark Mode/Light Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.settingText}>Report Bug:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            // Implement functionality as needed
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.settingText}>Report Problem:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type here..."
            // Implement functionality as needed
          />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Logging out will bring you back to the Login page
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  verifyText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  inputContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 5,
    padding: 10,
  },
  logoutButton: {
    alignItems: "center",
    padding: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  footer: {
    alignItems: "center",
    padding: 20,
  },
  footerText: {
    fontSize: 16,
    color: "gray",
  },
});

export default SettingsScreen;
