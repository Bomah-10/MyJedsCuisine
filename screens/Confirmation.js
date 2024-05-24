import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';

const Confirmation = ({ navigation, route }) => {
  const { selectedProducts } = route.params;
  const [products, setProducts] = useState(selectedProducts);

  const handleConfirmPress = () => {
    Alert.alert("Confirmed!", "You have placed the order.");
  };

  const handleQuantityChange = (product, increment) => {
    const updatedProducts = products.map(item => {
      if (item.id === product.id) {
        const newQuantity = item.quantity + increment;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setProducts(updatedProducts);
  };

  const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Order</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>N${item.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange(item, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalAmount}>Total: N${totalAmount.toFixed(2)}</Text>
      <TouchableOpacity style={styles.orderButton} onPress={handleConfirmPress}>
        <Text style={styles.orderButtonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  productName: {
    fontSize: 16,
    flex: 2,
  },
  productPrice: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  totalAmount: {
    fontSize: 20,
    textAlign: 'right',
    marginTop: 16,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Confirmation;
