import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Products from '../screens/App/Products/Products';
import Details from '../screens/App/Products/Details';
import CartProductDetails from '../screens/App/Products/CartProductDetails';
import Profile from '../screens/App/Profile/Profile';
import Address from '../screens/App/Addresses/Address';
import AddNewAddress from '../screens/App/Addresses/AddNewAddress';
import Payment from '../screens/App/Payment/Payment';
import BookASlot from '../screens/App/Order/BookASlot';
import SlotBooked from '../screens/App/Order/SlotBooked';
import CheckOutSummary from '../screens/App/Order/CheckOutSummary';
import PayOrder from '../screens/App/Order/PayOrder';
import OrderHistory from '../screens/App/Order/OrderHistory';
import Confirmation from '../screens/App/Order/Confirmation';
import Help from '../screens/App/Help/Help';
import FeaturedProducts from '../screens/App/Products/FeaturedProducts';
import DealDetails from '../screens/App/Deals/DealDetails';
import TabNavigation from '../screens/App/Main/TabNavigation';

const Stack = createStackNavigator();

const AppStack = () => {


    return (
        <Stack.Navigator
            initialRouteName='Main'
        >
            <Stack.Screen
                name="Main"
                component={TabNavigation}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />

            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />

            <Stack.Screen
                name="Address"
                component={Address}
                options={{
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="Details"
                component={Details}
                options={{
                    title: "Product Details",
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="Payment"
                component={Payment}
                options={{
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="AddNewAddress"
                component={AddNewAddress}
                options={{
                    title: 'Add New Address',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />

            <Stack.Screen
                name="BookASlot"
                component={BookASlot}

                options={{
                    title: 'Choose Order Type',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'

                }}
            />

            <Stack.Screen
                name="SlotBooked"
                component={SlotBooked}

                options={{
                    title: 'Book A Slot',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'

                }}

            />
            <Stack.Screen
                name="CheckOutSummary"
                component={CheckOutSummary}
                options={{
                    title: 'Checkout Summary',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="PayOrder"
                component={PayOrder}
                options={{
                    title: 'Select your payment method',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="Help"
                component={Help}
                options={{
                    title: 'Help',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />
            <Stack.Screen
                name="Confirmation"
                component={Confirmation}
                options={{
                    title: 'Your Order is Confirmed',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'

                }}
            />
            <Stack.Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{
                    title: 'Order History',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'


                }}
            />

            <Stack.Screen
                name="CartProductDetails"
                component={CartProductDetails}
                options={{
                    title: 'Cart Product',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'
                }}
            />
            <Stack.Screen
                name="FeaturedProducts"
                component={FeaturedProducts}
                options={{
                    title: 'Featured Products',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'
                }}
            />
            <Stack.Screen
                name="DealDetails"
                component={DealDetails}
                options={{
                    title: 'Deal Details',
                    headerStyle: {
                        backgroundColor: '#0066B1',
                    },
                    headerTitleStyle: {
                        color: 'white', fontWeight: 'bold', fontSize: 20
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: 'white'
                }}
            />

        </Stack.Navigator>
    );
}

export default AppStack;
