import React, { createContext, useContext, useState, useEffect } from "react";
import * as Location from "expo-location";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

export type Complaint = {
    id: string;
    title: string;
    description: string;
    userName: string;
    status: string;
    date: string;
    note?: string;
    user?: any;
};

export type SOSAlert = {
    id: string;
    userId: string;
    userName: string;
    timestamp: number;
    locationUpdatedAt?: string;
    status: 'ACTIVE' | 'RESOLVED' | 'FALSE_ALARM';
    lat: number;
    lng: number;
};

export type Challan = {
    id: string;
    userId: string;
    vehicleNumber: string;
    reason: string;
    amount: string;
    date: string;
    status: 'Unpaid' | 'Paid';
    paymentId?: string;
    paymentDate?: string;
};

export type SightingReport = {
    id: string;
    wantedId: string;
    wantedName: string;
    reward: string;
    userId: string;
    userName: string;
    timestamp: number;
    location: string;
    description: string;
    status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'FALSE_ALARM';
    resolvedBy?: string;
    resolvedAt?: number;
};

export type WantedPerson = {
    id: string;
    name: string;
    description: string;
    reward: string;
    image: string;
    status: 'ACTIVE' | 'CAUGHT';
};

export type RewardLog = {
    id: string;
    sightingId: string;
    recipientId: string;
    recipientName: string;
    amount: string;
    timestamp: number;
    isNotified: boolean;
};

