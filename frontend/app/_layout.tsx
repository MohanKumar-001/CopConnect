import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";
import "../global.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <DataProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="(user)" options={{ headerShown: false }} />
                        <Stack.Screen name="(officer)" options={{ headerShown: false }} />
                        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                    </Stack>
                </DataProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
