import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../api/endpoints';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [carBrand, setCarBrand] = useState('');

  const fetchUser = async () => {
      try {
          const response = await authAPI.getUser();
          setUser(response.data);
          setFullName(response.data.fullName);
          setPhoneNumber(response.data.phoneNumber);
          setPlateNumber(response.data.plateNumber);
          setCarBrand(response.data.carBrand);
      } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Could not load profile');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
        const updateData = { fullName, phoneNumber, plateNumber, carBrand };
        const res = await authAPI.updateProfile(updateData);
        setUser(res.data); // Update local user state with result
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Could not update profile');
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return (
          <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#007bff" />
          </View>
      )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
          <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                      <Ionicons name="person" size={50} color="white" />
                  </View>
                  {isEditing ? (
                      <TextInput 
                          style={[styles.input, styles.nameInput]} 
                          value={fullName} 
                          onChangeText={setFullName}
                          placeholder="Full Name"
                      />
                  ) : (
                      <Text style={styles.name}>{user.fullName}</Text>
                  )}
                  <Text style={styles.email}>{user.email}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="car-sport" size={20} color="#007bff" />
                      </View>
                      <View style={styles.textContainer}>
                          <Text style={styles.label}>Car Brand</Text>
                           {isEditing ? (
                              <TextInput 
                                  style={styles.input} 
                                  value={carBrand} 
                                  onChangeText={setCarBrand} 
                              />
                          ) : (
                              <Text style={styles.value}>{carBrand}</Text>
                          )}
                      </View>
                  </View>

                  <View style={styles.infoRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="call" size={20} color="#007bff" />
                      </View>
                      <View style={styles.textContainer}>
                          <Text style={styles.label}>Phone Number</Text>
                          {isEditing ? (
                              <TextInput 
                                  style={styles.input} 
                                  value={phoneNumber} 
                                  onChangeText={setPhoneNumber} 
                                  keyboardType="phone-pad"
                              />
                          ) : (
                              <Text style={styles.value}>{phoneNumber}</Text>
                          )}
                      </View>
                  </View>

                  <View style={styles.infoRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="create" size={20} color="#007bff" />
                      </View>
                      <View style={styles.textContainer}>
                          <Text style={styles.label}>Plate Number</Text>
                          {isEditing ? (
                              <TextInput 
                                  style={styles.input} 
                                  value={plateNumber} 
                                  onChangeText={setPlateNumber} 
                              />
                          ) : (
                              <Text style={styles.value}>{plateNumber}</Text>
                          )}
                      </View>
                  </View>
              </View>

              <View style={styles.buttonContainer}>
                  {isEditing ? (
                      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                          <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Changes"}</Text>
                      </TouchableOpacity>
                  ) : (
                      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                          <Text style={styles.editButtonText}>Edit Profile</Text>
                      </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
                      <Text style={styles.logoutText}>Log Out</Text>
                  </TouchableOpacity>
              </View>
          </View>
      ) : (
          <Text>User not found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f6f8' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  profileCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      shadowColor: "#007bff",
      shadowOpacity: 0.3,
      shadowRadius: 8,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  nameInput: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', minWidth: 200 },
  email: { fontSize: 16, color: '#666' },

  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

  infoSection: { marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: {
      width: 40,
      height: 40,
      backgroundColor: '#e6f2ff',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15
  },
  textContainer: { flex: 1 },
  label: { fontSize: 14, color: '#888', marginBottom: 2 },
  value: { fontSize: 18, color: '#333', fontWeight: '500' },
  input: {
      borderBottomWidth: 1,
      borderColor: '#007bff',
      fontSize: 18,
      paddingVertical: 2,
      color: '#333'
  },

  buttonContainer: { gap: 10 },
  saveButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  editButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#007bff',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
  },
  editButtonText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },

  logoutButton: {
      padding: 15,
      alignItems: 'center',
      marginTop: 5
  },
  logoutText: { color: '#dc3545', fontSize: 16, fontWeight: '500' }
});

export default ProfileScreen;
