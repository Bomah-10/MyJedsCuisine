import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoadScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Choose your category:</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StudentLogin')}>
        <Text style={styles.buttonText}>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CafeteriaLogin')}>
        <Text style={styles.buttonText}>Cafeteria</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/first-icon.png')} style={styles.bottomImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 20,
  },
});

export default LoadScreen;
