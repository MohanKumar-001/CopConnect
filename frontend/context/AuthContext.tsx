import React, { createContext, useContext, useState, useEffect } from "react";
import { router } from "expo-router";
import { Platform } from "react-native";
const SERVER_URL = Platform.OS === "android" ? "http://10.0.2.2:9090" : "http://localhost:9090";
const API_URL = `${SERVER_URL}/api/auth`;

export type User = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "OFFICER" | "ADMIN"; // Backend returns uppercase
    token?: string;
    phoneNumber?: string;
    vehicleNumber?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (data: any) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async (email: string, pass: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass }),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();
            const role = data.user.role; // Backend "USER", "OFFICER"
            const userData = { ...data.user, token: data.token, role: role };
            setUser(userData);

            if (role === "ADMIN") router.replace("/(admin)/dashboard");
            else if (role === "OFFICER") router.replace("/(officer)/dashboard");
            else router.replace("/(user)/dashboard");
        } catch (error: any) {
            alert("Login Failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (data: any) => {
        setIsLoading(true);
        try {
            const role = data.role.toLowerCase();
            const response = await fetch(`${API_URL}/register/${role}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || "Registration Failed");
            }

            alert("Registration Successful! Please login.");
            router.replace("/(auth)/login");
        } catch (error: any) {
            alert("Registration Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const signOut = () => {
        setUser(null);
        router.replace("/(auth)/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
