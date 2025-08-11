import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";
export default function RootLayout() {
  return (

    <Tabs screenOptions={{ tabBarActiveTintColor: 'black',
  headerStyle: {
      // backgroundColor: 'rgba(0, 0, 0, 0.44)', // Overrides the global headerStyle for this screen
    },
      // tabBarShowLabel:false, 
    }}
  
  >
      <Tabs.Screen options={{
        
        title: 'Home',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }} name="index"
      />
      <Tabs.Screen
        name="ScanDocInput"
        options={{
          title: 'scan',
          tabBarIcon: ({ color }) => <AntDesign name="scan1" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          // tabBarBadge:1,
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={28} color={color} />,
        }}
      />
        <Tabs.Screen
        name="tabs"
        options={{
          href: null,
        }}
      />
        <Tabs.Screen
        name="cardDetails"
        options={{
          href: null,
        }}
      />
       <Tabs.Screen
        name="ManualInput"
        options={{
          href: null,
        }}
      />
   <Tabs.Screen
        name="components"
        options={{
          href: null,
        }}
      />
      
   

    </Tabs>)

}
