import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, Platform
} from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Home } from 'lucide-react-native';

const MyOrders = ({ route }) => {
  const { studentNumber } = route.params;
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = subscribeToOrders();
    return () => unsubscribe();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      // TODO: send to your server for push notifications
    }
  };

  const subscribeToOrders = () => {
    const firestore = getFirestore();
    const ordersCollectionRef = collection(firestore, 'orders');
    const q = query(ordersCollectionRef, where('studentNumber', '==', studentNumber));

    return onSnapshot(q, snapshot => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(fetched);

      fetched.forEach(item => {
        if (item.status === 'Ready') {
          showNotification(item);
        }
      });
    });
  };

  const showNotification = async (order) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'orders',
      name: 'Order Updates',
    });
    // Display a notification
    await notifee.displayNotification({
      title: 'Order Ready',
      body: `Your order #${order.orderNumber} is ready! Your token: ${order.token}`,
      android: { channelId, smallIcon: 'ic_launcher' },
    });
  };

  const handleOrderPickedUp = async (orderId) => {
    const firestore = getFirestore();
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status: 'Picked Up' });
    Alert.alert('Success', 'Order marked as picked up.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order # {item.orderNumber}</Text>
            <Text style={styles.orderText}>Token: {item.token}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            {item.status === 'Ready' && (
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

      <TouchableOpacity style={styles.mainMenuButton} onPress={() => navigation.navigate('MainMenu', { studentNumber })}>
        <Home size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24, marginBottom: 20, textAlign: 'center',
  },
  orderItem: {
    padding: 16, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 5, marginBottom: 10,
  },
  orderText: { fontSize: 18, marginBottom: 5 },
  pickupButton: {
    backgroundColor: 'green', padding: 10,
    borderRadius: 5, alignItems: 'center', marginTop: 10,
  },
  pickupButtonText: { color: 'white', fontSize: 16 },
  mainMenuButton: {
    position: 'absolute', bottom: 20, left: 20,
    backgroundColor: 'blue', padding: 14,
    borderRadius: 30, elevation: 4,
  },
});

export default MyOrders;
