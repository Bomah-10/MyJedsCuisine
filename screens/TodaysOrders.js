import React from 'react';
import { View, Text } from 'react-native';

const TodaysOrders = ({ route }) => {
  const { orderNumber, token } = route.params || {}; // Handle if route.params is undefined

  return (
    <View>
      <Text>Today's Orders</Text>
      {/* Display order details if they exist */}
      {orderNumber && token && (
        <>
          <Text>Order Number: {orderNumber}</Text>
          <Text>Token: {token}</Text>
        </>
      )}
    </View>
  );
};

export default TodaysOrders;
