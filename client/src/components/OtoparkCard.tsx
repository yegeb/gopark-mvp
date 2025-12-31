import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Parking {
    _id: string;
    name: string;
    district: string;
    neighborhood: string;
    totalCapacity: number;
    currentOccupancy: number;
    pricePerHour: number;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

import { getPricingTiers } from '../utils/PricingUtils';

interface OtoparkCardProps {
    parking: Parking;
    onPress: (parking: Parking) => void;
}

const OtoparkCard: React.FC<OtoparkCardProps> = ({ parking, onPress }) => {
    const occupancyRatio = parking.currentOccupancy / parking.totalCapacity;
    const isFull = occupancyRatio >= 0.9;
    const statusColor = isFull ? '#ff4d4d' : '#4caf50'; // Red for full, Green for available
    const [modalVisible, setModalVisible] = useState(false);

    const pricingTiers = parking ? getPricingTiers(parking.pricePerHour) : [];

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

    return (
        <View style={styles.cardContainer}>
            {/* Status Indicator Bar */}
            <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

            <TouchableOpacity style={styles.cardContent} onPress={() => onPress(parking)}>
                <View style={styles.header}>
                    <Text style={styles.name}>{parking.name}</Text>
                </View>
                
                <Text style={styles.location}>{parking.district}, {parking.neighborhood}</Text>
                
                <View style={styles.infoRow}>
                    <Text style={[styles.occupancy, { color: statusColor }]}>
                        {parking.currentOccupancy} / {parking.totalCapacity} spots
                    </Text>
                </View>
            </TouchableOpacity>
            
            <View style={styles.actionRow}>
                 {/* Pricing Icon Button */}
                <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="pricetag" size={24} color="#007bff" />
                </TouchableOpacity>

                {/* Navigation Icon Button */}
                <TouchableOpacity style={styles.iconButton} onPress={openMaps}>
                    <Ionicons name="navigate-circle" size={28} color="#28a745" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Parking Rates</Text>
                        <Text style={styles.modalSubtitle}>{parking.name}</Text>
                        
                        <View style={styles.table}>
                            {pricingTiers.map((tier, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{tier.duration}</Text>
                                    <Text style={styles.tableCellPrice}>{tier.price} TL</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusBar: {
        width: 6,
        height: '100%'
    },
    cardContent: {
        flex: 1,
        padding: 15,
    },
    actionRow: {
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    iconButton: {
        padding: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    location: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    occupancy: {
        fontSize: 14,
        fontWeight: '600',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%'
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20
    },
    table: {
        width: '100%',
        marginBottom: 25
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    tableCell: {
        fontSize: 16,
        color: '#444'
    },
    tableCellPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff'
    },
    button: {
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    }
});

export default OtoparkCard;
