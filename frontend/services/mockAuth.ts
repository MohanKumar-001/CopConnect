import { MOCK_USERS } from "../mock/data";

type MockRole = "user" | "officer" | "admin";

type MockUser = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: MockRole;
    aadhaar?: string;
    phoneNumber?: string;
    vehicleNumber?: string;
    badgeNumber?: string;
};

type MockAuthResult = {
    token: string;
    user: Omit<MockUser, "password">;
};

const mockUsers = MOCK_USERS as MockUser[];

// Simulates a JWT token structure
const generateMockToken = (user: MockUser): string => {
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${user.id}Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsIm5hbWUiOiIke3VzZXIubmFtZX0ifQ.SIGNATURE`;
};

export const login = async (email: string, password: string): Promise<MockAuthResult> => {
    return new Promise<MockAuthResult>((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(user => user.email === email && user.password === password);
            if (user) {
                resolve({
                    token: generateMockToken(user),
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                reject(new Error("Invalid credentials"));
            }
        }, 1000); // Simulate network delay
    });
};

export const register = async (userData: Omit<MockUser, "id">): Promise<MockAuthResult> => {
    return new Promise<MockAuthResult>((resolve) => {
        setTimeout(() => {
            const newUser = { ...userData, id: Math.random().toString() };
            mockUsers.push(newUser);
            resolve({
                token: generateMockToken(newUser),
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        }, 1000);
    });
};
