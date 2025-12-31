import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, Alert, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
  const { register } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      plateNumber: '',
      carBrand: ''
  });

  const handleChange = (name: string, value: string) => {
      setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
      if (!formData.email || !formData.password || !formData.fullName) {
          Alert.alert('Error', 'Please fill in all required fields');
          return;
      }
      await register(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
          <Image source={require('../../assets/gopark_logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      
      <TextInput placeholder="Full Name" value={formData.fullName} onChangeText={(t) => handleChange('fullName', t)} style={styles.input} />
      <TextInput placeholder="Email" value={formData.email} onChangeText={(t) => handleChange('email', t)} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={formData.password} onChangeText={(t) => handleChange('password', t)} style={styles.input} secureTextEntry={true} />
      <TextInput placeholder="Phone Number" value={formData.phoneNumber} onChangeText={(t) => handleChange('phoneNumber', t)} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Plate Number" value={formData.plateNumber} onChangeText={(t) => handleChange('plateNumber', t)} style={styles.input} autoCapitalize="characters" />
      <TextInput placeholder="Car Brand" value={formData.carBrand} onChangeText={(t) => handleChange('carBrand', t)} style={styles.input} />

      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleRegister} />
      </View>
      <View style={styles.buttonContainer}>
         <Button title="Back to Login" onPress={() => navigation.navigate('Login')} color="#888" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 200, height: 60 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5, backgroundColor: '#f9f9f9' },
  buttonContainer: { marginBottom: 10 }
});

export default RegisterScreen;
