import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { firestore } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import uuid from 'react-native-uuid';

const EditMenu = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const tickOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBeforeRemove = (e) => {
        if (!hasChanges) return;

        e.preventDefault();
        Alert.alert('Unsaved Changes', 'You have unsaved changes. Save before leaving?', [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      };

      navigation.addListener('beforeRemove', onBeforeRemove);

      return () => navigation.removeListener('beforeRemove', onBeforeRemove);
    }, [hasChanges])
  );

  useEffect(() => {
    Animated.timing(tickOpacity, {
      toValue: hasChanges ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [hasChanges]);

  const fetchProducts = async () => {
    const productsCollection = collection(firestore, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productsList);
    setSelectedItems([]);
    setHasChanges(false);
  };

  const handleSaveChanges = async () => {
    try {
      const existingProducts = products.filter(product => product.id);
      const newProducts = products.filter(product => !product.id);

      await Promise.all(
        existingProducts.map(async (product) => {
          const ref = doc(firestore, 'products', product.id);
          await updateDoc(ref, {
            name: product.name || '',
            price: product.price !== undefined ? product.price : 0,
          });
        })
      );

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
      fetchProducts();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes.');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedItems.map(async (itemId) => {
          const ref = doc(firestore, 'products', itemId);
          await deleteDoc(ref);
        })
      );
      alert('Selected items deleted!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting items:', error);
      alert('Failed to delete items.');
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: null,
      tempId: uuid.v4(),
      name: '',
      price: '',
      imageUrl: '',
    };
    setProducts(prev => [newItem, ...prev]);
    setHasChanges(true);
  };

  const handleEditField = (idOrTempId, field, value) => {
    setHasChanges(true);
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === idOrTempId || product.tempId === idOrTempId
          ? { ...product, [field]: value }
          : product
      )
    );
  };

  const toggleSelectItem = (id) => {
    if (!id) return;
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedItems.includes(id);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Animated.View style={{ opacity: tickOpacity }}>
          {hasChanges && (
            <TouchableOpacity onPress={handleSaveChanges}>
              <Text style={styles.tickIcon}>✔</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
        <Text style={styles.title}>Edit Menu</Text>
        <TouchableOpacity onPress={handleAddItem}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelected}>
          <Text style={styles.deleteButtonText}>Delete Selected</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id || item.tempId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productItem, isSelected(item.id) && styles.selectedItem]}
            onLongPress={() => toggleSelectItem(item.id)}
          >
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/50' }}
            />
            <View style={styles.productDetails}>
              <TextInput
                style={styles.input}
                value={item.name}
                onChangeText={(text) => handleEditField(item.id || item.tempId, 'name', text)}
                placeholder="Item Name"
              />
              <TextInput
                style={styles.input}
                value={item.price?.toString() ?? ''}
                onChangeText={(text) =>
                  handleEditField(
                    item.id || item.tempId,
                    'price',
                    text === '' ? '' : parseFloat(text)
                  )
                }
                keyboardType="numeric"
                placeholder="Price"
              />
            </View>
          </TouchableOpacity>
        )}
      />
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
  addIcon: {
    fontSize: 28,
    color: 'blue',
    paddingHorizontal: 10,
  },
  tickIcon: {
    fontSize: 26,
    color: 'green',
    paddingHorizontal: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 8,
    borderRadius: 8,
  },
  selectedItem: {
    borderColor: 'red',
    backgroundColor: '#ffeeee',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#eaeaea',
  },
  productDetails: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default EditMenu;
