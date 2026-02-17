import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import RoleCard from "../../components/RoleCard";
import { Ionicons } from "@expo/vector-icons";

type Role = "user" | "officer" | "admin";

export default function Register() {
    const [step, setStep] = useState<1 | 2>(1);
    const [role, setRole] = useState<Role>("user");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        aadhaar: "",
        vehicleNumber: "",
        badgeNumber: ""
    });

    const { signUp, isLoading } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleRegister = async () => {
        if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
            return Alert.alert("Required", "Basic identification and phone number are mandatory.");
        }

        if (role === "user") {
            if (!formData.aadhaar || !formData.vehicleNumber) {
                return Alert.alert("Required", "Aadhaar and Vehicle Registration are mandatory for citizens.");
            }
        }

        if (role === "officer" && !formData.badgeNumber) {
            return Alert.alert("Required", "Official Badge Number is mandatory for officers.");
        }

        await signUp({ ...formData, role });
    };

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderRoleSelection = () => (
        <ScrollView
            className="flex-1 px-8"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: Math.max(insets.top, 40) }}
        >
            <View className="mb-8">
                <Text className="text-4xl font-black text-police-navy tracking-tighter">Registration</Text>
                <View className="flex-row items-center mt-2">
                    <View className="w-10 h-1 bg-police-gold rounded-full mr-2" />
                    <Text className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Step 01: Role Selection</Text>
                </View>
            </View>

            <RoleCard
                role="Public Citizen"
                description="Secure access to citizen services."
                selected={role === "user"}
                onSelect={() => setRole("user")}
            />
            <RoleCard
                role="Service Officer"
                description="Specialized tools for field operations."
                selected={role === "officer"}
                onSelect={() => setRole("officer")}
            />
            <RoleCard
                role="System Admin"
                description="High-level oversight & management."
                selected={role === "admin"}
                onSelect={() => setRole("admin")}
            />

            <View className="mt-10">
                <PrimaryButton title="PROCEED" onPress={() => setStep(2)} />
            </View>

            <View className="flex-row justify-center mt-8 pb-10">
                <Text className="text-gray-400 font-medium">Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                        <Text className="text-police-blue font-black tracking-tight underline">Login here</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );

    const renderForm = () => (
        <ScrollView
            className="flex-1 px-8"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: Math.max(insets.top, 40) }}
        >
            <TouchableOpacity onPress={() => setStep(1)} className="flex-row items-center mb-8 bg-gray-50 self-start px-4 py-2 rounded-full border border-gray-100">
                <Ionicons name="chevron-back" size={20} color="#001B3D" />
                <Text className="text-police-navy font-black text-xs uppercase tracking-widest ml-1">Change Role</Text>
            </TouchableOpacity>

            <View className="mb-8">
                <Text className="text-4xl font-black text-police-navy tracking-tighter capitalize">{role}</Text>
                <View className="flex-row items-center mt-2">
                    <View className="w-10 h-1 bg-police-gold rounded-full mr-2" />
                    <Text className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Step 02: Credentials</Text>
                </View>
            </View>

            <InputField label="Full Name" value={formData.name} onChangeText={(t) => updateForm("name", t)} placeholder="Enter full name" />
            <InputField label="Secure Email" value={formData.email} onChangeText={(t) => updateForm("email", t)} placeholder="Enter email address" keyboardType="email-address" />
            <InputField label="Contact Number" value={formData.phoneNumber} onChangeText={(t) => updateForm("phoneNumber", t)} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
            <InputField label="Security Key" value={formData.password} onChangeText={(t) => updateForm("password", t)} placeholder="Minimum 8 characters" secureTextEntry />

            {role === "user" && (
                <>
                    <InputField label="Aadhaar ID" value={formData.aadhaar} onChangeText={(t) => updateForm("aadhaar", t)} placeholder="XXXX-XXXX-XXXX" keyboardType="numeric" />
                    <InputField label="Primary Vehicle #" value={formData.vehicleNumber} onChangeText={(t) => updateForm("vehicleNumber", t)} placeholder="KA-01-XX-XXXX" autoCapitalize="characters" />
                </>
            )}

            {role === "officer" && (
                <InputField label="Service Badge #" value={formData.badgeNumber} onChangeText={(t) => updateForm("badgeNumber", t)} placeholder="BADGE-IDENT-001" />
            )}

            <View className="mt-10 mb-20">
                <PrimaryButton title="FINALIZE REGISTRATION" onPress={handleRegister} isLoading={isLoading} />
            </View>
        </ScrollView>
    );

    return (
        <View className="flex-1 bg-white">
            <View className="px-8 mt-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-police-navy font-black text-[8px] uppercase tracking-[2px]">Unified National Security Portal</Text>
                    <Ionicons name="shield-checkmark" size={16} color="#001B3D" />
                </View>
            </View>
            {step === 1 ? renderRoleSelection() : renderForm()}
        </View>
    );
}
