import React from "react";
import { View, Text } from "react-native";

export default function StatusBadge({ status }: { status: any }) {
    const rawStatus = typeof status === 'string' ? status : "UNKNOWN";
    let colorClass = "bg-gray-100 text-gray-700";

    switch (rawStatus.toLowerCase()) {
        case 'resolved': colorClass = "bg-green-100 text-green-700"; break;
        case 'pending': colorClass = "bg-yellow-100 text-yellow-700"; break;
        case 'investigating':
        case 'in_progress': colorClass = "bg-blue-100 text-blue-700"; break;
        case 'rejected': colorClass = "bg-red-100 text-red-700"; break;
    }


    return (
        <View className={`px-2 py-1 rounded-full ${colorClass.split(' ')[0]}`}>
            <Text className={`text-xs font-bold ${colorClass.split(' ')[1]}`}>{rawStatus}</Text>
        </View>
    );

}
