import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../components/PrimaryButton";
import { useData } from "../../context/DataContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SOSResponse() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { sosAlerts, resolveSOS } = useData();
    const [status, setStatus] = useState("LOCATING");
    const insets = useSafeAreaInsets();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const activeAlert = sosAlerts.find(a => a.id.toString() === id?.toString());

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 2.2,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const calculateDistance = () => {
        if (!activeAlert) return "1.2";
        // Mock a distance based on coordinates for realism
        const d = Math.sqrt(Math.pow(activeAlert.lat - 12.97, 2) + Math.pow(activeAlert.lng - 77.59, 2)) * 111;
        return d.toFixed(1);
    };

    const handleResolve = (resolution: 'RESOLVED' | 'FALSE_ALARM') => {
        if (!activeAlert) return;
        resolveSOS(activeAlert.id, resolution);
        Alert.alert("Status Updated", `Alert marked as ${resolution}`, [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    if (!activeAlert) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-lg">No Active Alert Selected</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-500 px-4 py-2 rounded">
                    <Text className="text-white">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#001B3D' }}>
            <View
                style={{ position: 'absolute', top: Math.max(insets.top, 20), left: 24, zIndex: 10 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full border border-white/20">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="h-[60%] bg-gray-900 items-center justify-center">
                <Ionicons name="map" size={100} color="#4B5563" />
                <Text className="text-gray-500 mt-4 font-bold uppercase tracking-widest text-xs">Tactical Response View</Text>

                {/* Tactical Blinking Rings */}
                <Animated.View style={{
                    position: 'absolute',
                    width: 160, height: 160,
                    backgroundColor: 'rgba(220, 38, 38, 0.3)',
                    borderRadius: 80,
                    transform: [{ scale: pulseAnim }],
                    opacity: Animated.multiply(pulseAnim, -0.4).interpolate({
                        inputRange: [-0.88, -0.4],
                        outputRange: [0.1, 0.4]
                    })
                }} />
                <Animated.View style={{
                    position: 'absolute',
                    width: 80, height: 80,
                    backgroundColor: 'rgba(220, 38, 38, 0.5)',
                    borderRadius: 40,
                    transform: [{ scale: pulseAnim }]
                }} />

                <View className="absolute bg-white w-4 h-4 rounded-full shadow-2xl border-4 border-red-600" />
            </View>

            <View
                className="flex-1 bg-police-navy rounded-t-[40px] p-8 items-center -mt-10 shadow-2xl border-t-4 border-police-gold/20"
                style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <View className="w-12 h-1 bg-white/20 rounded-full mb-6" />
                <Text className="text-white text-3xl font-black mb-1 tracking-tighter">EMERGENCY SOS</Text>
                <Text className="text-police-gold font-black uppercase tracking-[2px] text-xs mb-2">User: {activeAlert.userName} • {calculateDistance()} KM AWAY</Text>
                <Text className="text-white/40 font-bold text-[10px] mb-8">COORD: {activeAlert.lat.toFixed(4)}, {activeAlert.lng.toFixed(4)}</Text>

                <View className="w-full">
                    <View className="mb-4">
                        <PrimaryButton
                            title="I AM RESPONDING"
                            onPress={() => handleResolve('RESOLVED')}
                            variant="primary"
                        />
                    </View>
                    <PrimaryButton
                        title="MARK FALSE ALARM"
                        onPress={() => handleResolve('FALSE_ALARM')}
                        variant="danger"
                    />
                </View>
            </View>
        </View>
    );
}
