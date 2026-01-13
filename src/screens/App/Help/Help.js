import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

const Help = () => {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 3
                    }}>Fernhill Grocery</Text>
                    <Text style={{
                        color: '#707070',
                        fontSize: 16,
                        lineHeight: 25
                    }}>www.fernhillgrocery.co.uk</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 3
                    }}>Phone</Text>
                    <Text style={{
                        color: '#707070',
                        fontSize: 16,
                        lineHeight: 25
                    }}>+44 111-000-011</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 3
                    }}>Contact</Text>
                    <Text style={{
                        color: '#707070',
                        fontSize: 16,
                        lineHeight: 25
                    }}>contact@fernhillgrocery.co.uk</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 3
                    }}>Privacy Policy</Text>
                    <Text style={{
                        color: '#707070',
                        fontSize: 16,
                        lineHeight: 25
                    }}>We build a range of services that help millions of people daily to explore and interact with the world in new ways. Our services include:
                        {'\n'}
                        Google apps, sites and devices, such as Search, YouTube and Google Home
                        Platforms such as the Chrome browser and Android operating system
                        Products that are integrated into third-party apps and sites, such as ads and embedded Google Maps
                        You can use our services in a variety of ways to manage your privacy. For example, you can sign up for a Google Account if you want to create and manage content such as emails and photos, or to see more relevant search results. And you can use many Google services when you’re signed out or without creating an account at all; for example, searching on Google or watching YouTube videos. You can also choose to browse the web privately using Chrome in Incognito mode. And across our services, you can adjust your privacy settings to control what we collect and how your information is used.</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 3
                    }}>Terms and Conditions</Text>
                    <Text style={{
                        color: '#707070',
                        fontSize: 16,
                        lineHeight: 25
                    }}>
                        We build a range of services that help millions of people daily to explore and interact with the world in new ways. Our services include:
                        {'\n'}
                        Google apps, sites and devices, such as Search, YouTube and Google Home
                        Platforms such as the Chrome browser and Android operating system
                        Products that are integrated into third-party apps and sites, such as ads and embedded Google Maps
                        You can use our services in a variety of ways to manage your privacy. For example, you can sign up for a Google Account if you want to create and manage content such as emails and photos, or to see more relevant search results. And you can use many Google services when you’re signed out or without creating an account at all; for example, searching on Google or watching YouTube videos. You can also choose to browse the web privately using Chrome in Incognito mode. And across our services, you can adjust your privacy settings to control what we collect and how your information is used.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
    }
})

export default Help;
