import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
    //esconder o header
    screenOptions={{   
      headerShown: false,
    }}
    />
  );
}
