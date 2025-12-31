import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
        await login({ email, password });
    } else {
        Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/gopark_logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.subtitle}>Find your spot instantly</Text>

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        keyboardType="email-address" 
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={true} 
        style={styles.input} 
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 200, height: 60 },
  title: { fontSize: 32, marginBottom: 10, textAlign: 'center', fontWeight: 'bold', color: '#007bff' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5, backgroundColor: '#f9f9f9' },
  buttonContainer: { marginVertical: 10 },
  linkText: { marginTop: 15, textAlign: 'center', color: '#007bff' }
});

export default LoginScreen;
