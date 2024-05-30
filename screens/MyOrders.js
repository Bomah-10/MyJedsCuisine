import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const MyOrders = ({ route }) => {
  const { studentNumber } = route.params;
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const firestore = getFirestore();
    const ordersCollectionRef = collection(firestore, 'orders');
    const q = query(ordersCollectionRef, where('studentNumber', '==', studentNumber));
    const querySnapshot = await getDocs(q);
    const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(fetchedOrders);
  };

  const handleOrderPickedUp = async (orderId) => {
    const firestore = getFirestore();
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status: 'Picked Up' });
    fetchOrders();
  };

  const handleMainMenuPress = () => {
    navigation.navigate('MainMenu', { studentNumber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <TouchableOpacity style={styles.mainMenuButton} onPress={handleMainMenuPress}>
        <Text style={styles.mainMenuButtonText}>Main Menu</Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order Number: {item.orderNumber}</Text>
            <Text style={styles.orderText}>Token: {item.token}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            {item.status === 'Pending' && (
              <TouchableOpacity
                style={styles.pickupButton}
                onPress={() => handleOrderPickedUp(item.id)}
              >
                <Text style={styles.pickupButtonText}>Mark as Picked Up</Text>
              </TouchableOpacity>
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
  mainMenuButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  mainMenuButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pickupButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pickupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MyOrders;
