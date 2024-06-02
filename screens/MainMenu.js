import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Remove addDoc, query, orderBy
import { useNavigation } from '@react-navigation/native';

const MainMenu = ({ route }) => {
  const { studentNumber } = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const firestore = getFirestore();
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

  const handleContinue = () => {
    // Only navigate to Confirmation screen without creating a new order document
    navigation.navigate('Confirmation', { selectedProducts, studentNumber });
  };

  const handleMyOrders = () => {
    navigation.navigate('MyOrders', { studentNumber });
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
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>N${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedProducts.length > 0 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.myOrdersButton} onPress={handleMyOrders}>
        <Text style={styles.myOrdersButtonText}>My Orders</Text>
      </TouchableOpacity>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  selectedProductItem: {
    backgroundColor: '#d3d3d3',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
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
  myOrdersButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  myOrdersButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MainMenu;
