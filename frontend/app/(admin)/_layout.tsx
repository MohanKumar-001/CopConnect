import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F3F4F6' } }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="users" />
            <Stack.Screen name="officers" />
        </Stack>
    );
}
