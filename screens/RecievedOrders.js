import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const RecievedOrders = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const cafeteriaDocRef = doc(firestore, 'cafeterias', 'jedscafe');
      await updateDoc(cafeteriaDocRef, { isLoggedIn: false });
      navigation.navigate('CafeteriaLogin');
    } catch (err) {
      console.error('Error logging out: ', err);
      // Handle error if necessary
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Received Orders</Text>
        <Text style={styles.headerText}>for JEDS Cafeteria</Text>
      </View>
      <Text style={styles.text}>Welcome! You haven't received any orders</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // Changed font color to black
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 60,
  },
  logoutButton: {
    backgroundColor: 'red', // Set logout button to red
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecievedOrders;
