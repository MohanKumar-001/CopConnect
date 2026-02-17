import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";

interface Props {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    showLogout?: boolean;
}

export default function Header({ title, subtitle, showBack, showLogout = true }: Props) {
    const { signOut } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <View
            className="w-full bg-police-navy rounded-b-[40px] shadow-2xl border-b-4 border-police-gold"
            style={{
                paddingTop: Math.max(insets.top, 20),
                paddingBottom: 24,
                paddingHorizontal: 24
            }}
        >
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                    {showBack && (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-white/10 p-2 rounded-full">
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text className="text-white text-3xl font-extrabold tracking-tight" numberOfLines={1}>{title}</Text>
                        {subtitle && (
                            <View className="flex-row items-center mt-1">
                                <View className="w-2 h-2 bg-police-gold rounded-full mr-2" />
                                <Text className="text-police-accent text-sm font-semibold uppercase tracking-wider">{subtitle}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={toggleColorScheme}
                        className="bg-white/10 p-2.5 rounded-2xl border border-white/20 mr-2"
                    >
                        <Ionicons
                            name={colorScheme === "dark" ? "sunny" : "moon"}
                            size={18}
                            color="#D4AF37"
                        />
                    </TouchableOpacity>

                    {showLogout && (
                        <TouchableOpacity
                            onPress={signOut}
                            className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20"
                        >
                            <Text className="text-white text-xs font-black">LOGOUT</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}
