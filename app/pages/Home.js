import * as React from "react";
import { useState, useRef, useCallback } from "react";import {
  Button,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Swiper from "react-native-swiper";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";

const HomeScreen = ({ navigation }) => {

  const [teamMembers] = useState([
    {
      name: "Roi Mahns",
      role: "Developer/Manager",
      image: require("../assets/PFP.png"),
      details: "Roi Mahns, who came into this world on July 10th, 2009, in the picturesque town of Anchorage, Alaska, is deeply passionate about both computer science and soccer, aspiring to further develop these interests. Currently a 9th grader at Antillies High School, Roi is recognized for his ingenious approach to problem-solving and harbors a fervent enthusiasm for coding and technological advancements."
    },
    {
      name: "Riley Wenk",
      role: "Developer/Designer",
      image: require("../assets/PFP.png"),
      details: "Detail information about Riley Wenk.",
    },
    {
      name: "Ayla Mahns",
      role: "Developer",
      image: require("../assets/PFP.png"),
      details: "Detail information about Ayla Mahns.",
    },
  ]);
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const [expandedMember, setExpandedMember] = useState(null);
  const toggleMemberInfo = (memberIndex) => {
    setExpandedMember(expandedMember === memberIndex ? null : memberIndex);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value for fade-in effect
  
  useFocusEffect(
    useCallback(() => {
      // Reset the animation state to 0
      fadeAnim.setValue(0);
  
      // Start the fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade to full opacity
        duration: 600, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [fadeAnim]) // Add fadeAnim to the dependency array
  );
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require("../assets/background.png")}
          style={styles.backgroundImage}
        >
      <ScrollView style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          loop
          autoplay
          marginBottom="10"
          buttonColor="grey" // Color for the buttons
          dotColor="grey" // Color for the dots
          activeDotColor="black" // Color for the active dot
        >
          <Image
            source={require("../assets/page1.png")}
            style={styles.slideImage}
          />
          <Image
            source={require("../assets/page2.png")}
            style={styles.slideImage}
          />
          <Image
            source={require("../assets/page3.png")}
            style={styles.slideImage}
          />
          <Image
            source={require("../assets/page4.png")}
            style={styles.slideImage}
          />
        </Swiper>

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Welcome to ScholarSync!</Text>
        </View>
        <View dtyle={styles.textBelow}>
          <Text style={styles.below}>
            "Elevate your high school success on ScholarSync, the ultimate hub
            for learning and peer connection."
          </Text>
        </View>
        {/* Call to Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")} // Add the navigation call here
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <View>
          <Image
          //source={require("../assets/border.jpg")} // Replace with your image path
          //style={styles.borderImage}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.embraceText}>📚 Embrace Your Journey:</Text>
          <Text style={styles.descriptionText}>
            At Scholar Link, share your high school highlights and challenges.
            It's your space to voice your unique story.
          </Text>
          <Image
            source={require("../assets/bus.gif")} // Replace with your image path
            style={styles.descriptionImage}
          />
        </View>

        {/* Swiper/Slideshow */}

        <View style={styles.missionSection}>
          <Text style={styles.subheading}>🤝 Our Mission</Text>
          <Text style={styles.missionText}>
            To help high schoolers with college applications and academic
            guidance.
          </Text>
          <Image
            source={require("../assets/mission.png")}
            style={styles.missionImage}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.subheading} onPress={() => test()}>About Us</Text>
          {teamMembers.map((member, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.memberContainer}
                onPress={() => toggleMemberInfo(index)}
              >
                <Image source={member.image} style={styles.memberImage} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </TouchableOpacity>
              {expandedMember === index && (
                <View style={styles.memberDetails}>
                  <Text>{member.details}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        {/* Features Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection("features")}
        >
          <Text style={styles.subheading}>Our Features</Text>
          {expandedSection === "features" && (
            <View style={styles.dropdownContent}>
              <Text>Feature 1: Collaborative Learning Tools</Text>
              <Text>Feature 2: Real-time Academic Assistance</Text>
              <Text>Feature 3: Gamified Learning Experience</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Testimonials Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection("testimonials")}
        >
          <Text style={styles.subheading}>What Our Users Say</Text>
          {expandedSection === "testimonials" && (
            <View style={styles.dropdownContent}>
              <Text>"ScholarSync has transformed the way I study!" - Alex</Text>
              <Text>
                "I love the community aspect of ScholarSync." - Jordan
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* FAQ Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection("faqs")}
        >
          <Text style={styles.subheading}>Frequently Asked Questions</Text>
          {expandedSection === "faqs" && (
            <View style={styles.dropdownContent}>
              <Text>Q: How do I sign up?</Text>
              <Text>
                A: You can sign up using your email or social media accounts.
              </Text>
              <Text>Q: Is ScholarSync free to use?</Text>
              <Text>A: Yes, it's completely free for students.</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Contact Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection("contact")}
        >
          <Text style={styles.subheading}>Get in Touch</Text>
          {expandedSection === "contact" && (
            <View style={styles.dropdownContent}>
              <Text>Email: contact@scholarsync.com</Text>
              <Text>Phone: 123-456-7890</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider1} />

      </ScrollView>
    </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Replace with the actual height
  },

  // Style for the inner content view

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  wrapper: {
    height: 200,
    marginBottom: -10
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    shadowColor: "#F7B500", // Same color as the border
    shadowOpacity: .3, // Adjust as needed
    shadowRadius: 10, // Adjust for the spread of the shadow
    shadowOffset: { width: 0, height: 4 }, // Adjust as needed
    borderColor: "#F7B500",
    borderWidth: 15,
    borderTopWidth: 10,
    borderRadius: 10,
    marginBottom: -50,

  },
  headingContainer: {
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textBelow: {
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  below: {
    fontSize: 15,

    color: "black",
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginTop: 200,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 22,
  },
  embraceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 10,
  },

  descriptionImage: {
    width: "165%", // Adjust as needed
    height: 200, // Adjust as needed
    borderRadius: 10, // Optional: if you want rounded corners
    resizeMode: "cover", // Or 'contain' based on your requirement
    marginTop: 15, // Optional: adjust space between text and image
  },
  section: {
    marginVertical: 20,
  },
  subheading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 10,
  },
  dropdownContent: {

    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 10,
  },
  missionSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  missionText: {
    fontSize: 18,
    color: "#6C6C6C",
    marginBottom: 15,
  },
  missionImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  memberDetails: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#E8E8E8",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  memberRole: {
    fontSize: 16,
    color: "#6C6C6C",
  },
  button: {
    backgroundColor: "#F7B500",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginVertical: 20,
    shadowColor: "#F7B500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginRight: 75,
    marginLeft: 75,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  divider: {
    height: 1, // or 2 for a thicker line
    width: '100%',
    backgroundColor: 'black', // You can choose any color
    marginVertical: 5, // Spacing above and below the line
  },
  divider1: {
    height: 1, // or 2 for a thicker line
    width: '100%',
    backgroundColor: 'black', // You can choose any color
    marginVertical: 5,
    marginBottom: 100, // Spacing above and below the line
  },

});

export default HomeScreen;