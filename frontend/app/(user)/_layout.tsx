import { Stack } from 'expo-router';

export default function UserLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F4F6' } }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="file-complaint" options={{ presentation: 'modal' }} />
            <Stack.Screen name="track-case" />
            <Stack.Screen name="vehicle-fines" />
            <Stack.Screen name="wanted" />
        </Stack>
    );
}
