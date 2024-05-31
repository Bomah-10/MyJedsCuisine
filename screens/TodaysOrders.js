import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const TodaysOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const firestore = getFirestore();
      const ordersCollectionRef = collection(firestore, 'orders');
      const q = query(ordersCollectionRef, where('status', 'in', ['Pending', 'Ready']));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: data.items || [] // Assuming itemsOrdered field contains an array of items with name and quantity properties
        };
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderReady = (order) => {
    setSelectedOrder(order);
    setTokenInput('');
  };

  const handleTokenSubmit = async () => {
    if (selectedOrder && selectedOrder.token === tokenInput) {
      const firestore = getFirestore();
      const orderRef = doc(firestore, 'orders', selectedOrder.id);
      await deleteDoc(orderRef); // Delete the document from Firestore
      Alert.alert('Order successful', 'The order has been picked up');
      setSelectedOrder(null);
      setTokenInput('');
      fetchOrders();
    } else {
      Alert.alert('Invalid Token', 'The token entered is incorrect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order Number: {item.orderNumber}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            <Text style={styles.orderText}>Student Number: {item.studentNumber}</Text>
            <Text style={styles.orderText}>Items: </Text>
            <FlatList
              data={item.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.name} x {item.quantity}</Text>
                </View>
              )}
            />
            {item.status === 'Pending' && (
              <TouchableOpacity
                style={styles.readyButton}
                onPress={() => handleOrderReady(item)}
              >
                <Text style={styles.readyButtonText}>Ready</Text>
              </TouchableOpacity>
            )}
            {selectedOrder && selectedOrder.id === item.id && (
              <View style={styles.tokenContainer}>
                <Text style={styles.tokenText}>Enter Token for Order Number: {selectedOrder.orderNumber}</Text>
                <TextInput
                  style={styles.tokenInput}
                  value={tokenInput}
                  onChangeText={setTokenInput}
                  placeholder="Enter Token"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleTokenSubmit}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
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
  orderItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 18,
    marginBottom: 5,
  },
  readyButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  readyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tokenContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  tokenText: {
    fontSize: 18,
    marginBottom: 10,
  },
  tokenInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TodaysOrders;
