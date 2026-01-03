import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { reservationAPI } from '../api/endpoints';

const MyReservationsScreen = ({ navigation }: any) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const response = await reservationAPI.getMyReservations();
      setReservations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        setLoading(true);
        fetchReservations();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const handleCancel = (item: any) => {
      const start = new Date(item.startTime);
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
                          const response = await reservationAPI.cancel(item._id);
                          const refundMsg = response.data.refund ? " Refund processed." : " No refund issued.";
                          Alert.alert("Success", "Reservation cancelled." + refundMsg);
                          fetchReservations(); // Refresh list
                      } catch (error: any) {
                          Alert.alert("Error", error.response?.data?.message || "Could not cancel.");
                      }
                  }
              }
          ]
      );
  };

  const renderItem = ({ item }: any) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const isActive = item.status === 'Active';

      const getStatusColor = (status: string) => {
          switch(status) {
              case 'Active': return '#28a745'; // Green
              case 'Completed': return '#3d97e7ff'; // Blue
              case 'Cancelled': return '#dc3545'; // Red
              default: return '#333';
          }
      };

      return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReservationDetails', { reservation: item })}>
            <View style={styles.header}>
                <Text style={styles.parkingName}>{item.parkingId?.name || 'Unknown Parking'}</Text>
                <View style={styles.statusBadge}>
                    <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>
            <Text style={styles.address}>{item.parkingId?.district}, {item.parkingId?.neighborhood}</Text>
            
            <View style={styles.timeContainer}>
                <Text style={styles.date}>{start.toLocaleDateString()}</Text>
                <Text style={styles.time}>{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>

            {isActive && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item)}>
                    <Text style={styles.cancelText}>Cancel Reservation</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
      );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reservations</Text>
      {reservations.length === 0 ? (
          <Text style={styles.emptyText}>No reservations found.</Text>
      ) : (
          <FlatList
            data={reservations}
            renderItem={renderItem}
            keyExtractor={(item: any) => item._id}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' },
  parkingName: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  statusBadge: { backgroundColor: '#f8f9fa', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start' },
  status: { fontWeight: 'bold' },
  
  address: { color: '#666', marginBottom: 10 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, marginBottom: 10 },
  date: { fontWeight: 'bold' },
  time: { color: '#007bff' },

  cancelButton: {
      backgroundColor: '#fee2e2',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 5,
      borderWidth: 1,
      borderColor: '#fecaca'
  },
  cancelText: { color: '#dc2626', fontWeight: 'bold' }
});

export default MyReservationsScreen;
