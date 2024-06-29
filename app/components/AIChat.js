import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "../utils/ThemeProvider";

const AIChat = ({ initialPrompt }) => {
  const [messages, setMessages] = useState([
    { text: initialPrompt, isUser: false },
  ]);
  const [input, setInput] = useState("");
  const { theme } = useTheme();

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      try {
        const response = await fetch("http://your-ip-address:3000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        });
        const data = await response.json();
        setMessages([
          ...messages,
          { text: input, isUser: true },
          { text: data.reply, isUser: false },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...messages,
          { text: input, isUser: true },
          { text: "Sorry, something went wrong.", isUser: false },
        ]);
      }
      setInput("");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.chatBox}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.isUser ? styles.userMessage : styles.botMessage}
          >
            <Text style={[styles.messageText, { color: theme.colors.text }]}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.text,
          },
        ]}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message"
        placeholderTextColor={theme.colors.placeholder}
      />
      <Button title="Send" onPress={sendMessage} color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatBox: {
    flex: 1,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1f7c4",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AIChat;
