import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase'; // Import firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const StudentLogin = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError('');
    const studentsRef = collection(firestore, 'students');
    const q = query(studentsRef, where('studentNumber', '==', studentNumber), where('password', '==', password));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        navigation.navigate('MainMenu', { studentNumber: studentData.studentNumber }); // Passing studentNumber to MainMenu
      } else {
        setError('Invalid student number or password');
      }
    } catch (err) {
      console.error('Error logging in: ', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Please enter your credentials:</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Student Number"
        keyboardType="numeric"
        value={studentNumber}
        onChangeText={setStudentNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
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

export default StudentLogin;
