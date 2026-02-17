import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons"; // Assuming vector icons might be used, but user text says 'Icon driven' - I should use icons.
// NativeWind supports icons if I import them.
// Let's assume passed icon or simple text if no icon lib configured yet.
// I will use Expo vector icons.

interface Props {
    title: string;
    count?: string | number;
    icon?: any; // React Node
    onPress: () => void;
    color?: string;
}

export default function DashboardCard({ title, count, icon, onPress, color = "bg-white" }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className={`w-[47%] aspect-[1/0.95] p-5 rounded-3xl mb-5 shadow-xl border border-gray-100 ${color}`}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
                elevation: 8
            }}
        >
            <View className="bg-police-lightBlue w-12 h-12 rounded-2xl items-center justify-center mb-3">
                {icon}
            </View>
            <View>
                <Text className="text-2xl font-black text-police-navy tracking-tighter">{count}</Text>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-80">{title}</Text>
            </View>
        </TouchableOpacity>
    );
}
