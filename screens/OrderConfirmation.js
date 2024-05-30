import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmation = ({ route }) => {
  const { selectedProducts, studentNumber } = route.params;
  const navigation = useNavigation();

  const totalPrice = selectedProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handleOrderConfirmation = async () => {
    try {
      const orderNumber = await generateOrderNumber();
      const token = generateToken();
      console.log('Order Number:', orderNumber);
      console.log('Token:', token);
      console.log('Selected Products:', selectedProducts);
      console.log('Student Number:', studentNumber);

      await saveOrderToFirestore(orderNumber, token, selectedProducts, studentNumber);
      navigation.navigate('Token', { orderNumber, token, studentNumber });
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const generateOrderNumber = async () => {
    const firestore = getFirestore();
    const ordersCollectionRef = collection(firestore, 'orders');
    const snapshot = await getDocs(ordersCollectionRef);
    return snapshot.size + 1;
  };

  const generateToken = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let token = '';
    for (let i = 0; i < 3; i++) {
      token += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 5; i++) {
      token += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return token;
  };

  const saveOrderToFirestore = async (orderNumber, token, selectedProducts, studentNumber) => {
    const firestore = getFirestore();
    const ordersCollectionRef = collection(firestore, 'orders');
    await addDoc(ordersCollectionRef, {
      orderNumber,
      token,
      studentNumber,
      items: selectedProducts.map(product => ({ name: product.name, quantity: product.quantity })),
      status: 'Pending',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <FlatList
        data={selectedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>N${item.price * item.quantity}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalAmount}>Total: N${totalPrice.toFixed(2)}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={handleOrderConfirmation}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
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
