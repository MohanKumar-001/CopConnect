import React, { useState } from "react";
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import Header from "../../components/Header";

export default function FileComplaint() {
    const router = useRouter();
    const { user } = useAuth();
    const { addComplaint } = useData();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !desc) return alert("Please fill details");

        setLoading(true);
        try {
            await addComplaint({
                title,
                description: desc,
            });
            setLoading(false);
            Alert.alert("Success", "Complaint filed successfully. It will be reviewed by an officer shortly.");
            router.back();
        } catch (e) {
            setLoading(false);
            Alert.alert("Error", "Failed to file complaint");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#F8FAFC]">
            <Header title="Lodge Report" subtitle="Official Documentation" showBack showLogout={false} />

            <ScrollView
                className="px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mt-8 mb-8">
                    <Text className="text-3xl font-black text-police-navy tracking-tighter mb-2">Complaint Registry</Text>
                    <Text className="text-gray-400 font-medium leading-relaxed">
                        Please provide precise information. False reporting is a punishable offense under judicial guidelines.
                    </Text>
                </View>

                <View className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50">
                    <InputField
                        label="Incident Subject"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Briefly state the nature of incident"
                    />

                    <InputField
                        label="Detailed Description"
                        value={desc}
                        onChangeText={setDesc}
                        placeholder="Provide details like time, location, and entities involved..."
                        multiline
                    />

                    <View className="mt-6">
                        <PrimaryButton
                            title="FILE OFFICIAL REPORT"
                            onPress={handleSubmit}
                            isLoading={loading}
                            variant="gold"
                        />
                    </View>

                    <View className="mt-8 flex-row items-center justify-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-2">Secure & Confidential</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

