import React, { createContext, useContext, useState, useEffect } from "react";
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
    user?: any; // Hidden in User view, used in backend logic
};


export type SOSAlert = {
    id: string;
    userId: string;
    userName: string;
    timestamp: number;
    status: 'ACTIVE' | 'RESOLVED' | 'FALSE_ALARM';
    lat: number;
    lng: number;
};

export type Challan = {
    id: string;
    userId: string; // or user object
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
    triggerSOS: (user: any) => void;
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

    // Auto-refresh interval
    useEffect(() => {
        if (!user?.token) return;
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user]);

    const fetchData = async () => {
        if (!user?.token) return;
        try {
            if (user.role === "USER") {
                const myComplaints = await api.user.getComplaints(user.token);
                setComplaints(Array.isArray(myComplaints) ? myComplaints : []);
                const myRewards = await api.user.getRewards(user.token);
                setRewards(Array.isArray(myRewards) ? myRewards : []);
                const myChallans = await api.user.getChallans(user.token);
                setFines(Array.isArray(myChallans) ? myChallans : []);
                const mySOS = await api.user.getSOS(user.token);
                setSosAlerts(Array.isArray(mySOS) ? mySOS : []);
                const activeWanted = await api.user.getWanted(user.token);
                setWanted(Array.isArray(activeWanted) ? activeWanted : []);
            }
            else if (user.role === "OFFICER") {
                const intelligence = await api.officer.activeIntelligence(user.token);
                const history = await api.officer.intelligenceHistory(user.token);
                const baseIntel = Array.isArray(intelligence) ? intelligence : [];
                const histIntel = Array.isArray(history) ? history : [];
                setSightings([...baseIntel, ...histIntel]);
                const sos = await api.officer.getActiveSOS(user.token);
                setSosAlerts(Array.isArray(sos) ? sos : []);

                const allComplaints = await api.officer.allComplaints(user.token);
                setComplaints(Array.isArray(allComplaints) ? allComplaints : []);

            }
            else if (user.role === "ADMIN") {
                const allSOS = await api.admin.getAllSOS(user.token);
                setSosAlerts(allSOS || []);
                const allOfficers = await api.admin.getOfficers(user.token);
                setOfficers(allOfficers || []);
                const allComplaints = await api.officer.allComplaints(user.token);
                setComplaints(allComplaints || []);
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
        } catch (e) { console.error(e); }
    };

    const updateComplaintStatus = async (id: string, status: string, note?: string) => {
        if (!user?.token) return;
        setComplaints(prev => prev.map(c => c.id.toString() === id.toString() ? { ...c, status, note } : c));
        try {
            await api.officer.updateComplaintStatus(user.token, id, status, note);
            await fetchData();
        } catch (e) { console.error(e); }
    };

    const assignSOS = async (sosId: string, officerId: string) => {
        if (!user?.token) return;
        try {
            await api.admin.assignOfficer(user.token, sosId, officerId);
            fetchData();
        } catch (e) { console.error(e); }
    };

    const updateComplaint = (id: string, updates: Partial<Complaint>) => {
        setComplaints(prev => prev.map(c => c.id.toString() === id.toString() ? { ...c, ...updates } : c));
    };

    const triggerSOS = async (u: any) => {
        if (!user?.token) return;
        try {
            const res = await api.user.triggerSOS(user.token, { lat: 12.9716, lng: 77.5946 });
            setSosAlerts(prev => [res, ...prev]);
        } catch (e) { console.error(e); }
    };

    const resolveSOS = async (alertId: string, status: string) => {
        if (!user?.token) return;
        setSosAlerts(prev => prev.filter(a => a.id.toString() !== alertId.toString()));
        try {
            await api.officer.resolveSOS(user.token, alertId, status);
            await fetchData();
        } catch (e) { console.error(e); }
    };


    const payFine = async (id: string) => {
        if (!user?.token) return;
        setFines(prev => prev.map(f => f.id.toString() === id.toString() ? { ...f, status: 'Paid' } : f));
        try {
            await api.user.payChallan(user.token, id);
        } catch (e) { console.error(e); }
    };

    const reportSighting = async (report: Partial<SightingReport>) => {
        if (!user?.token) return;
        try {
            await api.user.reportSighting(user.token, report);
        } catch (e) { console.error(e); }
    };

    const resolveSighting = async (sightingId: string, suspectId: string, officerId: string, officerName: string) => {
        if (!user?.token) return;
        setCaughtSuspectIds(prev => [...prev, suspectId.toString()]);
        setSightings(prev => prev.filter(s => s.id.toString() !== sightingId.toString() && s.wantedId.toString() !== suspectId.toString()));

        try {
            await api.officer.markCaught(user.token, sightingId, officerName);
            await fetchData();
        } catch (e) { console.error(e); }
    };


    const dismissSighting = async (sightingId: string) => {
        if (!user?.token) return;
        setSightings(prev => prev.filter(s => s.id.toString() !== sightingId.toString()));
        try {
            await api.officer.markFalseAlarm(user.token, sightingId);
            await fetchData();
        } catch (e) { console.error(e); }
    };

    const issueChallan = async (challan: Partial<Challan>) => {
        if (!user?.token) return;
        try {
            await api.officer.issueChallan(user.token, challan);
        } catch (e) { console.error(e); }
    };

    const markRewardAsNotified = async (rewardId: string) => {
        if (!user?.token) return;
        setRewards(prev => prev.map(r => r.id.toString() === rewardId.toString() ? { ...r, isNotified: true } : r));
        try {
            await api.user.acknowledgeReward(user.token, rewardId);
        } catch (e) { console.error(e); }
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

