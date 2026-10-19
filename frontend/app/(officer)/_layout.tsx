import { Stack } from "expo-router";

export default function OfficerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F3F4F6" },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="complaints" />
      <Stack.Screen name="traffic" />
      <Stack.Screen name="sos-response" />
      <Stack.Screen name="intel-history" />
    </Stack>
  );
}