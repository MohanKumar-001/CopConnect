import { MOCK_USERS } from "../mock/data";

// Simulates a JWT token structure
const generateMockToken = (user: any) => {
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${user.id}Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsIm5hbWUiOiIke3VzZXIubmFtZX0ifQ.SIGNATURE`;
};

export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email && u.password === password);
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

export const register = async (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser = { ...userData, id: Math.random().toString() };
            MOCK_USERS.push(newUser);
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
