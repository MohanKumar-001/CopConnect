import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, Alert, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function OfficerDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { sosAlerts, sightings, resolveSighting, complaints, dismissSighting, caughtSuspectIds } = useData();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const calculateDistance = (lat: number, lng: number) => {
        const d = Math.sqrt(Math.pow(lat - 12.97, 2) + Math.pow(lng - 77.59, 2)) * 111;
        return d.toFixed(1);
    };

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const activeSOS = sosAlerts.find(a => a.status.toUpperCase() === 'ACTIVE');
    const activeSightings = sightings.filter(s =>
        s.status.toUpperCase() !== 'RESOLVED' &&
        s.status.toUpperCase() !== 'FALSE_ALARM' &&
        !caughtSuspectIds.includes(s.wantedId.toString())
    );


    const handleCapture = (sightingId: any, suspectId: any) => {
        Alert.alert(
            "Report Actions",
            "Verify the intel report status.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "False Alarm",
                    style: "default",
                    onPress: () => {
                        dismissSighting(sightingId.toString());
                        Alert.alert("Intel Updated", "Report marked as false alarm.");
                    }
                },
                {
                    text: "SUSPECT CAUGHT",
                    style: "destructive",
                    onPress: () => {
                        resolveSighting(sightingId.toString(), suspectId.toString(), user?.id || "0", user?.name || "Officer");
                        Alert.alert("Case Resolved", "Suspect marked as caught. Reward processing started.");
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Command Center" subtitle={`Officer ${user?.name}`} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="px-6 pt-6">
                    {activeSOS && (
                        <View className="bg-police-sos p-6 rounded-[32px] shadow-2xl border-4 border-white mb-4">
                            <View className="flex-row items-center">
                                <View className="flex-1 mr-4">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-2 h-2 bg-white rounded-full mr-2" />
                                        <Animated.Text
                                            style={{
                                                opacity: pulseAnim.interpolate({
                                                    inputRange: [1, 1.5],
                                                    outputRange: [1, 0.3]
                                                })
                                            }}
                                            className="text-white font-black text-xs uppercase tracking-widest"
                                        >
                                            Emergency Live
                                        </Animated.Text>
                                    </View>
                                    <Text className="text-white font-black text-2xl tracking-tighter" numberOfLines={1}>
                                        SOS: {activeSOS.userName}
                                    </Text>
                                    <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                                        {calculateDistance(activeSOS.lat, activeSOS.lng)} KM AWAY • TACTICAL SECTOR 4
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => router.push({ pathname: "/(officer)/sos-response", params: { id: activeSOS.id.toString() } })}
                                    className="bg-white px-5 py-3 rounded-2xl shadow-lg shrink-0"
                                >
                                    <Text className="font-black text-police-sos text-xs uppercase tracking-widest">Respond</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {activeSightings.map((sighting) => (
                        <View key={sighting.id} className="bg-police-navy p-6 rounded-[40px] shadow-2xl border-4 border-police-gold/30 mb-6 overflow-hidden">
                            <View className="absolute -right-10 -top-10 opacity-10">
                                <Ionicons name="eye" size={200} color="#D4AF37" />
                            </View>

                            <View className="flex-row items-baseline justify-between mb-4">
                                <View className="flex-row items-center bg-police-gold/20 px-3 py-1 rounded-full">
                                    <View className="w-1.5 h-1.5 bg-police-gold rounded-full mr-2" />
                                    <Text className="text-police-gold font-black text-[9px] uppercase tracking-widest">Active Intelligence</Text>
                                </View>
                                <Text className="text-white/40 text-[9px] font-bold">REWARD: {sighting.reward}</Text>
                            </View>

                            <Text className="text-white font-black text-3xl tracking-tighter mb-1">{sighting.wantedName}</Text>
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="location" size={14} color="#D4AF37" />
                                <Text className="text-police-accent font-bold text-xs ml-1">{sighting.location}</Text>
                            </View>

                            <View className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
                                <Text className="text-white/40 text-[8px] font-black uppercase tracking-wider mb-2">Citizen Intel</Text>
                                <Text className="text-white/80 text-sm font-medium leading-relaxed italic">
                                    "{sighting.description || "No remarks provided"}"
                                </Text>
                                <View className="flex-row items-center mt-3 pt-3 border-t border-white/5">
                                    <Ionicons name="person" size={12} color="#D4AF37" />
                                    <Text className="text-white/60 text-[10px] ml-2">Reported by: {sighting.userName}</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => handleCapture(sighting.id, sighting.wantedId)}
                                    className="flex-1 bg-police-gold py-4 rounded-2xl shadow-lg items-center justify-center flex-row"
                                >
                                    <Ionicons name="checkmark-circle" size={18} color="#001B3D" className="mr-2" />
                                    <Text className="font-black text-police-navy text-xs uppercase tracking-widest">SUSPECT CAUGHT</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-white/10 w-14 h-14 rounded-2xl items-center justify-center border border-white/10"
                                    onPress={() => Alert.alert("Dispatch", "Deploying Tactical Unit...")}
                                >
                                    <Ionicons name="navigate" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="px-6">
                    <Text className="text-2xl font-black text-police-navy tracking-tight mb-6">Operations Desk</Text>

                    <View className="flex-row flex-wrap justify-between items-start">
                        <DashboardCard
                            title="Complaints"
                            count={`${complaints.filter(c => {
                            const status = (c.status || "").toUpperCase();
                            return status !== "RESOLVED" && status !== "REJECTED";
                        }).length} Active`}
                            icon={<Ionicons name="clipboard" size={26} color="#001B3D" />}
                            onPress={() => router.push("/(officer)/complaints")}
                        />
                        <DashboardCard
                            title="Traffic Duty"
                            count="Control"
                            icon={<Ionicons name="car-sport" size={26} color="#001B3D" />}
                            onPress={() => router.push("/(officer)/traffic")}
                        />
                        <DashboardCard
                            title="Intel History"
                            count="Archive"
                            icon={<Ionicons name="archive" size={26} color="#001B3D" />}
                            onPress={() => router.push("/(officer)/intel-history")}
                        />
                        <DashboardCard
                            title="Emergency"
                            count={`${sosAlerts.filter(a => a.status.toUpperCase() === 'ACTIVE').length} Active`}
                            icon={<Ionicons name="warning" size={26} color="#DC2626" />}
                            onPress={() => { }}
                            color="bg-red-50/50"
                        />

                    </View>

                    <View className="mt-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 italic">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Notice to Personnel</Text>
                        <Text className="text-police-blue text-sm font-semibold">"Duty, Honor, Country. Ensure all digital reports are filed by the end of shift."</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
