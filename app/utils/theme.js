export const theme = {
    colors: {
   
      background: "#efedec",
      background_b: "#f9feff",
      selected: "#ffb95d",
      highlight: "#f5f1ee",
      text: "#4b4e52",
     
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
  