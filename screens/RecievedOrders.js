import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, MessageSquare, Pencil } from 'lucide-react-native';

const ReceivedOrders = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const cafeteriaDocRef = doc(firestore, 'cafeterias', 'jedscafe');
      await updateDoc(cafeteriaDocRef, { isLoggedIn: false });
      navigation.navigate('CafeteriaLogin');
    } catch (err) {
      console.error('Error logging out: ', err);
    }
  };

  const handleEditMenu = () => {
    navigation.navigate('EditMenu');
  };

  const handleViewOrders = () => {
    navigation.navigate('TodaysOrders');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={handleViewOrders}>
          <MessageSquare color="black" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditMenu}>
          <Pencil color="black" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.voidSpace}>
        <Text style={styles.text}>Welcome to JEDS Cafeteria admin. You can manage the menu and view today’s orders.</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 40,
  },
  header: {
    marginTop: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  voidSpace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
  logoutButton: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReceivedOrders;
