import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Linking, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { calculateParkingFee } from '../utils/PricingUtils';
import { reservationAPI } from '../api/endpoints';

const ReservationDetailsScreen = ({ route, navigation }: any) => {
    const { reservation } = route.params;
    const [parking] = useState(reservation.parkingId);
    
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);
    
    // Calculate Fee
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalPrice = calculateParkingFee(parking.pricePerHour, durationHours);

    const isActive = reservation.status === 'Active';

    const openMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${parking.coordinates.latitude},${parking.coordinates.longitude}`;
        const label = parking.name;
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
    
        if (url) {
            Linking.openURL(url);
        }
    };

    const handleCancel = () => {
        const timeDiff = start.getTime() - new Date().getTime();
        const hoursRemaining = timeDiff / (1000 * 60 * 60);

        let alertTitle = "Cancel Reservation";
        let alertMessage = "Cancelling this reservation will issue a full refund. Do you want to continue?";
        
        if (hoursRemaining < 2) {
             alertTitle = "Late Cancellation";
             alertMessage = "You are cancelling within 2 hours of the start time. No refund will be provided. Proceed anyway?";
        }

        Alert.alert(
            alertTitle,
            alertMessage,
            [
                { text: "No", style: "cancel" },
                { 
                    text: "Yes, Cancel", 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await reservationAPI.cancel(reservation._id);
                            const refundMsg = response.data.refund ? " Refund processed." : " No refund issued.";
                            Alert.alert("Success", "Reservation cancelled." + refundMsg);
                            navigation.goBack(); 
                        } catch (error: any) {
                            Alert.alert("Error", error.response?.data?.message || "Could not cancel.");
                        }
                    }
                }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return '#28a745'; // Green
            case 'Completed': return '#3d97e7ff'; // Blue
            case 'Cancelled': return '#dc3545'; // Red
            default: return '#333';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.title}>Reservation Details</Text>
                    <Text style={[styles.status, { color: getStatusColor(reservation.status) }]}>
                        {reservation.status === 'Active' ? 'Reservation Confirmed!' : reservation.status}
                    </Text>

                    <Text style={styles.parkingName}>{parking.name}</Text>
                    <Text style={styles.info}>{parking.district}, {parking.neighborhood}</Text>
                    
                    <Text style={styles.successInfo}>
                        {start.toLocaleDateString()}
                        {'\n'}
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    
                    <View style={styles.qrContainer}>
                        <QRCode 
                            value={JSON.stringify({ 
                                id: reservation._id, 
                                park: parking.name, 
                                start: start.toISOString(),
                                end: end.toISOString(),
                                fee: totalPrice
                            })}
                            size={180}
                        />
                        <Text style={styles.qrLabel}>Scan at Entry</Text>
                        {isActive && (
                            <Text style={styles.warningText}>
                                Please scan the QR code within 15 minutes of your reservation start time. If not, your reservation will be canceled.
                            </Text>
                        )}
                    </View>
                    
                    <View style={styles.feeContainer}>
                         <Text style={styles.feeLabel}>Total Fee</Text>
                         <Text style={styles.feeAmount}>{totalPrice} TL</Text>
                    </View>

                    <Button title="Get Directions" onPress={openMaps} />
                    
                    {isActive && (
                        <View style={{ marginTop: 20, width: '100%' }}>
                            <Button title="Cancel Reservation" color="#dc3545" onPress={handleCancel} />
                            <Text style={styles.policyNote}>
                                To ensure availability for all users, cancellations made less than 2 hours before the reservation start time are non-refundable.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContent: { padding: 20 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    status: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    
    parkingName: { fontSize: 26, color: '#007bff', marginBottom: 5, textAlign: 'center', fontWeight: 'bold' },
    info: { fontSize: 16, color: '#666', marginBottom: 20 },
    
    successInfo: { textAlign: 'center', marginBottom: 20, fontSize: 18, color: '#333', fontWeight: '500' },
    
    qrContainer: { padding: 20, backgroundColor: 'white', borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, marginBottom: 20, alignItems: 'center' },
    qrLabel: { marginTop: 10, color: '#666', fontWeight: '600' },

    feeContainer: { marginBottom: 20, alignItems: 'center' },
    feeLabel: { fontSize: 16, color: '#666' },
    feeAmount: { fontSize: 24, fontWeight: 'bold', color: '#28a745' },

    policyNote: { marginTop: 15, fontSize: 13, color: '#666', textAlign: 'center', fontStyle: 'italic' },
    
    warningText: { color: '#dc3545', textAlign: 'center', fontSize: 14, marginTop: 10, paddingHorizontal: 10 }
});

export default ReservationDetailsScreen;
