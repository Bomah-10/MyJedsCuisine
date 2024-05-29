import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyOrders = () => {
  const navigation = useNavigation();
  const orders = [
    { orderNumber: '12345', token: 'abc123', items: ['Item1', 'Item2'] },
    { orderNumber: '67890', token: 'def456', items: ['Item3', 'Item4'] },
    // Add more orders as needed
  ];

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderNumber}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item)}>
            <Text style={styles.orderText}>Order Number: {item.orderNumber}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  orderText: {
    fontSize: 18,
  },
});

export default MyOrders;
