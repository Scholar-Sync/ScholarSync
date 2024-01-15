import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const FirstRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#fff",
      marginLeft: 30,
      marginRight: 30,
    }}
  />
);
const SecondRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#fff",
      marginLeft: 30,
      marginRight: 30,
    }}
  />
);
const ThirdRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#fff",
      marginLeft: 30,
      marginRight: 30,
    }}
  />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Academics" },
    { key: "second", title: "Extracurriculars" },
    { key: "third", title: "Honors" },
  ]);

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "#F7B500", justifyContent: "center" }}
            labelStyle={{ fontWeight: "bold" }}
            contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
          />
        )}
      />
    </>
  );
}
