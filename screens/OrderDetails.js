import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const OrderDetails = ({ route }) => {
  const { order } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Order Number: {order.orderNumber}</Text>
      <Text style={styles.tokenText}>Token: {order.token}</Text>
      <Text style={styles.itemsHeaderText}>Items Ordered:</Text>
      {order.items.map((item, index) => (
        <Text key={index} style={styles.itemText}>{item}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tokenText: {
    fontSize: 20,
    marginBottom: 16,
  },
  itemsHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 4,
  },
});

export default OrderDetails;
