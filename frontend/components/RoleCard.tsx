import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface Props {
    role: string;
    selected: boolean;
    onSelect: () => void;
    description: string;
}

export default function RoleCard({ role, selected, onSelect, description }: Props) {
    return (
        <TouchableOpacity
            onPress={onSelect}
            activeOpacity={0.9}
            className={`w-full p-6 rounded-[32px] border-2 my-3 flex-row items-center justify-between shadow-sm ${selected ? "border-police-gold bg-police-lightBlue shadow-xl" : "border-gray-100 bg-white"
                }`}
            style={selected ? { elevation: 10 } : {}}
        >
            <View className="flex-1 pr-4">
                <Text className={`font-black text-xl tracking-tight uppercase ${selected ? "text-police-navy" : "text-gray-400"}`}>
                    {role}
                </Text>
                <Text className={`text-sm mt-2 font-medium leading-relaxed ${selected ? "text-police-blue" : "text-gray-400"}`}>
                    {description}
                </Text>
            </View>
            <View className={`w-8 h-8 rounded-full border-2 items-center justify-center ${selected ? "border-police-gold" : "border-gray-200"}`}>
                {selected && <View className="w-4 h-4 rounded-full bg-police-gold" />}
            </View>
        </TouchableOpacity>
    );
}
