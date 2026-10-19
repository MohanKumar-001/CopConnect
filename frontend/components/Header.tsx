import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogout?: boolean;
}

export default function Header({
  title,
  subtitle,
  showBack,
  showLogout = true,
}: Props) {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View
      className="w-full bg-police-navy rounded-b-[40px] border-b-4 border-police-gold"
      style={{
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: 24,
        paddingHorizontal: 24,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 pr-2">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 bg-white/10 p-2 rounded-full"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <Text
              className="text-white text-2xl font-extrabold"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {title}
            </Text>

            {subtitle && (
              <Text className="text-police-accent text-xs font-semibold uppercase mt-1">
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={toggleColorScheme}
            className="bg-white/10 p-2 rounded-xl mr-2"
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
              className="bg-white/10 px-4 py-2 rounded-xl"
            >
              <Text className="text-white text-xs font-bold">LOGOUT</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}