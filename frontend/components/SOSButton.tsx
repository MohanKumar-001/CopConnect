import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    onPress: () => void;
}

export default function SOSButton({ onPress }: Props) {
    const insets = useSafeAreaInsets();
    const pulseAnim = useRef(new Animated.Value(1)).current;

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

    return (
        <View style={{
            position: 'absolute',
            bottom: Math.max(insets.bottom, 20),
            alignSelf: 'center',
            zIndex: 100
        }}>
            {/* Pulsing Royal Glow */}
            <Animated.View style={{
                position: 'absolute',
                width: 90, height: 90,
                backgroundColor: '#DC2626',
                borderRadius: 45,
                opacity: 0.25,
                top: -5, left: -5,
                transform: [{ scale: pulseAnim }]
            }} />

            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className="w-20 h-20 bg-police-sos rounded-full items-center justify-center border-[6px] border-white shadow-2xl"
                style={{
                    elevation: 15,
                    shadowColor: "#DC2626",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                }}
            >
                <Text className="text-white font-black text-xl tracking-tighter">SOS</Text>
            </TouchableOpacity>
        </View>
    );
}
