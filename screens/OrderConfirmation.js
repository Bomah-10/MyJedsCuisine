import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const OrderConfirmation = ({ route }) => {
  const { selectedProducts, totalPrice } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      {/* FlatList to display selected products */}
      <FlatList
        data={selectedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }} // Use the image URL here
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>N${item.price * item.quantity}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      {/* Display total amount */}
      <Text style={styles.totalAmount}>Total: N${totalPrice.toFixed(2)}</Text>
      {/* Button to confirm order */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    color: 'gray',
  },
  totalAmount: {
    fontSize: 20,
    textAlign: 'right',
    marginTop: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;
