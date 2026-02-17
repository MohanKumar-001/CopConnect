import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";
import Header from "../../components/Header";

export default function TrackCase() {
    const router = useRouter();
    const { user } = useAuth();
    const { complaints } = useData();

    // If user is ROLE_USER, the backend already filters the list to only their cases.
    // If we need to filter further (e.g. status), we can do it here.
    const myComplaints = complaints;


    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="My Cases" subtitle="Active Tracking" showBack showLogout={false} />

            {myComplaints.length === 0 ? (
                <View className="flex-1 justify-center items-center p-12">
                    <View className="bg-gray-100 p-8 rounded-full mb-6">
                        <Ionicons name="document-text-outline" size={64} color="#94A3B8" />
                    </View>
                    <Text className="text-police-navy text-2xl font-black tracking-tight text-center">No Active Cases</Text>
                    <Text className="text-gray-400 text-sm mt-2 text-center font-medium leading-relaxed">
                        You have not filed any official complaints yet. All your future reports will appear here for live tracking.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={myComplaints}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 24 }}
                    renderItem={({ item }) => (
                        <View className="bg-white p-8 rounded-[40px] mb-6 shadow-xl border border-gray-50">
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-2 h-2 bg-police-gold rounded-full mr-2" />
                                        <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Case ID: {item.id}</Text>
                                    </View>
                                    <Text className="font-black text-2xl text-police-navy tracking-tighter" numberOfLines={2}>{item.title}</Text>
                                </View>
                                <StatusBadge status={item.status} />
                            </View>

                            <View className="bg-gray-50/50 p-5 rounded-3xl mb-6">
                                <Text className="text-gray-600 text-sm font-medium leading-relaxed" numberOfLines={3}>{item.description}</Text>
                            </View>

                            {(item as any).note && (
                                <View className="mb-6 p-4 bg-police-blue/5 rounded-2xl border border-police-blue/10">
                                    <Text className="text-police-blue font-black text-[10px] uppercase tracking-widest mb-1">Officer Note</Text>
                                    <Text className="text-police-navy text-xs font-semibold italic">"{(item as any).note}"</Text>
                                </View>
                            )}

                            <View className="flex-row items-center justify-between pt-6 border-t border-gray-50">
                                <View className="flex-row items-center">
                                    <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                                    <Text className="text-gray-400 font-bold text-xs ml-1">Filed: {item.date}</Text>
                                </View>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-police-blue font-black text-[10px] uppercase tracking-widest mr-1">View Timeline</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#0F4C81" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

