import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function OfficerManagement() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", badgeNumber: "", password: "" });

    const updateForm = (field: keyof typeof form, value: string) => {
        setForm(current => ({ ...current, [field]: value }));
    };

    const createOfficer = async () => {
        if (!user?.token) return;
        if (Object.values(form).some(value => !value.trim())) {
            Alert.alert("Required fields", "Complete all officer details before creating the account.");
            return;
        }
        if (form.password.length < 8) {
            Alert.alert("Password too short", "Use at least 8 characters for the officer password.");
            return;
        }

        setIsLoading(true);
        try {
            await api.admin.createOfficer(user.token, form);
            setForm({ name: "", email: "", phoneNumber: "", badgeNumber: "", password: "" });
            Alert.alert("Officer created", "The officer can now sign in using their email and password.");
        } catch (error: any) {
            Alert.alert("Could not create officer", error.message || "Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <Header title="Active Officers" subtitle="Officer Account Creation" showBack showLogout={false} />
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="bg-white p-6 rounded-[28px] border border-gray-100">
                    <Text className="text-police-navy font-black text-lg">Create officer account</Text>
                    <Text className="text-gray-400 text-xs mt-1 mb-3">Only administrators can create operational accounts.</Text>
                    <InputField label="Full name" value={form.name} onChangeText={(value) => updateForm("name", value)} placeholder="Officer name" />
                    <InputField label="Email" value={form.email} onChangeText={(value) => updateForm("email", value)} placeholder="officer@example.com" keyboardType="email-address" autoCapitalize="none" />
                    <InputField label="Phone number" value={form.phoneNumber} onChangeText={(value) => updateForm("phoneNumber", value)} placeholder="Phone number" keyboardType="phone-pad" />
                    <InputField label="Badge number" value={form.badgeNumber} onChangeText={(value) => updateForm("badgeNumber", value)} placeholder="BADGE-001" autoCapitalize="characters" />
                    <InputField label="Temporary password" value={form.password} onChangeText={(value) => updateForm("password", value)} placeholder="At least 8 characters" secureTextEntry />
                    <PrimaryButton title="Create officer" onPress={createOfficer} isLoading={isLoading} variant="gold" />
                </View>
            </ScrollView>
        </View>
    );
}