type DataContextType = {
    complaints: Complaint[];
    sosAlerts: SOSAlert[];
    fines: Challan[];
    sightings: SightingReport[];
    wanted: WantedPerson[];
    rewards: RewardLog[];
    caughtSuspectIds: string[];
    officers: any[];
    addComplaint: (complaint: Partial<Complaint>) => void;
    triggerSOS: () => Promise<boolean>;
    assignSOS: (sosId: string, officerId: string) => void;
    resolveSOS: (alertId: string, status: string) => void;
    updateComplaint: (id: string, updates: Partial<Complaint>) => void;
    updateComplaintStatus: (id: string, status: string, note?: string) => void;
    payFine: (id: string) => void;
    reportSighting: (report: Partial<SightingReport>) => void;
    resolveSighting: (sightingId: string, suspectId: string, officerId: string, officerName: string) => void;
    dismissSighting: (sightingId: string) => void;
    issueChallan: (challan: Partial<Challan>) => void;
    markRewardAsNotified: (rewardId: string) => void;
    fetchData: () => Promise<void>;
};

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useAuth();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
    const [fines, setFines] = useState<Challan[]>([]);
    const [sightings, setSightings] = useState<SightingReport[]>([]);
    const [wanted, setWanted] = useState<WantedPerson[]>([]);
    const [rewards, setRewards] = useState<RewardLog[]>([]);
    const [caughtSuspectIds, setCaughtSuspectIds] = useState<string[]>([]);
    const [officers, setOfficers] = useState<any[]>([]);
    const [activeSOSId, setActiveSOSId] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.token) return;

        fetchData();

        const interval = setInterval(fetchData, 10000);

        return () => clearInterval(interval);

    }, [user]);

    const fetchData = async () => {

        if (!user?.token) return;

        try {

            if (user.role === "USER") {

                const [myComplaints, myRewards, myChallans, mySOS, activeWanted] = await Promise.all([
                    api.user.getComplaints(user.token),
                    api.user.getRewards(user.token),
                    api.user.getChallans(user.token),
                    api.user.getSOS(user.token),
                    api.user.getWanted(user.token)
                ]);

                setComplaints(Array.isArray(myComplaints) ? myComplaints : []);
                setRewards(Array.isArray(myRewards) ? myRewards : []);
                setFines(Array.isArray(myChallans) ? myChallans : []);
                setSosAlerts(Array.isArray(mySOS) ? mySOS : []);
                setWanted(Array.isArray(activeWanted) ? activeWanted : []);

            }

            else if (user.role === "OFFICER") {

                const [intelligence, history, sos, allComplaints] = await Promise.all([
                    api.officer.activeIntelligence(user.token),
                    api.officer.intelligenceHistory(user.token),
                    api.officer.getActiveSOS(user.token),
                    api.officer.allComplaints(user.token)
                ]);

                const baseIntel = Array.isArray(intelligence) ? intelligence : [];
                const histIntel = Array.isArray(history) ? history : [];

                setSightings([...baseIntel, ...histIntel]);
                setSosAlerts(Array.isArray(sos) ? sos : []);
                setComplaints(Array.isArray(allComplaints) ? allComplaints : []);

            }

            else if (user.role === "ADMIN") {

                const results = await Promise.allSettled([
                    api.admin.getAllSOS(user.token),
                    api.admin.getOfficers(user.token),
                    api.admin.getAllComplaints(user.token)
                ]);

                const [sosResult, officersResult, complaintsResult] = results;

                if (sosResult.status === "fulfilled") {
                    const allSOS = sosResult.value;
                    setSosAlerts(Array.isArray(allSOS) ? allSOS : []);
                }
                else {
                    setSosAlerts([]);
                }

                if (officersResult.status === "fulfilled") {
                    const allOfficers = officersResult.value;
                    // Safe officer extraction without changing logic
                    if (Array.isArray(allOfficers)) {
                        setOfficers(allOfficers);
                    }
                    else if (Array.isArray(allOfficers?.data)) {
                        setOfficers(allOfficers.data);
                    }
                    else if (Array.isArray(allOfficers?.officers)) {
                        setOfficers(allOfficers.officers);
                    }
                    else {
                        setOfficers([]);
                    }
                }
                else {
                    setOfficers([]);
                }

                if (complaintsResult.status === "fulfilled") {
                    const allComplaints = complaintsResult.value;
                    setComplaints(Array.isArray(allComplaints) ? allComplaints : []);
                }
                else {
                    setComplaints([]);
                }

            }

        } catch (e) {

            console.log("Fetch Error", e);

        }

    };

    const addComplaint = async (complaint: Partial<Complaint>) => {

        if (!user?.token) return;

        try {

            const res = await api.user.fileComplaint(user.token, complaint);

            setComplaints(prev => [res, ...prev]);

        } catch (e) {

            console.error(e);

        }

    };

    const updateComplaintStatus = async (id: string, status: string, note?: string) => {

        if (!user?.token) return;

        setComplaints(prev =>
            prev.map(c =>
                c.id.toString() === id.toString()
                    ? { ...c, status, note }
                    : c
            )
        );

        try {

            await api.officer.updateComplaintStatus(user.token, id, status, note);

            await fetchData();

        } catch (e) {

            console.error(e);

        }

    };

    const assignSOS = async (sosId: string, officerId: string) => {

        if (!user?.token) return;

        try {

            await api.admin.assignOfficer(user.token, sosId, officerId);

            fetchData();

        } catch (e) {

            console.error(e);

        }

    };

    const updateComplaint = (id: string, updates: Partial<Complaint>) => {

        setComplaints(prev =>
            prev.map(c =>
                c.id.toString() === id.toString()
                    ? { ...c, ...updates }
                    : c
            )
        );

    };

    const triggerSOS = async (): Promise<boolean> => {

        if (!user?.token) return false;

        try {

            const permission = await Location.requestForegroundPermissionsAsync();
            if (permission.status !== "granted") {
                throw new Error("Location permission is required to send an SOS alert.");
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const res = await api.user.triggerSOS(user.token, {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

            setSosAlerts(prev => [res, ...prev]);
            setActiveSOSId(res.id.toString());
            return true;

        } catch (e: any) {

            console.error(e);
            throw new Error(e.message || "Unable to send SOS alert");

        }

    };

    useEffect(() => {
        if (!user?.token || user.role !== "USER" || !activeSOSId) return;

        let subscription: Location.LocationSubscription | undefined;
        let cancelled = false;

        const beginLiveTracking = async () => {
            subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                async (position) => {
                    try {
                        const updatedAlert = await api.user.updateSOSLocation(user.token!, activeSOSId, {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        if (!cancelled) {
                            setSosAlerts(current => current.map(alert =>
                                alert.id.toString() === activeSOSId ? updatedAlert : alert
                            ));
                        }
                    } catch (error) {
                        console.error("Live SOS location update failed", error);
                    }
                }
            );
        };

        beginLiveTracking().catch(error => console.error("Unable to start live SOS tracking", error));

        return () => {
            cancelled = true;
            subscription?.remove();
        };
    }, [activeSOSId, user?.token]);

    useEffect(() => {
        if (activeSOSId && !sosAlerts.some(alert => alert.id.toString() === activeSOSId && alert.status === "ACTIVE")) {
            setActiveSOSId(null);
        }
    }, [activeSOSId, sosAlerts]);

    const resolveSOS = async (alertId: string, status: string) => {

        if (!user?.token) return;

        setSosAlerts(prev =>
            prev.filter(a => a.id.toString() !== alertId.toString())
        );

        try {

            await api.officer.resolveSOS(user.token, alertId, status);

            await fetchData();

        } catch (e) {

            console.error(e);

        }

    };

    const payFine = async (id: string) => {

        if (!user?.token) return;

        setFines(prev =>
            prev.map(f =>
                f.id.toString() === id.toString()
                    ? { ...f, status: 'Paid' }
                    : f
            )
        );

        try {

            await api.user.payChallan(user.token, id);

        } catch (e) {

            console.error(e);

        }

    };

    const reportSighting = async (report: Partial<SightingReport>) => {

        if (!user?.token) return;

        try {

            await api.user.reportSighting(user.token, report);

        } catch (e) {

            console.error(e);

        }

    };

    const resolveSighting = async (sightingId: string, suspectId: string, officerId: string, officerName: string) => {

        if (!user?.token) return;

        setCaughtSuspectIds(prev => [...prev, suspectId.toString()]);

        setSightings(prev =>
            prev.filter(s =>
                s.id.toString() !== sightingId.toString()
                && s.wantedId.toString() !== suspectId.toString()
            )
        );

        try {

            await api.officer.markCaught(user.token, sightingId, officerName);

            await fetchData();

        } catch (e) {

            console.error(e);

        }

    };

    const dismissSighting = async (sightingId: string) => {

        if (!user?.token) return;

        setSightings(prev =>
            prev.filter(s => s.id.toString() !== sightingId.toString())
        );

        try {

            await api.officer.markFalseAlarm(user.token, sightingId);

            await fetchData();

        } catch (e) {

            console.error(e);

        }

    };

    const issueChallan = async (challan: Partial<Challan>) => {

        if (!user?.token) return;

        try {

            await api.officer.issueChallan(user.token, challan);

        } catch (e) {

            console.error(e);

        }

    };

    const markRewardAsNotified = async (rewardId: string) => {

        if (!user?.token) return;

        setRewards(prev =>
            prev.map(r =>
                r.id.toString() === rewardId.toString()
                    ? { ...r, isNotified: true }
                    : r
            )
        );

        try {

            await api.user.acknowledgeReward(user.token, rewardId);

        } catch (e) {

            console.error(e);

        }

    };

    return (

        <DataContext.Provider value={{
            complaints,
            sosAlerts,
            fines,
            sightings,
            wanted,
            rewards,
            caughtSuspectIds,
            officers,
            addComplaint,
            triggerSOS,
            assignSOS,
            resolveSOS,
            updateComplaint,
            updateComplaintStatus,
            payFine,
            reportSighting,
            resolveSighting,
            dismissSighting,
            issueChallan,
            markRewardAsNotified,
            fetchData
        }}>

            {children}

        </DataContext.Provider>

    );

};
