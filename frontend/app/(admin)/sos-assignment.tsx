import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useData } from "../../context/DataContext";
import PrimaryButton from "../../components/PrimaryButton";

export default function SOSAssignment() {
    const router = useRouter();
    const { sosAlerts, officers, assignSOS } = useData();
    const activeSOS = sosAlerts.filter(a => a.status === 'ACTIVE');
    const [selectedSOSId, setSelectedSOSId] = useState<string | null>(null);

    const handleAssign = (officerId: string, officerName: string) => {
        if (!selectedSOSId) return;
        assignSOS(selectedSOSId, officerId);
        setSelectedSOSId(null);
        Alert.alert("Assignment Complete", `Officer ${officerName} has been dispatched.`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Emergency Control" showBack />

            <FlatList
                data={activeSOS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center pt-20">
                        <Ionicons name="shield-checkmark" size={64} color="#E2E8F0" />
                        <Text className="text-gray-400 mt-4 font-bold">No Active SOS Alerts</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View className="bg-white p-6 rounded-[32px] mb-4 shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-police-sos font-black text-xs uppercase tracking-widest">🚨 ACTIVE EMERGENCY</Text>
                            <Text className="text-gray-400 text-[10px] font-bold">#SOS-{item.id}</Text>
                        </View>
                        <Text className="text-police-navy font-black text-2xl tracking-tighter mb-1">{item.userName}</Text>
                        <Text className="text-gray-500 font-medium mb-6">Location: {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>


                        <PrimaryButton
                            title="ASSIGN OFFICER"
                            onPress={() => setSelectedSOSId(item.id)}
                            variant="primary"
                        />
                    </View>
                )}
            />

            <Modal
                visible={!!selectedSOSId}
                animationType="slide"
                transparent={true}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-[50px] p-8 h-[70%]">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />
                        <Text className="text-2xl font-black text-police-navy tracking-tighter mb-6">Available Units</Text>

                        <FlatList
                            data={officers}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleAssign(item.id.toString(), item.name)}
                                    className="flex-row items-center bg-gray-50 p-5 rounded-3xl mb-3 border border-gray-100"
                                >
                                    <View className="bg-police-blue/10 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="person" size={24} color="#0F4C81" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-black text-police-navy text-lg">{item.name}</Text>
                                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">ID: {item.id}</Text>
                                    </View>
                                    <Ionicons name="add-circle" size={24} color="#0F4C81" />
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            onPress={() => setSelectedSOSId(null)}
                            className="mt-6 py-4 items-center"
                        >
                            <Text className="text-gray-400 font-black text-xs uppercase tracking-widest">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
