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
import Swiper from "react-native-swiper";
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
      <ScrollView style={styles.container}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          loop
          autoplay
          buttonColor="grey"
          dotColor="grey"
          activeDotColor="black"
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
          <Text style={styles.embraceText}>📚 Embrace Your Journey:</Text>
          <Text style={styles.descriptionText}>
            At Scholar Link, share your high school highlights and challenges.
            It's your space to voice your unique story.
          </Text>
          <Image
            source={require("../assets/bus.gif")}
            style={styles.descriptionImage}
          />
        </View>

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
    padding: 20,
    paddingBottom: 100, // Replace with the actual height
    backgroundColor: theme.colors.background, // Use the background color from the theme
  },
  wrapper: {
    height: 200,
    marginBottom: -10,
  },
  slideImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    shadowColor: theme.colors.selected,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderColor: theme.colors.selected,
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
    color: theme.colors.text,
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
    color: theme.colors.text,
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  embraceText: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
  },
  descriptionImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 15,
  },
  section: {
    marginVertical: 20,
  },
  subheading: {
    fontSize: 22,
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
    color: theme.colors.text,
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
    marginRight: 75,
    marginLeft: 75,
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
    marginBottom: 100,
  },
});

export default HomeScreen;
