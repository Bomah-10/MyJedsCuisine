import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

const EditMenu = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', imageUrl: '' });

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

      // Update existing products
      await Promise.all(
        existingProducts.map(async (product) => {
          const productRef = doc(firestore, 'products', product.id);
          const updatedData = {
            name: product.name || '',
            price: product.price !== undefined ? product.price : 0,
            imageUrl: product.imageUrl || '',
          };
          await updateDoc(productRef, updatedData);
        })
      );

      // Add new products
      await Promise.all(
        newProducts.map(async (product) => {
          const newProduct = {
            name: product.name || '',
            price: product.price !== undefined ? product.price : 0,
            imageUrl: product.imageUrl || '',
          };
          await addDoc(collection(firestore, 'products'), newProduct);
        })
      );

      alert('Changes saved successfully!');
      fetchProducts(); // Refresh the products list after saving
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

  const handleEditImage = (productId, newImageUrl) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, imageUrl: newImageUrl } : product
      )
    );
  };

  const handleAddItem = () => {
    setProducts(prevProducts => [
      ...prevProducts,
      {
        id: '', // Use an empty string to indicate a new item
        name: '',
        price: '',
        imageUrl: '',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Menu</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item.tempId} // Use tempId if id is empty
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }}
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
                value={item.price.toString()}
                onChangeText={(text) => {
                  const price = text === '' ? '' : parseFloat(text);
                  handleEditPrice(item.id, price);
                }}
                keyboardType="numeric"
                placeholder="Price"
              />
              <TextInput
                style={styles.input}
                value={item.imageUrl}
                onChangeText={(text) => handleEditImage(item.id, text)}
                placeholder="Image URL"
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
