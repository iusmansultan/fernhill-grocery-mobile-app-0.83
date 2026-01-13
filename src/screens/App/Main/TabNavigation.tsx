import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import homeIcon from '../../../../src/assets/homeIcon.png';
import categoryIcon from '../../../../src/assets/categoryIcon.png';
import favIcon from '../../../../src/assets/favIcon.png';
import accountIcon from '../../../../src/assets/accountIcon.png';
import bagIcon from '../../../../src/assets/bagIcon.png';

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

    const [routes] = useState([
        { key: 'home', title: 'Home' },
        { key: 'category', title: 'Categories' },
        { key: 'fav', title: 'Favorites' },
        { key: 'account', title: 'Account' },
        { key: 'bag', title: '' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        category: Categories,
        fav: Favorites,
        bag: Bag,
        account: Account,
        Details: Details,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={Styles.barStyles}
            sceneAnimationEnabled={true}
            shifting={false}
            activeIndicatorStyle={Styles.activeIndicatorStyle}
            renderLabel={({ route }) => {
                return (
                    <Text style={Styles.labelStyle}>{route.title}</Text>
                );
            }}
            renderIcon={({ route, focused }) => {
                if (route.key === 'bag') {
                    return <BagItemIcon focused={focused} />;
                }
                if (route.key === 'fav') {
                    return <FavItemIcon focused={focused} />;
                }
                const iconMap: Record<string, any> = {
                    home: homeIcon,
                    category: categoryIcon,
                    account: accountIcon,
                    bag: bagIcon,
                    fav: favIcon,
                };
                const source = iconMap[route.key];
                return (
                    <Image
                        source={source}
                        style={focused ? Styles.focusedIconStyle : Styles.iconStyle}
                    />
                );
            }}
        />
    );
};

export default TabNavigation;

const BagItemIcon = ({ focused }: { focused: boolean }) => {
    const number = useAppSelector((state: any) => state.bag.value);
    const Total = useAppSelector((state: any) => state.bag.total);

    return (
        number.length > 0
            ? <View style={{
                position: 'absolute',
                alignItems: 'center',
            }}>
                <Image source={bagIcon} style={{
                    tintColor: focused ? 'white' : 'gray',
                    height: 22,
                    width: 22,
                    resizeMode: 'contain'
                }} />
                <View
                    style={{
                        position: 'relative',
                        bottom: 27,
                        right: -10,
                        backgroundColor: 'red',
                        padding: 2,
                        borderRadius: 50,
                        width: 20,
                        height: 20
                    }}
                >
                    <Text style={{
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>{number.length}</Text>
                </View>
                <View
                    style={{
                        position: 'relative',
                        bottom: 20,
                        padding: 2,
                        width: 50,
                    }}
                >
                    <Text style={{
                        color: 'white',
                        textAlign: 'center',
                        overflow: 'hidden',
                    }} numberOfLines={1}>£{Total.toFixed(2)}</Text>
                </View>
            </View>
            : <View>
                <Image source={bagIcon} style={{
                    height: 22,
                    width: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? 'white' : 'gray'
                }} />
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    overflow: 'hidden',
                    marginTop: 5
                }} numberOfLines={1}>Bag</Text>
            </View>

    )
}

const FavItemIcon = ({ focused }: { focused: boolean }) => {
    const number = useAppSelector((state: any) => state.fav.value);

    return (
        number.length !== '0'
            ? <View style={{
                position: 'absolute',
            }}>
                <Image
                    source={favIcon}
                    style={{
                        tintColor: focused ? 'white' : 'gray',
                        height: 22,
                        width: 22,
                        resizeMode: 'contain'
                    }}
                />
                <View
                    style={{
                        position: 'relative',
                        bottom: 25,
                        right: -10,
                        backgroundColor: 'red',
                        padding: 2,
                        borderRadius: 50,
                    }}
                >
                    <Text style={{
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}>{number.length}</Text>
                </View>
            </View>
            : <Image source={favIcon} />

    )
}