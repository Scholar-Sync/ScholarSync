import emailjs from "@emailjs/browser";
// Custom send function to handle React Native environment
export const sendEmail = async (
  serviceID,
  templateID,
  templateParams,
  userID
) => {
  const currentPathname = "defaultPath"; // or any other string, as needed

  // Mock the global location object to avoid the ReferenceError
  global.location = {
    pathname: currentPathname,
    currentPathname: currentPathname,
  };

  try {
    const response = await emailjs.send(
      serviceID,
      templateID,
      templateParams,
      userID
    );
    return response;
  } catch (error) {
    throw error;
  } finally {
    // Clean up by removing the mock
    delete global.location;
  }
};
