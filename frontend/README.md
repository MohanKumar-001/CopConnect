# CopConnect - Police & Public Safety App

## Overview
A production-grade React Native Expo app for Police and Public interaction. Built with TypeScript, NativeWind, and Expo Router.

## Tech Stack
- **Framework**: React Native Expo (SDK 54)
- **Routing**: Expo Router (File-based)
- **Styling**: NativeWind (Tailwind CSS) v4
- **State Management**: React Context (Auth)
- **Auth**: Mock JWT Service (Ready for Spring Boot integration)

## Features
- **Role-Based Access**:
  - **Citizen**: File complaints, track cases, check fines, SOS.
  - **Officer**: View assignments, issue challans, respond to SOS.
  - **Admin**: Manage users, monitor system.
- **SOS System**: Floating emergency button with mocked response flow.
- **Modern UI**: Police-themed aesthetics with dark accents and gold highlights.

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the App**:
   ```bash
   npx expo start
   ```

3. **API Base URL (recommended)**:
   Set the backend URL for your environment:
   ```bash
   export EXPO_PUBLIC_API_URL="http://localhost:9090"
   ```

3. **Mock Credentials**:
   - **User**: `user@cop.com` / `password`
   - **Officer**: `officer@cop.com` / `password`
   - **Admin**: `admin@cop.com` / `password`

## Project Structure
- `app/`: Expo Router screens (Auth, User, Officer, Admin groups).
- `components/`: Reusable UI components (Buttons, Cards, Inputs).
- `context/`: Global state (Auth).
- `services/`: Mock API services.
- `mock/`: Static production-like data.
- `global.css`: Tailwind directives.

## Future Integration
The `AuthContext` and `services/mockAuth.ts` are designed to be swapped with real Spring Boot API calls. The token structure mimics a standard JWT.
