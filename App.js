import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadScreen from './screens/LoadScreen';
import StudentLogin from './screens/StudentLogin';
import CafeteriaLogin from './screens/CafeteriaLogin';
import MainMenu from './screens/MainMenu';
import RecievedOrders from './screens/RecievedOrders';
import Confirmation from './screens/Confirmation';
import EditMenu from './screens/EditMenu';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoadScreen">
        <Stack.Screen name="LoadScreen" component={LoadScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} />
        <Stack.Screen name="CafeteriaLogin" component={CafeteriaLogin} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="RecievedOrders" component={RecievedOrders} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="EditMenu" component={EditMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
