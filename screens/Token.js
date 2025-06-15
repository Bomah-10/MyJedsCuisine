import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ListOrdered, Home } from 'lucide-react-native';

const Token = ({ route }) => {
  const { orderNumber, token, studentNumber } = route.params;
  const navigation = useNavigation();

  const handleMyOrders = () => {
    navigation.navigate('MyOrders', { studentNumber });
  };

  const handleMainMenu = () => {
    navigation.navigate('MainMenu', { studentNumber });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.orderText}>🎉 Order Placed!</Text>
        <Text style={styles.orderNumber}>Order # {orderNumber}</Text>
        <Text style={styles.tokenLabel}>Your Pickup Token:</Text>
        <Text style={styles.token}>{token}</Text>
        <Text style={styles.thankYou}>
          Thank you for your order! Please keep your token safe and wait for notification when your order is ready.
        </Text>
      </View>

      {/* My Orders Icon Button */}
      <TouchableOpacity style={styles.myOrdersButton} onPress={handleMyOrders}>
        <ListOrdered size={28} color="white" />
      </TouchableOpacity>

      {/* Main Menu Icon Button */}
      <TouchableOpacity style={styles.mainMenuButton} onPress={handleMainMenu}>
        <Home size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
    width: '100%',
  },
  orderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  tokenLabel: {
    fontSize: 16,
    marginTop: 10,
    color: '#444',
  },
  token: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28A745',
    marginVertical: 10,
    letterSpacing: 2,
  },
  thankYou: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  myOrdersButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 14,
    elevation: 4,
  },
  mainMenuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#28A745',
    borderRadius: 30,
    padding: 14,
    elevation: 4,
  },
});

export default Token;
