import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";
import { Pressable } from 'react-native';
export default function RootLayout() {
  return (

    <Tabs screenOptions={{ tabBarActiveTintColor: 'black',   tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "rgba(132, 132, 132, 1)" }} // Set ripple color to transparent
          />
        ),
      // headerTransparent: true, 
  // headerStyle: {
  //      backgroundColor: 'rgba(0, 0, 0, 0.44)', // Overrides the global headerStyle for this screen
  //   },
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
          tabBarIcon: ({ color }) => <Feather name="camera" size={28} color={color} />,
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
           title:'Card Details',
          //  headerStyle: {
          //   backgroundColor: '#ffffffd7', // Set your desired header background color here
          // },
          // headerTintColor: '#000000ff', // Optional: Set the color of the header title and back button
          headerTitleStyle: {
            // fontWeight: 'bold', // Optional: Customize header title style
          },
          href: null,
        }}
      />
       <Tabs.Screen
        name="tabs/ManualInput"
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
       <Tabs.Screen
        name="FromGallery"
        options={{
          href: null,
        }}
      />
          <Tabs.Screen
        name="GalleryInput"
        options={{
          href: null,
        }}
      />
   

    </Tabs>)

}
