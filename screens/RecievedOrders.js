import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
    }
  };

  const handleEditMenu = () => {
    navigation.navigate('EditMenu');
  };

  const handleViewOrders = () => {
    navigation.navigate('TodaysOrders');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Received Orders</Text>
        <Text style={styles.headerText}>for JEDS Cafeteria</Text>
      </View>
      <Text style={styles.text}>Welcome to the Jeds Cafe site, here you can edit the Menu and view the orders recieved for today. </Text>
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
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 80,
    fontSize: 16,
    textAlign: 'center',
  },
  editMenuButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  viewOrdersButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceivedOrders;
