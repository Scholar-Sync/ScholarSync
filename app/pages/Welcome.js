import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import StyledButton from "../components/StyledButton"; // Adjust the import path as needed
import { theme } from "../utils/theme"; // Adjust the import path as needed
import Page1 from "../components/Page1";

const quotes = [
  {
    text: "Genius is one percent inspiration and ninety-nine percent perspiration.",
    author: "Thomas Edison",
  },
  {
    text: "You can observe a lot just by watching.",
    author: "Yogi Berra",
  },
  {
    text: "A house divided against itself cannot stand.",
    author: "Abraham Lincoln",
  },
  {
    text: "Difficulties increase the nearer we get to the goal.",
    author: "Johann Wolfgang von Goethe",
  },
  {
    text: "Fate is in your hands and no one elses",
    author: "Byron Pulsifer",
  },
  {
    text: "Be the chief but never the lord.",
    author: "Lao Tzu",
  },
  {
    text: "Nothing happens unless first we dream.",
    author: "Carl Sandburg",
  },
  {
    text: "Well begun is half done.",
    author: "Aristotle",
  },
  {
    text: "Life is a learning experience, only if you learn.",
    author: "Yogi Berra",
  },
  {
    text: "Self-complacency is fatal to progress.",
    author: "Margaret Sangster",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "What you give is what you get.",
    author: "Byron Pulsifer",
  },
  {
    text: "We can only learn to love by loving.",
    author: "Iris Murdoch",
  },
  {
    text: "Life is change. Growth is optional. Choose wisely.",
    author: "Karen Clark",
  },
  {
    text: "You'll see it when you believe it.",
    author: "Wayne Dyer",
  },
  {
    text: "Today is the tomorrow we worried about yesterday.",
    author: "Dale Carnegie",
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isQuoteUpdated, setIsQuoteUpdated] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current; // Use for quote animation
  const pageOpacity = useRef(new Animated.Value(1)).current; // Initialized to 1 for initial fade-in

  useEffect(() => {
    // Function to update the quote
    const updateQuote = () => {
      // Fade out animation for quote
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Select a new quote
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
        setIsQuoteUpdated((prevState) => !prevState); // Toggle to trigger useEffect
      });
    };

    // Immediately display a quote when the component mounts
    updateQuote(); // Call updateQuote here to set the initial quote

    // Then, continue with setting up the interval
    const interval = setInterval(updateQuote, 4000); // Update the quote every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fade in animation for quote
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [isQuoteUpdated]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset and fade in page every time it gains focus
      pageOpacity.setValue(0); // Reset opacity to 0 for fade in
      Animated.timing(pageOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // Optional: Clean-up function if you want to fade out when leaving the page
      // Note: This might not be visible depending on navigation animation
      return () => {
        Animated.timing(pageOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start();
      };
    }, [pageOpacity])
  );

  const handleRegisterPress = () => {
    console.log("Register button pressed");
    navigation.navigate("Register");
  };

  const handleLoginPress = () => {
    console.log("Login button pressed");
    navigation.navigate("Login");
  };

  return (
    <Animated.View style={[styles.container, { opacity: pageOpacity }]}>
      <Page1>
        <View style={styles.background}>
          <View style={styles.divider1} />
          <Image
            source={require("../assets/scholar.png")}
            style={styles.topImage}
          />
          <View style={styles.quoteWrapper}>
            <Animated.View style={[styles.quoteContainer, { opacity }]}>
              {quote.text ? (
                <>
                  <Text style={styles.quoteText}>“{quote.text}”</Text>
                  <Text style={styles.authorText}>- {quote.author}</Text>
                </>
              ) : (
                <Text style={styles.quoteText}>Loading...</Text>
              )}
            </Animated.View>
          </View>
          <View style={styles.buttonsContainer}>
            <StyledButton title="Login" onPress={handleLoginPress} />
            <StyledButton title="Register" onPress={handleRegisterPress} />
          </View>

          <View style={styles.divider} />
        </View>
      </Page1>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  divider1: {
    height: 1,
    width: "70%",
    backgroundColor: "black",
    marginBottom: -70,
  },
  divider: {
    height: 1,
    width: "70%",
    backgroundColor: "black",
    marginVertical: 5,
  },
  topImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",

    marginTop: 175,
    marginBottom: -200,
  },
  quoteWrapper: {
    position: "absolute",
    bottom: 440,
    width: 300,
    paddingHorizontal: 40,
    marginLeft: -50,
  },

  quoteText: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
    color: theme.colors.selected,
    fontWeight: "bold",

  },
  authorText: {
    fontSize: 10,
    textAlign: "center",
    color: theme.colors.text,
  },
  buttonsContainer: {
    alignItems: "center",
    marginBottom: -100,
    marginTop: 300,
    height: 500,
  },
});
