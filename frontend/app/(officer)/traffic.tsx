import React, { useState } from "react";
import { View, ScrollView, Alert, Text, TouchableOpacity } from "react-native";
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

            <ScrollView className="p-8" showsVerticalScrollIndicator={false}>
                <View className="mb-8">
                    <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Vehicle Registry Lookup</Text>
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <InputField
                                label=""
                                value={vehicle}
                                onChangeText={setVehicle}
                                placeholder="KA-01-XX-XXXX"
                                autoCapitalize="characters"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSearch}
                            className="bg-police-navy w-16 h-14 rounded-3xl items-center justify-center shadow-lg"
                        >
                            <Ionicons name="search" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {foundOwner && (
                        <View className="mt-4 bg-police-navy/5 p-6 rounded-[32px] border border-police-navy/10 flex-row items-center">
                            <View className="bg-white w-12 h-12 rounded-2xl items-center justify-center shadow-sm mr-4">
                                <Ionicons name="person" size={20} color="#001B3D" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest mb-0.5">Verified Owner</Text>
                                <Text className="text-police-navy font-black text-lg tracking-tight">{foundOwner.name}</Text>
                                {foundOwner.phoneNumber && <Text className="text-police-blue/60 text-[10px] font-bold">Linked UID: {foundOwner.phoneNumber}</Text>}
                            </View>
                        </View>
                    )}
                </View>

                {foundOwner && (
                    <View className="mb-8 animate-in fade-in duration-500">
                        <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Infringement Details</Text>

                        <View className="gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <InputField
                                label="Violation Description"
                                value={violation}
                                onChangeText={setViolation}
                                placeholder="Speeding, Signal Jump, etc."
                            />

                            <InputField
                                label="Penalty Amount (₹)"
                                value={fine}
                                onChangeText={setFine}
                                placeholder="500"
                                keyboardType="numeric"
                            />

                            <PrimaryButton
                                title="ISSUE DIGITAL CHALLAN"
                                onPress={handleSubmit}
                                variant="primary"
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
        </View>
    );
}
