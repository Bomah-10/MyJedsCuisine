import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid'; // for temp keys

const EditMenu = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const productsCollection = collection(firestore, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsList);
  };

  const handleSaveChanges = async () => {
    try {
      const existingProducts = products.filter(product => product.id !== '');
      const newProducts = products.filter(product => product.id === '');

      await Promise.all(
        existingProducts.map(async (product) => {
          const productRef = doc(firestore, 'products', product.id);
          const updatedData = {
            name: product.name || '',
            price: product.price !== undefined ? product.price : 0,
          };
          await updateDoc(productRef, updatedData);
        })
      );

      await Promise.all(
        newProducts.map(async (product) => {
          const newProduct = {
            name: product.name || '',
            price: product.price !== undefined ? product.price : 0,
            imageUrl: product.imageUrl || '', // optional
          };
          await addDoc(collection(firestore, 'products'), newProduct);
        })
      );

      alert('Changes saved successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again later.');
    }
  };

  const handleEditName = (productId, newName) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, name: newName } : product
      )
    );
  };

  const handleEditPrice = (productId, newPrice) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, price: newPrice } : product
      )
    );
  };

  const handleAddItem = () => {
    setProducts(prevProducts => [
      ...prevProducts,
      {
        id: '', // to trigger new item logic
        tempId: uuid.v4(),
        name: '',
        price: '',
        imageUrl: '', // optional fallback
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Menu</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item.tempId}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              style={styles.productImage}
              source={{
                uri: item.imageUrl || 'https://via.placeholder.com/50',
              }}
              onError={() => console.warn('Image failed to load')}
            />
            <View style={styles.productDetails}>
              <TextInput
                style={styles.input}
                value={item.name}
                onChangeText={(text) => handleEditName(item.id, text)}
                placeholder="Item Name"
              />
              <TextInput
                style={styles.input}
                value={item.price?.toString() ?? ''}
                onChangeText={(text) => {
                  const price = text === '' ? '' : parseFloat(text);
                  handleEditPrice(item.id, price);
                }}
                keyboardType="numeric"
                placeholder="Price"
              />
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#eaeaea',
  },
  productDetails: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditMenu;
