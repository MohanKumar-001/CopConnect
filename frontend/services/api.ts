import { Platform } from "react-native";

const ENV_SERVER_URL = process.env.EXPO_PUBLIC_API_URL;
export const SERVER_URL = ENV_SERVER_URL && ENV_SERVER_URL.length > 0
    ? ENV_SERVER_URL
    : Platform.OS === "android" ? "http://10.0.2.2:9090" : "http://localhost:9090";
const API_URL = `${SERVER_URL}/api`;

const getHeaders = (token: string) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
});

export const api = {
    // --- User Endpoints ---
    user: {
        getComplaints: async (token: string) => {
            const res = await fetch(`${API_URL}/user/complaints`, { headers: getHeaders(token) });
            return res.json();
        },
        fileComplaint: async (token: string, data: any) => {
            const res = await fetch(`${API_URL}/user/complaint`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });
            return res.json();
        },
        triggerSOS: async (token: string, location: any) => {
            const res = await fetch(`${API_URL}/user/sos`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(location)
            });
            return res.json();
        },
        getSOS: async (token: string) => {
            const res = await fetch(`${API_URL}/user/sos`, { headers: getHeaders(token) });
            return res.json();
        },
        updateSOSLocation: async (token: string, id: string, location: { lat: number; lng: number }) => {
            const res = await fetch(`${API_URL}/user/sos/${id}/location`, {
                method: "PUT",
                headers: getHeaders(token),
                body: JSON.stringify(location)
            });
            if (!res.ok) {
                const message = await res.text();
                throw new Error(`Unable to update SOS location (${res.status}): ${message || "Unknown server error"}`);
            }
            return res.json();
        },
        getChallans: async (token: string) => {
            const res = await fetch(`${API_URL}/user/challans`, { headers: getHeaders(token) });
            return res.json();
        },
        searchChallans: async (token: string, vehicleNumber: string) => {
            const res = await fetch(`${API_URL}/user/challans/search?vehicleNumber=${vehicleNumber}`, { headers: getHeaders(token) });
            return res.json();
        },
        payChallan: async (token: string, id: string) => {
            const res = await fetch(`${API_URL}/user/challan/${id}/pay`, {
                method: "POST",
                headers: getHeaders(token)
            });
            return res.json();
        },
        reportSighting: async (token: string, data: any) => {
            const res = await fetch(`${API_URL}/user/suspect-seen`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });
            return res.json();
        },
        getRewards: async (token: string) => {
            const res = await fetch(`${API_URL}/user/rewards`, { headers: getHeaders(token) });
            return res.json();
        },
        getWanted: async (token: string) => {
            const res = await fetch(`${API_URL}/user/wanted`, { headers: getHeaders(token) });
            return res.json();
        },
        acknowledgeReward: async (token: string, id: string) => {
            const res = await fetch(`${API_URL}/user/reward/${id}/acknowledge`, {
                method: "POST",
                headers: getHeaders(token)
            });
            return res.text();
        }
    },

    // --- Officer Endpoints ---
    officer: {
        allComplaints: async (token: string) => {
            const res = await fetch(`${API_URL}/officer/complaints`, { headers: getHeaders(token) });
            return res.json();
        },
        updateComplaintStatus: async (token: string, id: string, status: string, note?: string) => {
            const res = await fetch(`${API_URL}/officer/complaint/${id}/status`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify({ status, note })
            });
            return res.json();
        },
        getActiveSOS: async (token: string) => {
            const res = await fetch(`${API_URL}/officer/sos-alerts`, { headers: getHeaders(token) });
            return res.json();
        },
        resolveSOS: async (token: string, id: string, status: string) => {
            const res = await fetch(`${API_URL}/officer/sos/${id}/status`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify({ status })
            });
            return res.json();
        },
        activeIntelligence: async (token: string) => {
            const res = await fetch(`${API_URL}/officer/active-intelligence`, { headers: getHeaders(token) });
            return res.json();
        },
        intelligenceHistory: async (token: string) => {
            const res = await fetch(`${API_URL}/officer/intelligence-history`, { headers: getHeaders(token) });
            return res.json();
        },
        markFalseAlarm: async (token: string, id: string) => {

            const res = await fetch(`${API_URL}/officer/alert/${id}/false`, {
                method: "POST",
                headers: getHeaders(token)
            });
            return res.text();
        },
        markCaught: async (token: string, id: string, officerName: string) => {
            const res = await fetch(`${API_URL}/officer/alert/${id}/caught`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify({ officerName })
            });
            return res.text();
        },
        issueChallan: async (token: string, data: any) => {
            const res = await fetch(`${API_URL}/officer/challan`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });
            return res.json();
        },
        searchUserByVehicle: async (token: string, vehicleNumber: string) => {
            const res = await fetch(`${API_URL}/officer/vehicle/${vehicleNumber}`, { headers: getHeaders(token) });
            if (!res.ok) return null;
            return res.json();
        }
    },


    // --- Admin Endpoints ---
    admin: {
        getAllSOS: async (token: string) => {
            const res = await fetch(`${API_URL}/admin/sos-alerts`, { headers: getHeaders(token) });
            return res.json();
        },
        assignOfficer: async (token: string, sosId: string, officerId: string) => {
            const res = await fetch(`${API_URL}/admin/sos/${sosId}/assign`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify({ officerId })
            });
            return res.json();
        },
        getOfficers: async (token: string) => {
            const res = await fetch(`${API_URL}/admin/officers`, { headers: getHeaders(token) });
            return res.json();
        },
        getAllUsers: async (token: string) => {
            const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders(token) });
            return res.json();
        },
        getAllComplaints: async (token: string) => {
            const res = await fetch(`${API_URL}/admin/complaints`, { headers: getHeaders(token) });
            return res.json();
        },
        createOfficer: async (token: string, data: { name: string; email: string; password: string; phoneNumber: string; badgeNumber: string }) => {
            const res = await fetch(`${API_URL}/admin/officers`, {
                method: "POST",
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error((await res.text()) || "Unable to create officer");
            }
            return res.json();
        }
    }
};

