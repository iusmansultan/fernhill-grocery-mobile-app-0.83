import React, { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from "./Tabs/Dashboard/Home";
import Categories from "./Tabs/Categories/Categories";
import Favorites from "./Tabs/Favorites/Favorites";
import Bag from "./Tabs/Bag/Bag";
import Details from '../Products/Details';
import Account from './Tabs/Account/Account';

import { useAppSelector } from '../../../redux/Hooks';
import Styles from './Styles';

const TabNavigation = () => {
    const [index, setIndex] = useState(0);
    const favProducts = useAppSelector((state: any) => state.fav.value);
    const bagItems = useAppSelector((state: any) => state.bag.value);
    const Total = useAppSelector((state: any) => state.bag.total);


    const [routes] = useState([
        { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'category', title: 'Categories', focusedIcon: 'view-grid', unfocusedIcon: 'view-grid-outline' },
        { key: 'fav', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
        { key: 'account', title: 'Account', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
        { key: 'bag', title: 'Bag', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        category: Categories,
        fav: Favorites,
        bag: Bag,
        account: Account,
        Details: Details,
    });

    const getBadge = ({route}: any) => {
        console.log('route', route.key);
        if (route.key === 'fav' && favProducts.length > 0) {
            return favProducts.length;
        }
        if (route.key === 'bag' && bagItems.length > 0) {
            return bagItems.length;
        }
        return undefined;
    };

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={Styles.barStyles}
            sceneAnimationEnabled={true}
            shifting={false}
            activeIndicatorStyle={Styles.activeIndicatorStyle}
            getBadge={(route) => getBadge(route)}
            renderLabel={({ route }) => {
                return (route.key === 'bag' && bagItems.length > 0) ? (
                    <Text style={Styles.labelStyle}>£{Total.toFixed(2)}</Text>
                ) : (
                    <Text style={Styles.labelStyle}>{route.title}</Text>
                );
            }}
            renderIcon={({ route, focused }) => {
                const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
                return (
                    <Icon
                        name={iconName}
                        size={26}
                        color={focused ? 'white' : '#bac2fb'}
                    />
                );
            }}
        />
    );
};

export default TabNavigation;