import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { useData, Challan } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function VehicleFines() {
    const router = useRouter();
    const { user } = useAuth();
    const { fines, payFine } = useData();
    const [selectedFines, setSelectedFine] = useState<Challan | null>(null);
    const [paymentVisible, setPaymentVisible] = useState(false);

    const userFines = fines;

    const handlePay = (fine: Challan) => {
        setSelectedFine(fine);
        setPaymentVisible(true);
    };

    const confirmPayment = (method: string) => {
        if (!selectedFines) return;

        // Mock processing
        Alert.alert("Processing", `Establishing secure connection with ${method}...`);

        setTimeout(() => {
            payFine(selectedFines.id);
            setPaymentVisible(false);
            Alert.alert(
                "Payment Successful",
                `Receipt #${Date.now()}\nAmount: ${selectedFines.amount}\nStatus: PAID`,
                [{ text: "Download Receipt", onPress: () => { } }, { text: "Close" }]
            );
        }, 1500);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Header title="Traffic Fines" showBack showLogout={false} />

            <FlatList
                data={userFines}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                ListHeaderComponent={() => (
                    <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">Unpaid & Recent History</Text>
                )}
                renderItem={({ item }) => (
                    <View
                        className="bg-white p-6 rounded-[32px] mb-5 shadow-sm border border-gray-100 flex-row justify-between items-center"
                    >
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Ionicons name="car-outline" size={14} color="#0F4C81" className="mr-1" />
                                <Text className="font-black text-police-navy uppercase tracking-tighter text-sm">{item.vehicleNumber}</Text>
                            </View>
                            <Text className="font-bold text-gray-800 text-lg tracking-tight mb-1">{item.reason}</Text>
                            <Text className="text-gray-400 text-xs font-semibold">{item.date}</Text>
                        </View>

                        <View className="items-end">
                            <Text className={`font-black text-2xl mb-2 ${item.status === 'Paid' ? 'text-police-success' : 'text-police-sos'}`}>
                                {item.amount}
                            </Text>

                            {item.status === 'Unpaid' ? (
                                <TouchableOpacity
                                    onPress={() => handlePay(item)}
                                    className="bg-police-navy px-5 py-2.5 rounded-2xl shadow-lg border-b-4 border-police-dark"
                                >
                                    <Text className="text-white font-black text-[10px] uppercase tracking-widest">PAY NOW</Text>
                                </TouchableOpacity>
                            ) : (
                                <View className="bg-police-success/10 px-4 py-2 rounded-xl border border-police-success/20">
                                    <Text className="text-police-success font-black text-[10px] uppercase tracking-widest">PAID</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            />

            {/* Premium Payment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={paymentVisible}
                onRequestClose={() => setPaymentVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-[50px] p-8 pb-12 shadow-2xl">
                        <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />

                        <Text className="text-3xl font-black text-police-navy tracking-tighter mb-2">Secure Checkout</Text>
                        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Choose your payment instrument</Text>

                        <View className="gap-4">
                            {[
                                { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: 'flash' },
                                { id: 'card', name: 'Credit / Debit Card', icon: 'card' },
                                { id: 'nb', name: 'Net Banking', icon: 'business' }
                            ].map(method => (
                                <TouchableOpacity
                                    key={method.id}
                                    onPress={() => confirmPayment(method.name)}
                                    className="flex-row items-center bg-gray-50 p-6 rounded-3xl border border-gray-100"
                                >
                                    <View className="bg-police-navy/5 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name={method.icon as any} size={24} color="#001B3D" />
                                    </View>
                                    <Text className="flex-1 font-black text-police-navy text-lg tracking-tight">{method.name}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#E2E8F0" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => setPaymentVisible(false)}
                            className="mt-8 py-5 items-center"
                        >
                            <Text className="text-gray-400 font-black text-xs uppercase tracking-widest">Cancel Transaction</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
