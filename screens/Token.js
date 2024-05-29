import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Token = ({ route }) => {
  const { orderNumber, token } = route.params;
  const navigation = useNavigation();

  const handleMyOrders = () => {
    navigation.navigate('MyOrders');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.orderText}>Your order is number {orderNumber}, it is being processed.</Text>
      <Text style={styles.tokenText}>Your token is: {token}</Text>
      <Text style={styles.thankYouText}>
        Thank you for your order, we will notify you when it’s ready. Keep your token safe!
      </Text>
      <TouchableOpacity style={styles.myOrdersButton} onPress={handleMyOrders}>
        <Text style={styles.myOrdersButtonText}>My Orders</Text>
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
  orderText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  tokenText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  myOrdersButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '80%',
  },
  myOrdersButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Token;
