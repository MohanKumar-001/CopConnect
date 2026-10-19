import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, isLoading } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleLogin = async () => {
        if (!email || !password) return alert("Please fill all fields");
        await signIn(email, password);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View
                    className="bg-police-navy pb-16 items-center justify-center rounded-b-[60px] shadow-2xl border-b-8 border-police-gold/30"
                    style={{ paddingTop: Math.max(insets.top, 60) }}
                >
                    <View className="w-28 h-28 bg-white/10 rounded-full items-center justify-center mb-6 border-4 border-police-gold shadow-2xl">
                        <Ionicons name="shield-checkmark" size={60} color="#D4AF37" />
                    </View>
                    <Text className="text-4xl font-black text-white tracking-widest text-center">COP<Text className="text-police-gold">CONNECT</Text></Text>
                    <View className="flex-row items-center mt-3 bg-white/10 px-4 py-1 rounded-full border border-white/20">
                        <View className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2" />
                        <Text className="text-police-lightBlue text-[10px] font-bold uppercase tracking-[2px]">Encrypted & Secure</Text>
                    </View>
                </View>

                <View className="p-8 -mt-10 bg-white mx-6 rounded-[40px] shadow-2xl border border-gray-50 mb-10">
                    <Text className="text-3xl font-black text-police-navy mb-2 text-center tracking-tight">Welcome</Text>
                    <Text className="text-gray-400 text-sm mb-8 text-center font-semibold uppercase tracking-widest">Sign in to your portal</Text>

                    <InputField
                        label="Badge ID / Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Select login identifier"
                        keyboardType="email-address"
                    />

                    <InputField
                        label="Security Key"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <View className="mt-8">
                        <PrimaryButton
                            title="ACCESS PORTAL"
                            onPress={handleLogin}
                            isLoading={isLoading}
                        />
                    </View>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-400 font-medium">New to the service? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-police-blue font-black tracking-tight underline">Register Now</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <View className="mt-10 p-4 bg-gray-50 rounded-2xl border border-gray-100 items-center">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Testing Credentials</Text>
                        <Text className="text-[11px] text-gray-500 font-semibold italic">user / officer / admin @cop.com</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
