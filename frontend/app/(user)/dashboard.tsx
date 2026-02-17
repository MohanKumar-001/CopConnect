import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Alert, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import DashboardCard from "../../components/DashboardCard";
import SOSButton from "../../components/SOSButton";
import { useAuth } from "../../context/AuthContext";
import { useData, RewardLog } from "../../context/DataContext";
import PrimaryButton from "../../components/PrimaryButton";

const ConfettiParticle = ({ delay }: { delay: number }) => {
    const anim = useRef(new Animated.Value(0)).current;

    // Random properties
    const angle = Math.random() * 360;
    const distance = 100 + Math.random() * 200;
    const size = 6 + Math.random() * 8;
    const color = ['#D4AF37', '#FFD700', '#F44336', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 5)];

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
                toValue: 1,
                duration: 1000 + Math.random() * 1000,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.cos(angle) * distance]
    });

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.sin(angle) * distance + 200] // Add gravity
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [1, 1, 0]
    });

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${360 + Math.random() * 360}deg`]
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: -50,
                left: 0,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: size / 2,
                opacity,
                transform: [
                    { translateX },
                    { translateY },
                    { rotate }
                ]
            }}
        />
    );
};

export default function UserDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { triggerSOS, rewards, markRewardAsNotified, complaints, fines, wanted } = useData();
    const [rewardToShow, setRewardToShow] = useState<RewardLog | null>(null);

    useEffect(() => {
        const pendingReward = rewards.find(r => !r.isNotified);
        if (pendingReward) {
            setRewardToShow(pendingReward);
        }
    }, [rewards]);

    const handleAcknowledgeReward = () => {
        if (rewardToShow) {
            markRewardAsNotified(rewardToShow.id);
            setRewardToShow(null);
        }
    };

    const handleSOS = () => {
        triggerSOS(user);
        Alert.alert(
            "SOS ALERT SENT!",
            "Emergency services have been notified and officers are tracking your location.",
            [{ text: "OK", style: "destructive" }]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="CopConnect" subtitle={`Authenticated: ${user?.name || 'Citizen'}`} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-2xl font-black text-police-navy tracking-tight">Prime Services</Text>
                    <TouchableOpacity>
                        <Text className="text-police-blue font-bold text-xs uppercase tracking-widest">Active Duty</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap justify-between items-start">
                    <DashboardCard
                        title="File Complaint"
                        count="+"
                        icon={<Ionicons name="document-text" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(user)/file-complaint")}
                    />
                    <DashboardCard
                        title="Track Case"
                        count={`${complaints.length}`}
                        icon={<Ionicons name="location" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(user)/track-case")}
                    />
                    <DashboardCard
                        title="Traffic Fines"
                        count={`${fines.filter(f => f.status === 'Unpaid').length}`}
                        icon={<Ionicons name="card" size={26} color="#001B3D" />}
                        onPress={() => router.push("/(user)/vehicle-fines")}
                    />
                    <DashboardCard
                        title="Wanted"
                        count={`${wanted.length}`}
                        icon={<Ionicons name="warning" size={26} color="#DC2626" />}
                        onPress={() => router.push("/(user)/wanted")}
                        color="bg-red-50/50"
                    />
                </View>


                <View className="mt-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <View className="flex-row items-center mb-2">
                        <View className="bg-police-gold/20 p-2 rounded-lg mr-3">
                            <Ionicons name="bulb" size={20} color="#D4AF37" />
                        </View>
                        <Text className="font-black text-police-navy uppercase tracking-widest text-xs">Security Advisory</Text>
                    </View>
                    <Text className="text-gray-600 text-sm leading-relaxed font-medium">Protect your identity online. Never share your OTP or sensitive police credentials with anyone.</Text>
                </View>
            </ScrollView>

            {/* Reward Notification Modal */}
            <Modal
                transparent={true}
                visible={!!rewardToShow}
                animationType="fade"
            >
                <View className="flex-1 items-center justify-center bg-police-navy/90 px-8">
                    <View className="bg-white w-full rounded-[48px] p-8 items-center shadow-2xl overflow-hidden relative">

                        {/* Confetti Blast Layer */}
                        <View style={{ position: 'absolute', top: 50, left: '50%', zIndex: 0 }}>
                            {rewardToShow && Array.from({ length: 40 }).map((_, i) => (
                                <ConfettiParticle key={i} delay={i * 20} />
                            ))}
                        </View>

                        <View className="bg-police-gold/20 p-6 rounded-full mb-6 z-10">
                            <Ionicons name="trophy" size={60} color="#D4AF37" />
                        </View>

                        <Text className="text-police-navy font-black text-3xl text-center tracking-tighter mb-2 z-10">Congratulations!</Text>
                        <Text className="text-gray-500 text-center font-bold px-4 leading-relaxed mb-8 z-10">
                            You have received a reward of
                            <Text className="text-police-gold font-black text-xl"> {rewardToShow?.amount}</Text>
                        </Text>

                        <View className="w-full z-10">
                            <PrimaryButton
                                title="CLAIM REWARD"
                                onPress={handleAcknowledgeReward}
                            />
                        </View>

                        <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-6 z-10">Credited to registered account</Text>
                    </View>
                </View>
            </Modal>

            <SOSButton onPress={handleSOS} />
        </View>
    );
}
