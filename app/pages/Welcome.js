import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

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
    }, [])
  );

  return (
    <Animated.View style={{ flex: 1, opacity: pageOpacity }}>
      <ImageBackground
        source={require("../assets/background1.png")}
        style={styles.background}
      >
        <View style={styles.divider1} />
        <Image
          source={require("../assets/scholar.png")}
          style={styles.topImage}
        />
        {/* Wrap the Animated.View in a View with fixed height */}
        <View style={styles.quoteWrapper}>
          <Animated.View style={[styles.quoteContainer, { opacity }]}>
            <Text style={styles.quoteText}>“{quote.text}”</Text>
            <Text style={styles.authorText}>- {quote.author}</Text>
          </Animated.View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // Distribute space evenly
    paddingVertical: 50, // Add padding to top and bottom
  },
  divider1:{
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginBottom: -70
    
  },
  divider: {
    height: 1, // or 2 for a thicker line
    width: "70%",
    backgroundColor: "black", // You can choose any color
    marginVertical: 5, // Spacing above and below the line
  },
  topImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    shadowColor: "#4A3903",
    shadowOpacity: 5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  quoteWrapper: {
    height: 200, // Fixed height to accommodate quote and author text
    justifyContent: 'center', // Center the quote vertically within the wrapper
    alignItems: 'center', // Center the quote horizontally
    paddingHorizontal: 40, // Keep some padding
    marginTop: -100,
    marginBottom:  -70,
    
  },
  quoteContainer: {
    alignItems: "center",
  },
  quoteText: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
    color: "#F7B500",
    fontWeight: "bold",
    shadowColor: "#F7B500",
    shadowOpacity: .8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  authorText: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
  buttonsContainer: {
    width: "100%", // Ensure buttons container spans the full width
    alignItems: "center",
    
  },
  button: {
    backgroundColor: "#F7B500",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    width: 200, // Set a fixed width for buttons
    height: 50, // Set a fixed height for buttons
    shadowColor: "#F7B500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});