import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import FilterHeader from '../components/FilterHeader';
import OtoparkCard from '../components/OtoparkCard';
import { parkingAPI } from '../api/endpoints';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }: any) => {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<{district?: string, neighborhood?: string}>({});

    const fetchParkings = async () => {
        setLoading(true);
        try {
            const response = await parkingAPI.getAll(filters.district, filters.neighborhood);
            setParkings(response.data);
        } catch (error) {
            console.error('Error fetching parking data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchParkings();
        }, [filters])
    );

    const handleFilterChange = (district: string, neighborhood: string) => {
        setFilters({ district, neighborhood });
    };

    const handleCardPress = (parking: any) => {
        navigation.navigate('Reservation', { parking });
    };

    return (
        <SafeAreaView style={styles.container}>
            <FilterHeader onFilterChange={handleFilterChange} />
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={parkings}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item }) => (
                        <OtoparkCard parking={item} onPress={handleCardPress} />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No parking found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    listContent: { paddingBottom: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#888' }
});

export default HomeScreen;
