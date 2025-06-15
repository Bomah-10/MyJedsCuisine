import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Modal, Pressable, Alert
} from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

const Confirmation = ({ navigation, route }) => {
  const { selectedProducts, studentNumber } = route.params;
  const [products, setProducts] = useState(selectedProducts);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirmPress = () => {
    setModalVisible(true);
  };

  const handlePaymentMethod = (method) => {
    setModalVisible(false);
    const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (method === 'Meal Account' && totalAmount > 90) {
      Alert.alert("Error", "Sorry! Your total amount cannot exceed N$ 90 when paying with a meal account.");
    } else {
      navigation.navigate('OrderConfirmation', { selectedProducts: products, studentNumber });
    }
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
            <Image style={styles.productImage} source={{ uri: item.imageUrl }} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>N${item.price * item.quantity}</Text>
            </View>
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

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('MainMenu', { studentNumber })}>
        <XCircle size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderButton} onPress={handleConfirmPress}>
        <CheckCircle size={32} color="white" />
        <Text style={styles.iconLabel}>Order</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <XCircle size={24} color="gray" />
            </TouchableOpacity>

            <Text style={styles.modalText}>Select Payment Method</Text>

            <Pressable style={[styles.button, styles.mealAccountButton]} onPress={() => handlePaymentMethod('Meal Account')}>
              <Text style={styles.buttonText}>Meal Account</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.othersButton]} onPress={() => handlePaymentMethod('Others')}>
              <Text style={styles.buttonText}>Others</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 8,
    borderWidth: 1,
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

  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'red',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  orderButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: 'green',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  iconLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative'
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginVertical: 10,
    minWidth: 150,
  },
  mealAccountButton: {
    backgroundColor: 'blue',
  },
  othersButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Confirmation;
