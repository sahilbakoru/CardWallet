import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack 
  // options={{
  //   animation: "fade", // or "none" for instant return
  // }}
   screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
    }}></Stack>

}
