import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useData } from "../../context/DataContext";
import StatusBadge from "../../components/StatusBadge";

export default function IntelHistory() {
  const { sightings, complaints } = useData();
  const [activeTab, setActiveTab] = useState<"INTEL" | "CASES">("INTEL");

  const resolvedSightings = useMemo(
    () =>
      sightings.filter(
        (s) =>
          s.status?.toUpperCase() === "RESOLVED" ||
          s.status?.toUpperCase() === "FALSE_ALARM"
      ),
    [sightings]
  );

  const resolvedComplaints = useMemo(
    () =>
      complaints.filter((c) => {
        const status = (c.status || "").toUpperCase();
        return status === "RESOLVED" || status === "REJECTED";
      }),
    [complaints]
  );

  const RenderIntelCard = ({ item }: { item: any }) => (
  <View className="bg-white p-6 rounded-[32px] mb-5 shadow-sm border border-gray-100">
    <View className="flex-row justify-between items-center mb-3">
      <View className="flex-row items-center">
        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        <Text className="text-green-600 font-black text-[10px] uppercase tracking-widest ml-2">
          Apprehended
        </Text>
      </View>
      <Text className="text-gray-400 font-bold text-[10px]">
        {item.timestamp ? String(item.timestamp).split('T')[0] : 'N/A'}
      </Text>
    </View>

    <Text className="text-police-navy font-black text-xl tracking-tight mb-1">
      {item.wantedName}
    </Text>

    <View className="flex-row items-center mb-4">
      <Ionicons name="location" size={12} color="#0F4C81" />
      <Text className="text-police-blue font-bold text-[10px] ml-1">
        {item.location}
      </Text>
    </View>

    <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest mb-2">
        Capture Intelligence
      </Text>
      <Text className="text-police-navy/70 text-xs italic font-medium">
        "{item.description}"
      </Text>
    </View>

    <View className="mt-4 pt-4 border-t border-gray-50 flex-row justify-between items-center">
      <View>
        <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest">
          Resolving Officer
        </Text>
        <Text className="text-police-navy font-bold text-[10px]">
          {item.resolvedBy || 'System'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest">
          Informant Reward
        </Text>
        <Text className="text-police-gold font-bold text-[10px]">DISPATCHED</Text>
      </View>
    </View>
  </View>
);

  const RenderCaseCard = ({ item }: { item: any }) => (
  <View className="bg-white p-6 rounded-[32px] mb-5 shadow-sm border border-gray-100">
    <View className="flex-row justify-between items-center mb-3">
      <StatusBadge status={item.status || "Resolved"} />
      <Text className="text-gray-400 font-bold text-[10px]">
        {item.date ? String(item.date) : 'N/A'}
      </Text>
    </View>

    <Text className="text-police-navy font-black text-xl tracking-tight mb-1">
      {item.title}
    </Text>
    <Text className="text-gray-500 text-sm mb-4 leading-relaxed" numberOfLines={2}>
      {item.description}
    </Text>

    <View className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
      <Text className="text-police-blue font-black text-[8px] uppercase tracking-widest mb-1">
        Administrative Action
      </Text>
      <Text className="text-police-navy/70 text-xs font-semibold">
        Case closed after tactical verification and official filing.
      </Text>
    </View>
  </View>
);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <Header title="Department Archives" showBack showLogout={false} />

      <View className="px-6 py-4">
        <View className="flex-row bg-gray-200 p-1.5 rounded-2xl">
          <TouchableOpacity
            onPress={() => setActiveTab("INTEL")}
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === "INTEL" ? "bg-police-navy" : ""
            }`}
          >
            <Text
              className={`font-bold text-xs ${
                activeTab === "INTEL" ? "text-white" : "text-gray-400"
              }`}
            >
              Intelligence
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("CASES")}
            className={`flex-1 py-3 rounded-xl items-center ${
              activeTab === "CASES" ? "bg-police-navy" : ""
            }`}
          >
            <Text
              className={`font-bold text-xs ${
                activeTab === "CASES" ? "text-white" : "text-gray-400"
              }`}
            >
              Closed Cases
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "INTEL" ? (
        <FlatList
          data={resolvedSightings}
          keyExtractor={(item) => `intel-${item.id}`}
          renderItem={({ item }) => <RenderIntelCard item={item} />}
          contentContainerStyle={{ padding: 24 }}
        />
      ) : (
        <FlatList
          data={resolvedComplaints}
          keyExtractor={(item) => `case-${item.id}`}
          renderItem={({ item }) => <RenderCaseCard item={item} />}
          contentContainerStyle={{ padding: 24 }}
        />
      )}
    </View>
  );
}