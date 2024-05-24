import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeToJeds = () => {
  const navigation = useNavigation();

  const handleViewOrders = () => {
    // Navigate to the screen where students can view their orders
    navigation.navigate('ViewMyOrders');
  };

  const handleMakeNewOrder = () => {
    // Navigate to the screen where students can make a new order
    navigation.navigate('MakeNewOrder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Jeds Cafe!</Text>
      <TouchableOpacity style={styles.button} onPress={handleViewOrders}>
        <Text style={styles.buttonText}>View My Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.buttonText}>Make a New Order</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeToJeds;
