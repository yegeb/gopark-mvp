import React, { useContext } from 'react';
import { Image, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyReservationsScreen from './src/screens/MyReservationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReservationScreen from './src/screens/ReservationScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ReservationsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const HeaderLogo = () => (
    <View style={{ marginLeft: 2 }}> 
        <Image 
            source={require('./assets/gopark_logo.png')} 
            style={{ width: 80, height: 30 }} 
            resizeMode="contain" 
        />
    </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const HomeStackNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen 
            name="Return" 
            component={HomeScreen} 
            options={{
                headerTitle: 'Home',
                headerLeft: () => <HeaderLogo />,
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
                headerTitleStyle: { fontWeight: 'bold' },
                headerBackVisible: false, 
            }} 
        />
        <HomeStack.Screen name="Reservation" component={ReservationScreen} />
    </HomeStack.Navigator>
);

import ReservationDetailsScreen from './src/screens/ReservationDetailsScreen';

const ReservationsStackNavigator = () => (
    <ReservationsStack.Navigator>
        <ReservationsStack.Screen 
            name="MyReservationsMain" 
            component={MyReservationsScreen} 
            options={{
                headerTitle: 'My Reservations',
                headerLeft: () => <HeaderLogo />,
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
                headerTitleStyle: { fontWeight: 'bold' },
                headerBackVisible: false,
            }} 
        />
        <ReservationsStack.Screen 
            name="ReservationDetails" 
            component={ReservationDetailsScreen} 
            options={{ title: 'Ticket Details', headerBackTitle: '' }}
        />
    </ReservationsStack.Navigator>
);

const ProfileStackNavigator = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen 
            name="ProfileMain" 
            component={ProfileScreen} 
            options={{
                headerTitle: 'Profile',
                headerLeft: () => <HeaderLogo />,
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
                headerTitleStyle: { fontWeight: 'bold' },
                headerBackVisible: false,
            }} 
        />
    </ProfileStack.Navigator>
);

import { Ionicons } from '@expo/vector-icons';

// ...

const AppNavigator = () => (
  <AppStack.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'My Reservations') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
            iconName = 'help'; // Fallback
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <AppStack.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ headerShown: false }}
    />
    <AppStack.Screen 
        name="My Reservations" 
        component={ReservationsStackNavigator} 
        options={{ headerShown: false }}
    />
    <AppStack.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
        options={{ headerShown: false }}
    />
  </AppStack.Navigator>
);

const Navigation = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        // We could render a Splash Screen here
        return null; 
    }

    return (
        <NavigationContainer>
            {userToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

export default function App() {
  return (
    <AuthProvider>
        <SafeAreaProvider>
            <Navigation />
            <StatusBar style="auto" />
        </SafeAreaProvider>
    </AuthProvider>
  );
}
