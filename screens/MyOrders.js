import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Home, RefreshCw, CheckCircle, Clock } from 'lucide-react-native';

const formatDate = (timestamp) => {
  const date = timestamp?.toDate?.() || new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const MyOrders = ({ route }) => {
  const { studentNumber } = route.params;
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchOrders();
    return () => unsubscribe();
  }, []);

  const fetchOrders = () => {
    const firestore = getFirestore();
    const ordersRef = collection(firestore, 'orders');
    const q = query(ordersRef, where('studentNumber', '==', studentNumber));

    return onSnapshot(q, snapshot => {
      const grouped = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt;
        const dateKey = formatDate(createdAt);

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({ id: doc.id, ...data });
      });

      const sortedGroups = Object.entries(grouped).sort((a, b) =>
        new Date(b[0]) - new Date(a[0])
      );

      setOrders(sortedGroups);
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
    setTimeout(() => setRefreshing(false), 1000); // slight delay for visual feedback
  }, []);

  const renderStatusBadge = (status) => {
    const isReady = status === 'Ready';
    return (
      <View style={[styles.statusBadge, { backgroundColor: isReady ? '#4CAF50' : '#FFA500' }]}>
        {isReady ? <CheckCircle size={16} color="white" /> : <Clock size={16} color="white" />}
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity onPress={onRefresh}>
          <RefreshCw size={28} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const [date, ordersForDate] = item;
          return (
            <View>
              <Text style={styles.dateHeader}>{date}</Text>
              {ordersForDate.map(order => (
                <View key={order.id} style={styles.orderItem}>
                  <Text style={styles.orderText}>Order #: {order.orderNumber}</Text>
                  <Text style={styles.orderText}>Token: {order.token}</Text>
                  <View style={styles.statusRow}>
                    {renderStatusBadge(order.status)}
                  </View>
                </View>
              ))}
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.mainMenuButton}
        onPress={() => navigation.navigate('MainMenu', { studentNumber })}
      >
        <Home size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#555',
  },
  orderItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  orderText: { fontSize: 16, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
  },
  mainMenuButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'blue',
    padding: 14,
    borderRadius: 30,
    elevation: 4,
  },
});

export default MyOrders;
