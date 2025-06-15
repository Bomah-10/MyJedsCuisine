import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Alert, ScrollView
} from 'react-native';
import {
  getFirestore, collection, query, where,
  getDocs, updateDoc, doc, deleteDoc
} from 'firebase/firestore';
import moment from 'moment';
import { CheckCircle, Lock } from 'lucide-react-native';

const TodaysOrders = () => {
  const [orders, setOrders] = useState([]);
  const [tokenInputs, setTokenInputs] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const firestore = getFirestore();
      const ordersRef = collection(firestore, 'orders');
      const q = query(ordersRef, where('status', 'in', ['Pending', 'Ready']));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setOrders(fetched);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Ready': return '#32CD32';
      default: return '#777';
    }
  };

  const handleOrderReady = async (order) => {
    const firestore = getFirestore();
    const orderRef = doc(firestore, 'orders', order.id);
    await updateDoc(orderRef, { status: 'Ready' });
    fetchOrders();
  };

  const handleTokenSubmit = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    const token = tokenInputs[orderId];

    if (order && order.token === token) {
      const firestore = getFirestore();
      await deleteDoc(doc(firestore, 'orders', order.id));
      Alert.alert('Success', 'Order picked up');
      setTokenInputs(prev => ({ ...prev, [orderId]: '' }));
      fetchOrders();
    } else {
      Alert.alert('Invalid Token', 'Please try again');
    }
  };

  const handleTokenChange = (orderId, value) => {
    setTokenInputs(prev => ({ ...prev, [orderId]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 Today's Orders</Text>
      {orders.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>

          <Text style={styles.dateText}>📅 {moment(item.createdAt).format('MMM Do YYYY, h:mm A')}</Text>
          <Text style={styles.studentNumber}>👤 Student: {item.studentNumber}</Text>

          <View style={styles.productsList}>
            {item.items?.map((product, index) => (
              <Text key={index} style={styles.productText}>• {product.name} × {product.quantity}</Text>
            ))}
          </View>

          {item.status === 'Pending' && (
            <TouchableOpacity style={styles.iconButton} onPress={() => handleOrderReady(item)}>
              <CheckCircle size={28} color="#FFA500" />
              <Text style={styles.iconText}>Ready</Text>
            </TouchableOpacity>
          )}

          {item.status === 'Ready' && (
            <View style={styles.tokenContainer}>
              <TextInput
                style={styles.tokenInput}
                placeholder="Enter Token"
                value={tokenInputs[item.id] || ''}
                onChangeText={(val) => handleTokenChange(item.id, val)}
              />
              <TouchableOpacity style={styles.iconButton} onPress={() => handleTokenSubmit(item.id)}>
                <Lock size={26} color="#007BFF" />
                <Text style={styles.iconText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  studentNumber: {
    marginTop: 6,
    fontSize: 15,
    color: '#444',
  },
  productsList: {
    marginTop: 10,
  },
  productText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#555',
  },
  tokenContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  tokenInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 15,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  iconButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  iconText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});

export default TodaysOrders;
