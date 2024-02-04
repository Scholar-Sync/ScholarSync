import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./pages/Home";
import Profile from "./pages/Bookmarks"
import Showcase from "./pages/Showcase"
import Bookmarks from "./pages/Bookmarks"
import Settings from "./pages/Settings"
import CustomBottomTab from "./components/BottomTabs/CustomBottomTab";

const Tab = createBottomTabNavigator();

export default function BottomTabs () {
    return (
     <Tab.Navigator tabBar={props => <CustomBottomTab {...props} />}> 
        <Tab.Group
        screenOptions={{
        headerShown: false,
        }}>
        <Tab.Screen
        options={{tabBarLabel: 'Home'}}
        name="Home"
        component={Home}
        />
        <Tab.Screen 
        options={{tabBarLabel: 'Profile'}}
        name="Profile"
        component={Profile}
        />
         <Tab.Screen 
        options={{tabBarLabel: 'Showcase'}}
        name="Showcase"
        component={Showcase}
        />
        <Tab.Screen 
        options={{tabBarLabel: 'Bookmarks'}}
        name="Bookmarks"
        component={Bookmarks}
        />
        <Tab.Screen 
        options={{tabBarLabel: 'Settings'}}
        name="Settings"
        component={Settings}
        />
        </Tab.Group>
     </Tab.Navigator>   
    )
}