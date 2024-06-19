import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from '../utils/theme'; // Adjust the import path as needed

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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/image102.png")} // Replace with the desired static image
          style={styles.headerImage}
        />

        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Welcome to ScholarSync!</Text>
        </View>
        <View style={styles.textBelow}>
          <Text style={styles.below}>
            "Elevate your high school success on ScholarSync, the ultimate hub
            for learning and peer connection."
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.descriptionContainer}>
          <Text style={styles.embraceText}>Journey forward:</Text>
          <Text style={styles.descriptionText}>
          At Scholar Link, share your professional achievements and career challenges. It's your platform to voice your story.
          </Text>
          <Image
            source={require("../assets/image103.png")}
            style={styles.descriptionImage}
          />
        </View>

        <View style={styles.missionSection}>
          <Text style={styles.mission}>Our Mission:</Text>
          <Text style={styles.missionText}>
            To help high schoolers with college applications and academic
            guidance.
          </Text>
          <Image
            source={require("../assets/image104.png")}
            style={styles.missionImage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>About Us</Text>
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

        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection("testimonials")}
        >
          <Text style={styles.subheading}>What Our Users Say</Text>
          {expandedSection === "testimonials" && (
            <View style={styles.dropdownContent}>
              <Text>"ScholarSync has transformed the way I study!" - Alex</Text>
              <Text>"I love the community aspect of ScholarSync." - Jordan</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Use the background color from the theme
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120, // Ensure enough space at the bottom
  },
  headerImage: {
    width: "100%",
    height: 250, // Increased height for a larger image
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
    padding: 150,
    marginTop: -30
  },
  headingContainer: {
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 20, // Added paddingHorizontal to ensure consistent padding
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  textBelow: {
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20, // Added paddingHorizontal to ensure consistent padding
  },
  below: {
    fontSize: 15,
    color: theme.colors.text,
    textAlign: "center",
    paddingVertical: 15,
  },
  descriptionContainer: {
    backgroundColor: "#f5f1ee",
    borderRadius: 10,
    padding: 15,
    paddingLeft: 30,
    marginLeft: -30,
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 10,
    marginRight: 80,
    paddingBottom: 10,
    paddingTop: 50

  },
  descriptionText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 0,
    paddingRight: 40,
    marginLeft: 20
  },
  embraceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
    marginLeft: 20
  },
  mission: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
    marginLeft: 50
  },
  descriptionImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: -150,
    marginRight: -175,
    marginLeft: 165
    
  },
  section: {
    marginVertical: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
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
    backgroundColor: "white", // Ensure it's readable
  },
  missionSection: {
    backgroundColor: "#f5f1ee",
    borderRadius: 10,
    padding: 15,
    paddingLeft: 30,
    marginLeft: 80,
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 10,
    marginRight: -30,
    paddingBottom: 20,
    paddingTop: 50,
    marginBottom: 60
    
  },
  missionText: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 15,
    marginLeft: 50,
  
  },
  missionImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    alignItems: 'left',
    marginLeft: -115,
    marginTop: -130
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "f5f1ee",
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
    color: theme.colors.text,
  },
  memberRole: {
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.selected,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginVertical: 20,
    shadowColor: theme.colors.selected,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginHorizontal: 75,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 5,
  },
  divider1: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 5,
    marginBottom: 20, // Adjusted to ensure proper spacing
  },
});

export default HomeScreen;
