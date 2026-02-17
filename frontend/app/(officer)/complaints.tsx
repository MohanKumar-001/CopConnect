import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useData, Complaint } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";

export default function OfficerComplaints() {
    const router = useRouter();
    const { complaints, updateComplaintStatus } = useData();
    const activeComplaints = complaints.filter(c => c.status.toUpperCase() !== 'RESOLVED');

    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [remarks, setRemarks] = useState("");

    const handleUpdateProgress = (status: string) => {
        if (!selectedComplaint) return;
        updateComplaintStatus(selectedComplaint.id, status, remarks);
        setSelectedComplaint(null);
        setRemarks("");
        Alert.alert("Success", `Status updated to ${status}`);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Case Files" showBack showLogout={false} />

            <FlatList
                data={activeComplaints}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedComplaint(item)}
                        className="bg-white p-6 rounded-[32px] mb-5 shadow-sm border border-gray-100"
                    >
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{item.id}</Text>
                            <StatusBadge status={item.status} />
                        </View>
                        <Text className="font-black text-xl text-police-navy tracking-tight mb-2">{item.title}</Text>
                        <Text className="text-gray-500 text-sm leading-relaxed mb-4" numberOfLines={2}>{item.description}</Text>

                        <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
                            <Text className="text-gray-400 font-bold text-xs">{item.date}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-police-blue font-black text-[10px] uppercase tracking-widest mr-1">Manage Case</Text>
                                <Ionicons name="chevron-forward" size={14} color="#001B3D" />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Case Detail & Management Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedComplaint}
                onRequestClose={() => setSelectedComplaint(null)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-[50px] p-8 pb-12 shadow-2xl h-[80%]">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">{selectedComplaint?.id}</Text>
                                    <Text className="text-3xl font-black text-police-navy tracking-tighter">{selectedComplaint?.title}</Text>
                                </View>
                                <StatusBadge status={selectedComplaint?.status || ""} />
                            </View>

                            <View className="bg-gray-50 p-6 rounded-3xl mb-8">
                                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-3">Incident Description</Text>
                                <Text className="text-police-navy font-medium leading-relaxed">{selectedComplaint?.description}</Text>
                            </View>

                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-3 ml-4">Internal Remarks / Observations</Text>
                            <View className="bg-gray-50 rounded-3xl border border-gray-100 p-4 mb-8">
                                <TextInput
                                    placeholder="Add case updates or officer observations..."
                                    multiline
                                    className="h-24 font-bold text-police-navy text-sm"
                                    textAlignVertical="top"
                                    value={remarks}
                                    onChangeText={setRemarks}
                                />
                            </View>

                            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-4">Update Official Status</Text>
                            <View className="flex-row flex-wrap gap-3 mb-8">
                                {[
                                    { label: 'Pending', status: 'PENDING', color: 'bg-gray-200', text: 'text-gray-600' },
                                    { label: 'In Progress', status: 'IN_PROGRESS', color: 'bg-blue-100', text: 'text-blue-600' },
                                    { label: 'Mark Resolved', status: 'RESOLVED', color: 'bg-green-600', text: 'text-white' },
                                    { label: 'Reject Case', status: 'REJECTED', color: 'bg-red-500', text: 'text-white' }
                                ].map(btn => (
                                    <TouchableOpacity
                                        key={btn.status}
                                        onPress={() => handleUpdateProgress(btn.status)}
                                        className={`${btn.color} px-6 py-4 rounded-2xl flex-1 items-center justify-center min-w-[140px]`}
                                    >
                                        <Text className={`${btn.text} font-black text-[10px] uppercase tracking-widest`}>{btn.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>


                            <TouchableOpacity
                                onPress={() => setSelectedComplaint(null)}
                                className="py-2 items-center"
                            >
                                <Text className="text-gray-400 font-black text-xs uppercase tracking-widest">Close File</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
