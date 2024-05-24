import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const MainMenu = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(firestore, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const toggleProductSelection = (product) => {
    if (selectedProducts.some(item => item.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(item => item.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.productItem,
              selectedProducts.some(selectedItem => selectedItem.id === item.id) && styles.selectedProductItem,
            ]}
            onPress={() => toggleProductSelection(item)}
          >
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>N${item.price}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedProducts.length > 0 && (
        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Confirmation', { selectedProducts })}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  selectedProductItem: {
    backgroundColor: '#d3d3d3',
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenu;
