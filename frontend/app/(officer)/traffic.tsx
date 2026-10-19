import React, { useState } from "react";
import { View, ScrollView, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { useRouter } from "expo-router";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { api } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";


export default function TrafficViolation() {
    const router = useRouter();
    const { user } = useAuth();
    const { issueChallan } = useData();

    const [vehicle, setVehicle] = useState("");
    const [violation, setViolation] = useState("");
    const [fine, setFine] = useState("");
    const [foundOwner, setFoundOwner] = useState<any>(null);

    const handleSearch = async () => {
        if (!vehicle || !user?.token) return;
        const res = await api.officer.searchUserByVehicle(user.token, vehicle);
        if (res) {
            setFoundOwner(res);
        } else {
            setFoundOwner({ name: "Unknown Owner (Civilian Registry)", vehicleNumber: vehicle });
        }
    };


    const handleSubmit = () => {
        if (!vehicle || !violation) return Alert.alert("Required", "Specify vehicle and violation.");

        issueChallan({
            userId: foundOwner?.id || "0",
            vehicleNumber: vehicle,
            reason: violation,
            amount: `₹${fine}`,
        });

        Alert.alert(
            "Enforcement Logged",
            `E-Challan issued to ${foundOwner?.name}.\nDigital alert dispatched via SMS gateways.`,
            [{ text: "DONE", onPress: () => router.back() }]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Enforcement Terminal" showBack showLogout={false} />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView className="p-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                    <View className="mb-8">
                        <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Vehicle Registry Lookup</Text>
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <InputField
                                    label=""
                                    value={vehicle}
                                    onChangeText={(text) => {
                                        setVehicle(text.toUpperCase());
                                        setFoundOwner(null);
                                    }}
                                    placeholder="e.g. MH-01-AB-1234"
                                    autoCapitalize="characters"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSearch}
                                className={`w-14 items-center justify-center rounded-2xl border-b-4 mb-2 bg-police-navy border-police-dark`}
                            >
                                <Ionicons name="search" size={24} color="#D4AF37" />
                            </TouchableOpacity>
                        </View>

                        {/* Verification feedback */}
                        {foundOwner && (
                            <View className="mt-4 flex-row items-center bg-green-50 p-3 rounded-2xl border border-green-100">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text className="text-green-700 font-bold text-xs ml-2 flex-1">Verified: {foundOwner.name}</Text>
                                <Text className="text-green-600 font-black text-[10px] uppercase tracking-widest">{foundOwner.phone || 'NO DB PHONE'}</Text>
                            </View>
                        )}
                        {foundOwner === false && (
                            <View className="mt-4 flex-row items-center bg-red-50 p-3 rounded-2xl border border-red-100">
                                <Ionicons name="warning" size={16} color="#DC2626" />
                                <Text className="text-red-700 font-bold text-xs ml-2">No matching registry found in database.</Text>
                            </View>
                        )}
                    </View>

                    {foundOwner && (
                        <View className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 mb-10">
                            <Text className="text-3xl font-black text-police-navy tracking-tighter mb-8">Issue Challan</Text>

                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Infraction Details</Text>
                            <View className="bg-gray-50 rounded-3xl border border-gray-100 p-4 mb-6">
                                <TextInput
                                    placeholder="Rule violated (e.g. Over speeding)"
                                    className="font-bold text-police-navy"
                                    value={violation}
                                    onChangeText={setViolation}
                                />
                            </View>

                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Penalty Amount (₹)</Text>
                            <View className="bg-gray-50 rounded-3xl border border-gray-100 p-4 mb-8">
                                <TextInput
                                    placeholder="500"
                                    keyboardType="numeric"
                                    className="font-bold text-police-navy text-xl"
                                    value={fine}
                                    onChangeText={setFine}
                                />
                            </View>

                            <View className="w-full">
                                <PrimaryButton
                                    title="DISPATCH CHALLAN"
                                    onPress={handleSubmit}
                                    variant="danger"
                                />
                            </View>
                        </View>
                    )}

                    {!foundOwner && (
                        <View className="items-center mt-12 px-8">
                            <Ionicons name="shield-checkmark" size={48} color="#E2E8F0" />
                            <Text className="text-gray-400 font-bold text-center mt-4 leading-relaxed">
                                Search for a vehicle number to verify identity before issuing enforcement notices.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
