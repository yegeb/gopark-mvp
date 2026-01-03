import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Alert, Linking, Platform, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';
import { reservationAPI } from '../api/endpoints';
import { calculateParkingFee } from '../utils/PricingUtils';

const ReservationScreen = ({ route, navigation }: any) => {
  const { parking } = route.params || {};
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  
  // Date/Time State
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Default 1 hour later
  
  const [totalPrice, setTotalPrice] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Payment Sim State
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  
  // Payment Form State
  const [fullName, setFullName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Formatting Functions
  const handleCardNumberChange = (text: string) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 16); // Only numbers, max 16
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 4); // Only numbers, max 4 (MMYY)
      if (cleaned.length >= 3) {
          setExpiryDate(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
      } else {
          setExpiryDate(cleaned);
      }
  };

  const handleCvvChange = (text: string) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 3); // Only numbers, max 3
      setCvv(cleaned);
  };

  // Calculate Fee Effect
  React.useEffect(() => {
      if (!parking) return;

      const combinedStart = new Date(date);
      combinedStart.setHours(startTime.getHours(), startTime.getMinutes());

      const combinedEnd = new Date(date);
      combinedEnd.setHours(endTime.getHours(), endTime.getMinutes());

      if (combinedEnd > combinedStart) {
          const durationMs = combinedEnd.getTime() - combinedStart.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          const fee = calculateParkingFee(parking.pricePerHour, durationHours);
          setTotalPrice(fee);
      } else {
          setTotalPrice(0);
      }
  }, [date, startTime, endTime, parking]);

  /* iOS-specific: Don't close immediately on change. Android: Close on selection (event.type === 'set' or 'dismissed') */
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
  };

  const onChangeStartTime = (event: any, selectedDate?: Date) => {
    if (selectedDate) setStartTime(selectedDate);
    if (Platform.OS === 'android') {
        setShowStartTimePicker(false);
    }
  };

  const onChangeEndTime = (event: any, selectedDate?: Date) => {
    if (selectedDate) setEndTime(selectedDate);
    if (Platform.OS === 'android') {
        setShowEndTimePicker(false);
    }
  };

  // Helper to render picker with "Done" button for iOS
  const renderPicker = (
      show: boolean, 
      setShow: (val: boolean) => void, 
      value: Date, 
      onChange: (event: any, date?: Date) => void,
      mode: 'date' | 'time',
      minDate?: Date
  ) => {
      if (!show) return null;

      return (
          <View>
              <DateTimePicker
                  value={value}
                  mode={mode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChange}
                  minimumDate={minDate}
              />
              {Platform.OS === 'ios' && (
                  <Button title="Done" onPress={() => setShow(false)} />
              )}
          </View>
      );
  };

  const handleInitiatePayment = () => {
      // Create combined dates for accurate comparison
      const combinedStart = new Date(date);
      combinedStart.setHours(startTime.getHours(), startTime.getMinutes());

      const combinedEnd = new Date(date);
      combinedEnd.setHours(endTime.getHours(), endTime.getMinutes());

      if (combinedEnd <= combinedStart) {
          Alert.alert('Invalid Time', 'End time must be after start time.');
          return;
      }
      
      if (!fullName.trim()) {
          Alert.alert('Missing Information', 'Please enter the Full Name on Card.');
          return;
      }
      
      if (cardNumber.length < 19) { // 16 digits + 3 spaces
          Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
          return;
      }

      if (expiryDate.length < 5) { // MM/YY
          Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY).');
          return;
      }

      if (cvv.length < 3) {
          Alert.alert('Invalid CVV', 'CVV must be 3 digits.');
          return;
      }

      // Open Gateway
      setPaymentModalVisible(true);
      setOtpStep(false);
      setOtp('');
      setIsProcessing(false);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate Network Delay for "Bank"
    setTimeout(() => {
        setIsProcessing(false);
        setOtpStep(true);
    }, 2000);
  };

  const verifyOtpAndBook = async () => {
      if (otp.length < 4) {
          Alert.alert('Invalid OTP', 'Please enter the 4-digit code sent to your phone.');
          return;
      }

      setIsProcessing(true);
      
      // Combine Date + Time
      const combinedStart = new Date(date);
      combinedStart.setHours(startTime.getHours(), startTime.getMinutes());

      const combinedEnd = new Date(date);
      combinedEnd.setHours(endTime.getHours(), endTime.getMinutes());

      try {
          const response = await reservationAPI.create({ 
              parkingId: parking._id,
              startTime: combinedStart.toISOString(),
              endTime: combinedEnd.toISOString()
          });
          setReservationId(response.data._id || 'RES-' + Date.now()); // Fallback if ID invalid
          setPaymentModalVisible(false);
          setConfirmed(true);
          // Alert.alert('Success', 'Payment Verified & Spot Reserved!'); // Removed Alert for Modal Flow
      } catch (error: any) {
          setPaymentModalVisible(false); // Close payment modal on error too
          setTimeout(() => {
             Alert.alert('Reservation Failed', error.response?.data?.message || 'Could not reserve spot.');
          }, 500);
      } finally {
          setIsProcessing(false);
      }
  };

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

  if (!parking) {
      return (
          <View style={styles.container}>
              <Text>No parking selected.</Text>
              <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
      )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
            <Text style={styles.title}>Confirm Reservation</Text>
            <Text style={styles.parkingName}>{parking.name}</Text>
            <Text style={styles.info}>{parking.district}, {parking.neighborhood}</Text>
            
            {!confirmed ? (
                <View style={styles.actionContainer}>
                    <Text style={styles.sectionHeader}>Select Date & Time</Text>
                    
                    {/* Date Selector */}
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(!showDatePicker)}>
                        <Text style={styles.pickerText}>Date: {date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {renderPicker(showDatePicker, setShowDatePicker, date, onChangeDate, 'date', new Date())}

                    {/* Start Time Selector */}
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowStartTimePicker(!showStartTimePicker)}>
                        <Text style={styles.pickerText}>Start: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                    {renderPicker(showStartTimePicker, setShowStartTimePicker, startTime, onChangeStartTime, 'time')}

                    {/* End Time Selector */}
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowEndTimePicker(!showEndTimePicker)}>
                        <Text style={styles.pickerText}>End: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                    {renderPicker(showEndTimePicker, setShowEndTimePicker, endTime, onChangeEndTime, 'time')}

                    {/* Payment Form (Mock Inputs) */}
                    <View style={styles.paymentSection}>
                        <Text style={styles.sectionHeader}>Payment Details</Text>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Full Name on Card" 
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Card Number (0000 0000 0000 0000)" 
                            keyboardType="numeric" 
                            maxLength={19}
                            value={cardNumber}
                            onChangeText={handleCardNumberChange}
                        />
                        <View style={styles.row}>
                            <TextInput 
                                style={[styles.input, styles.halfInput]} 
                                placeholder="MM/YY" 
                                keyboardType="numeric"
                                maxLength={5}
                                value={expiryDate}
                                onChangeText={handleExpiryChange}
                            />
                            <TextInput 
                                style={[styles.input, styles.halfInput]} 
                                placeholder="CVV" 
                                keyboardType="numeric" 
                                maxLength={3}
                                value={cvv}
                                onChangeText={handleCvvChange}
                            />
                        </View>
                    </View>

                    <View style={styles.spacer} />
                    
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total Fee:</Text>
                        <Text style={styles.totalAmount}>{totalPrice} TL</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.payButton} 
                        onPress={handleInitiatePayment} 
                    >
                        <Text style={styles.payButtonText}>Pay {totalPrice} TL & Reserve</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>Reservation Confirmed!</Text>
                    <Text style={styles.successInfo}>
                        {date.toLocaleDateString()}
                        {'\n'}
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    
                    <View style={styles.qrContainer}>
                        <QRCode 
                            value={JSON.stringify({ 
                                id: reservationId, 
                                park: parking.name, 
                                start: startTime.toISOString(),
                                end: endTime.toISOString(),
                                user: fullName,
                                fee: totalPrice
                            })}
                            size={180}
                        />
                        <Text style={styles.qrLabel}>Scan at Entry</Text>
                        <Text style={styles.warningText}>
                            Please scan the QR code within 15 minutes of your reservation start time. If not, your reservation will be canceled.
                        </Text>
                    </View>

                    <Button title="Get Directions" onPress={openMaps} />
                    <View style={{ height: 10 }} />
                    <Button title="Done" onPress={() => navigation.navigate('Home')} />
                </View>
            )}
        </View>
        
        {!confirmed && <Button title="Cancel" onPress={() => navigation.goBack()} color="#dc3545" />}
      </ScrollView>

      {/* Payment Gateway Modal (RazorPay Sim) */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={paymentModalVisible}
          onRequestClose={() => { if(!isProcessing) setPaymentModalVisible(false); }}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.bankTitle}>Secure 3D Payment</Text>
                  
                  {isProcessing ? (
                      <View style={styles.processingContainer}>
                          <ActivityIndicator size="large" color="#007bff" />
                          <Text style={styles.processingText}>Processing Transaction...</Text>
                      </View>
                  ) : (
                      <>
                          {!otpStep ? (
                              <View style={styles.stepContainer}>
                                  <Text style={styles.modalText}>Merchant: GoPark Inc.</Text>
                                  <Text style={styles.modalText}>Amount: {totalPrice} TL</Text>
                                  <View style={styles.separator}/>
                                  <Text style={styles.modalInfo}>Please confirm the transaction using your bank's secure gateway.</Text>
                                  <TouchableOpacity style={styles.confirmPayButton} onPress={handleProcessPayment}>
                                      <Text style={styles.confirmPayText}>Authorize Payment</Text>
                                  </TouchableOpacity>
                              </View>
                          ) : (
                              <View style={styles.stepContainer}>
                                  <Text style={styles.otpHeader}>Enter OTP</Text>
                                  <Text style={styles.otpSub}>A code has been sent to your mobile.</Text>
                                  <TextInput 
                                      style={styles.otpInput}
                                      placeholder="1234"
                                      keyboardType="numeric"
                                      maxLength={4}
                                      value={otp}
                                      onChangeText={setOtp}
                                      autoFocus
                                  />
                                  <TouchableOpacity style={styles.verifyButton} onPress={verifyOtpAndBook}>
                                      <Text style={styles.verifyText}>Verify & Pay</Text>
                                  </TouchableOpacity>
                              </View>
                          )}
                          {!isProcessing && (
                              <TouchableOpacity style={styles.cancelLink} onPress={() => setPaymentModalVisible(false)}>
                                  <Text style={styles.cancelLinkText}>Cancel Transaction</Text>
                              </TouchableOpacity>
                          )}
                      </>
                  )}
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  parkingName: { fontSize: 26, color: '#007bff', marginBottom: 5, textAlign: 'center', fontWeight: 'bold' },
  info: { fontSize: 16, color: '#666', marginBottom: 10 },
  actionContainer: { width: '100%' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 15, color: '#444' },
  pickerButton: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e0e0e0'
  },
  pickerText: { fontSize: 16, color: '#333' },
  
  paymentSection: { marginTop: 10 },
  input: {
      backgroundColor: '#f8f9fa',
      borderWidth: 1,
      borderColor: '#ced4da',
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      fontSize: 16
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  halfInput: { flex: 1 },

  spacer: { height: 20 },
  payButton: {
      backgroundColor: '#007bff',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
      shadowColor: '#007bff',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 4
  },
  payButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, padding: 15, backgroundColor: '#e9ecef', borderRadius: 10 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#28a745' },

  successContainer: { alignItems: 'center', width: '100%' },
  successText: { fontSize: 24, color: '#28a745', fontWeight: 'bold', marginBottom: 5 },
  successInfo: { textAlign: 'center', marginBottom: 20, fontSize: 16, color: '#555' },
  qrContainer: { padding: 20, backgroundColor: 'white', borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, marginBottom: 20, alignItems: 'center' },
  qrLabel: { marginTop: 10, color: '#666', fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center'
  },
  modalContent: {
      width: '85%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      elevation: 10
  },
  bankTitle: { fontSize: 20, fontWeight: '900', color: '#1a237e', marginBottom: 20 },
  stepContainer: { width: '100%', alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 5, color: '#333' },
  modalInfo: { textAlign: 'center', color: '#666', marginVertical: 15 },
  separator: { height: 1, width: '100%', backgroundColor: '#eee', marginVertical: 10 },
  
  processingContainer: { padding: 20, alignItems: 'center' },
  processingText: { marginTop: 15, fontSize: 16, color: '#666' },

  otpHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  otpSub: { color: '#666', marginBottom: 15 },
  otpInput: {
      borderWidth: 2,
      borderColor: '#1a237e',
      borderRadius: 8,
      width: '60%',
      padding: 10,
      fontSize: 24,
      textAlign: 'center',
      letterSpacing: 5,
      marginBottom: 20
  },
  
  confirmPayButton: {
      backgroundColor: '#1a237e',
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
      width: '100%',
      alignItems: 'center'
  },
  confirmPayText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  verifyButton: {
      backgroundColor: '#28a745',
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 25,
      width: '100%',
      alignItems: 'center'
  },
  verifyText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  cancelLink: { marginTop: 15 },
  cancelLinkText: { color: '#dc3545', fontSize: 14 },
  
  warningText: { color: '#dc3545', textAlign: 'center', fontSize: 14, marginTop: 10, paddingHorizontal: 10 }
});

export default ReservationScreen;
