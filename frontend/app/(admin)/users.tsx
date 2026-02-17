import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function UserManagement() {
    const router = useRouter();
    const { user } = useAuth();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.admin.getAllUsers(user!.token!);
            setUsersList(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Personnel" subtitle="System Registry" showBack showLogout={false} />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#001B3D" />
                </View>
            ) : (
                <FlatList
                    data={usersList}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 24 }}
                    renderItem={({ item }) => (
                        <View className="bg-white p-6 rounded-[32px] mb-5 shadow-sm border border-gray-50 flex-row items-center">
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${item.role === 'ADMIN' ? 'bg-police-gold/20' :
                                    item.role === 'OFFICER' ? 'bg-police-blue/10' : 'bg-gray-100'
                                }`}>
                                <Ionicons
                                    name={item.role === 'ADMIN' ? 'ribbon' : item.role === 'OFFICER' ? 'shield' : 'person'}
                                    size={24}
                                    color={item.role === 'ADMIN' ? '#B8860B' : item.role === 'OFFICER' ? '#0F4C81' : '#64748B'}
                                />
                            </View>

                            <View className="flex-1">
                                <Text className="font-black text-police-navy text-xl tracking-tight leading-tight">{item.name}</Text>
                                <Text className="text-gray-400 font-bold text-xs mb-2">{item.email}</Text>
                                <View className="flex-row items-center">
                                    <View className={`px-3 py-1 rounded-full ${item.role === 'ADMIN' ? 'bg-police-gold' :
                                            item.role === 'OFFICER' ? 'bg-police-navy' : 'bg-gray-200'
                                        }`}>
                                        <Text className={`text-[8px] font-black uppercase tracking-widest ${item.role === 'USER' ? 'text-gray-500' : 'text-white'
                                            }`}>{item.role}</Text>
                                    </View>
                                    <Text className="text-gray-300 mx-2">•</Text>
                                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ID: {item.id}</Text>
                                </View>
                            </View>

                            <TouchableOpacity className="bg-gray-50 w-10 h-10 rounded-xl items-center justify-center border border-gray-100">
                                <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

