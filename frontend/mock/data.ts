export const MOCK_USERS = [
    {
        id: "1",
        name: "John Citizen",
        email: "user@cop.com",
        password: "password",
        role: "user",
        aadhaar: "1234-5678-9012",
        phoneNumber: "9876543210",
        vehicleNumber: "KA-01-AB-1234"
    },
    {
        id: "2",
        name: "Officer Smith",
        email: "officer@cop.com",
        password: "password",
        role: "officer",
        badgeNumber: "BADGE-001",
        phoneNumber: "9988776655"
    },
    {
        id: "3",
        name: "Admin Super",
        email: "admin@cop.com",
        password: "password",
        role: "admin"
    }
];

export const MOCK_COMPLAINTS = [
    {
        id: "C-1001",
        userId: "1",
        title: "Stolen Bike",
        description: "My bike was stolen from the market.",
        status: "Pending", // Pending, Investigating, Resolved
        date: "2023-10-25"
    },
    {
        id: "C-1002",
        userId: "1",
        title: "Noise Complaint",
        description: "Loud party next door.",
        status: "Resolved",
        date: "2023-10-20"
    }
];

export const MOCK_WANTED = [
    {
        id: "W-1",
        name: "Bad Guy",
        description: "Wanted for bank robbery.",
        reward: "₹50,000",
        image: "https://via.placeholder.com/150"
    }
];
