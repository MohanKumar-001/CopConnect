import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface Props {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "danger" | "outline" | "gold";
}

export default function PrimaryButton({ title, onPress, isLoading, variant = "primary" }: Props) {
    let bgClass = "bg-police-navy";
    let textClass = "text-white";
    let borderClass = "border-b-4 border-police-dark";

    if (variant === "secondary") {
        bgClass = "bg-police-blue";
        borderClass = "border-b-4 border-[#072d56]";
    } else if (variant === "danger") {
        bgClass = "bg-police-sos";
        borderClass = "border-b-4 border-red-900";
    } else if (variant === "gold") {
        bgClass = "bg-police-gold";
        textClass = "text-police-navy";
        borderClass = "border-b-4 border-[#B8860B]";
    } else if (variant === "outline") {
        bgClass = "bg-transparent border-2 border-police-navy";
        textClass = "text-police-navy";
        borderClass = "";
    }


    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={isLoading}
            className={`w-full py-5 rounded-[24px] items-center justify-center my-3 shadow-xl ${bgClass} ${borderClass}`}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 6
            }}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'outline' ? "#001B3D" : "#FFF"} />
            ) : (
                <Text className={`font-black text-sm uppercase tracking-[2px] ${textClass}`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
