import styles from "./Styles";
import { View, Text, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import useAccount from './useAccount';
import logout from '../../../../../../src/assets/accountIcons/logout.png';

const Account = () => {
    const { options, name, SignOut, navigation, image } = useAccount();

    return (
        <View style={styles.container}>
            <View style={{ height: 100, backgroundColor: '#0066B1' }}>
            </View>
            <View>
                <View style={styles.profile}>
                    <View style={styles.image}>
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    </View>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.accountOptions}>
                        {
                            options.map(option => (
                                <TouchableOpacity key={option.key}
                                    onPress={() => {
                                        if (option.key === '1') {
                                            navigation.navigate('OrderHistory' as never);
                                        }
                                        else if (option.key === '2') {
                                            navigation.navigate('Profile' as never);
                                        } else if (option.key === '3') {
                                            navigation.navigate('Address' as never);
                                        } else if (option.key === '4') {
                                            navigation.navigate('Payment' as never);
                                        } else if (option.key === '8') {
                                            navigation.navigate('Help' as never);
                                        }
                                        else {
                                            Alert.alert('You clicked', option.label)
                                        }
                                    }}>

                                    <View style={styles.options}>
                                        <Image source={option.icon} style={{ marginRight: 15, tintColor: "#0066b1" }} />
                                        <Text style={styles.optionText}>{option.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                        <TouchableOpacity onPress={SignOut}>
                            <View style={styles.options}>
                                <Image source={logout} style={{ marginRight: 15, tintColor: "#0066b1" }} />
                                <Text style={styles.optionText}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView >
            </View>
        </View >
    )
}

export default Account