import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ReceivedOrders = () => {
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

  const handleEditMenu = () => {
    // Navigate to the screen where cafeteria administrators can edit the menu items
    navigation.navigate('EditMenu');
  };

  const handleViewOrders = () => {
    // Navigate to the screen where cafeteria administrators can view received orders
    navigation.navigate('ViewOrders');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Received Orders</Text>
        <Text style={styles.headerText}>for JEDS Cafeteria</Text>
      </View>
      <Text style={styles.text}>Welcome! You haven't received any orders</Text>
      <TouchableOpacity style={styles.editMenuButton} onPress={handleEditMenu}>
        <Text style={styles.buttonText}>Edit Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewOrdersButton} onPress={handleViewOrders}>
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>
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
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 60,
  },
  editMenuButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOrdersButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
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

export default ReceivedOrders;
