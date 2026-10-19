import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import PrimaryButton from "../../components/PrimaryButton";
import { api } from "../../services/api";

export default function WantedList() {
    const router = useRouter();
    const { user } = useAuth();
    const { reportSighting, caughtSuspectIds, wanted } = useData();
    const [reportingVisible, setReportingVisible] = useState(false);
    const [selectedSuspect, setSelectedSuspect] = useState<any>(null);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const activeWanted = wanted.filter(w => !caughtSuspectIds.includes(w.id.toString()));


    const handleReportInitiate = (suspect: any) => {
        setSelectedSuspect(suspect);
        setReportingVisible(true);
    };

    const submitReport = () => {
        if (!location) return Alert.alert("Required", "Please specify the location of the sighting.");

        reportSighting({
            wantedId: selectedSuspect.id,
            wantedName: selectedSuspect.name,
            reward: selectedSuspect.reward,
            userId: user?.id || "anon",
            userName: user?.name || "Anonymous Citizen",
            location: location,
            description: description,
        });

        setReportingVisible(false);
        setLocation("");
        setDescription("");

        Alert.alert(
            "Intelligence Submitted",
            "Your report has been geo-tagged and sent to the nearest Tactical Response Team. Thank you for your bravery.",
            [{ text: "OK" }]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Most Wanted" showBack showLogout={false} />

            <FlatList
                data={activeWanted}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                renderItem={({ item }) => (
                    <View className="bg-white rounded-[40px] mb-8 shadow-xl border border-red-50 overflow-hidden">
                        <Image source={{ uri: item.image }} className="w-full h-56 bg-gray-200" resizeMode="cover" />
                        <View className="p-6">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 mr-4">
                                    <Text className="font-black text-2xl text-police-navy uppercase tracking-tighter">{item.name}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Ionicons name="alert-circle" size={14} color="#DC2626" />
                                        <Text className="text-red-600 font-black text-[10px] uppercase tracking-widest ml-1">Threat Level: Extreme</Text>
                                    </View>
                                </View>
                                <View className="bg-red-50 px-3 py-2 rounded-2xl items-end">
                                    <Text className="text-red-400 font-bold text-[8px] uppercase tracking-widest">Reward</Text>
                                    <Text className="font-black text-red-600 text-lg tracking-tighter">{item.reward}</Text>
                                </View>
                            </View>

                            <Text className="text-gray-600 mt-4 leading-relaxed font-medium">{item.description}</Text>

                            <TouchableOpacity
                                onPress={() => handleReportInitiate(item)}
                                className="mt-6 bg-red-600 py-5 rounded-[24px] items-center flex-row justify-center shadow-lg shadow-red-200"
                            >
                                <Ionicons name="eye" size={20} color="white" className="mr-2" />
                                <Text className="text-white font-black text-sm uppercase tracking-[2px]">REPORT SIGHTING</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Reporting Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={reportingVisible}
                onRequestClose={() => setReportingVisible(false)}
            >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end bg-black/70">
                    <View className="bg-white rounded-t-[50px] p-8 pb-12 shadow-2xl">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />

                        <Text className="text-3xl font-black text-police-navy tracking-tighter mb-2">Internal Intel Report</Text>
                        <Text className="text-red-600 font-black text-[10px] uppercase tracking-[2px] mb-8">Suspect: {selectedSuspect?.name}</Text>

                        <View className="mb-6">
                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2 ml-4">Sighting Location</Text>
                            <View className="bg-gray-50 rounded-3xl border border-gray-100 p-4 flex-row items-center">
                                <Ionicons name="location" size={20} color="#001B3D" className="mr-3" />
                                <TextInput
                                    placeholder="Where did you see them? (GPS tagged)"
                                    className="flex-1 font-bold text-police-navy"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2 ml-4">Additional Intel / Description</Text>
                            <View className="bg-gray-50 rounded-3xl border border-gray-100 p-4">
                                <TextInput
                                    placeholder="Provide any details about their clothes, vehicle, or direction..."
                                    multiline
                                    numberOfLines={4}
                                    className="h-24 font-bold text-police-navy text-sm pt-0"
                                    textAlignVertical="top"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </View>

                        <PrimaryButton
                            title="SUBMIT INTEL"
                            onPress={submitReport}
                            variant="danger"
                        />

                        <TouchableOpacity
                            onPress={() => setReportingVisible(false)}
                            className="py-4 items-center"
                        >
                            <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cancel Dispatch</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
