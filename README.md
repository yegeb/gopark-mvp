# GoPark MVP 🚗🅿️

**Concept Project for AD432 Entrepreneurship Class**

GoPark is a mobile application MVP designed to solve urban parking problems by allowing users to find, filter, and reserve parking spots in real-time.

## 🌟 Key Features

*   **Real-time Map Integration**: Browse ISPARK and independent parking lots across Istanbul (Besiktas, Kadikoy, Sisli, etc.).
*   **Dynamic Occupancy**: View real-time capacity with visual indicators (Green/Red bars).
*   **Smart Reservations**:
    *   Reserve a spot for specific hours.
    *   **Tiered Pricing Model**: Realistic pricing calculation based on duration (similar to ISPARK rates).
    *   **QR Code Tickets**: Automatically generates a QR code for entry/exit scanning.
*   **User Profiles**: Manage profile, vehicles (License Plate, Brand), and view reservation history.
*   **Navigation**: One-tap directions to your reserved parking spot.

## 🛠️ Tech Stack

*   **Frontend**: React Native (Expo), TypeScript
*   **Backend**: Node.js, Express, MongoDB (Mongoose)
*   **Navigation**: React Navigation (Stack & Bottom Tabs)
*   **Features**: `react-native-maps`, `react-native-qrcode-svg`

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   MongoDB Instance (Local or Atlas)
*   Expo Go app on your phone (or Simulator)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yegeb/gopark-mvp.git
    cd gopark-mvp
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create a .env file with your MONGO_URI and JWT_SECRET
    npm run dev
    ```

3.  **Client Setup**
    ```bash
    cd client
    npm install
    npm start
    ```

---
*Built for AD432 - Entrepreneurship*
