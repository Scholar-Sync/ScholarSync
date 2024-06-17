//theme.js
export const theme = {
    colors: {
      primary: "#6200ee",
      secondary: "#03dac4",
      background: "#f6f6f6",
      surface: "#ffffff",
      error: "#B00020",
      text: "#000000",
      disabled: "#f0f0f0",
      placeholder: "#a0a0a0",
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    fonts: {
      regular: "Roboto-Regular",
      medium: "Roboto-Medium",
      bold: "Roboto-Bold",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
  };
  
  export const darkTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: "#121212",
      surface: "#333333",
      text: "#ffffff",
    },
  };
  