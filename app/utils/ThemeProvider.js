import React, { createContext, useContext, useState } from "react"; // Imports React and specific hooks/functions from the React library.
import { theme, darkTheme } from "./theme"; //light and dark theme

const ThemeContext = createContext(); //Creates a context

export const ThemeProvider = ({ children }) => {
  // ThemeProvider will use ThemeContext to provide the current theme and the toggle function to its child components.
  const [currentTheme, setCurrentTheme] = useState(theme); // setCurrentTheme is the function to update the currentTheme

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === theme ? darkTheme : theme);
  }; //  toggleTheme switches between the light theme and the dark theme by updating the currentTheme state.

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  ); // ThemeProvider returns a ThemeContext Provider with the value prop set to an object containing the currentTheme and the toggleTheme function. The children prop allows any nested components to access this context.
};

export const useTheme = () => useContext(ThemeContext);
// useTheme simplifies the process of consuming the ThemeContext. It returns the current theme and the toggle function, allowing components to easily access them.
