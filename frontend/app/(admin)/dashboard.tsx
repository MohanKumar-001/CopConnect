import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function AdminDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { complaints, sosAlerts } = useData();

    const activeSOSCount = sosAlerts.filter(a => a.status === 'ACTIVE').length;
    const pendingComplaintsCount = complaints.filter(c => c.status === 'Pending').length;

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Super Visor" subtitle="Administrator" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            >
                <Text className="text-2xl font-black text-police-navy tracking-tight mb-6">System Overview</Text>

                <View className="flex-row flex-wrap justify-between items-start">
                    <DashboardCard
                        title="Total Users"
                        count="1,204"
                        icon={<Ionicons name="people" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(admin)/users")}
                    />
                    <DashboardCard
                        title="Active Officers"
                        count="45"
                        icon={<Ionicons name="shield-checkmark" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(admin)/users")}
                    />
                    <DashboardCard
                        title="Complaints"
                        count={`${pendingComplaintsCount}`}
                        icon={<Ionicons name="documents" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(officer)/complaints")}
                    />
                    <DashboardCard
                        title="SOS Alerts"
                        count={`${activeSOSCount}`}
                        icon={<Ionicons name="alert" size={26} color="#DC2626" />}
                        onPress={() => router.push('/(admin)/sos-assignment')}
                        color="bg-red-50/50"
                    />
                </View>

                <View className="mt-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <View className="flex-row items-center mb-6">
                        <View className="bg-police-blue/10 p-2 rounded-lg mr-3">
                            <Ionicons name="list" size={20} color="#0F4C81" />
                        </View>
                        <Text className="font-black text-police-navy uppercase tracking-widest text-xs">Security Logs</Text>
                    </View>

                    {['User Registered: CADET-992', 'Complaint Filed: CRIM-2991', 'Officer Dispatched: SOS-04'].map((log, i) => (
                        <View key={i} className="flex-row items-center mb-5 pb-5 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                            <View className="w-1.5 h-1.5 rounded-full bg-police-gold mr-4" />
                            <Text className="text-gray-600 font-bold text-sm tracking-tight">{log}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
