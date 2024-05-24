import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CafeteriaLogin = () => {
  const [cafeteriaNumber, setCafeteriaNumber] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError('');
    const cafeteriaRef = collection(firestore, 'cafeterias');
    const q = query(cafeteriaRef, where('cafeteriaNumber', '==', cafeteriaNumber), where('code', '==', code));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();

        if (docData.isLoggedIn) {
          setError('A device has already logged in, only one device can log in at a time');
        } else {
          await updateDoc(docRef, { isLoggedIn: true });
          navigation.navigate('RecievedOrders');
        }
      } else {
        setError('Invalid cafeteria number or code');
      }
    } catch (err) {
      console.error('Error logging in: ', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Please enter the Cafeteria details:</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Cafeteria Number"
        keyboardType="numeric"
        value={cafeteriaNumber}
        onChangeText={setCafeteriaNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Code"
        secureTextEntry={true}
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/first-icon.png')} style={styles.bottomImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CafeteriaLogin;
