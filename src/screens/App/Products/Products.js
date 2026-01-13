import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import ProductCard from '../../../components/ProductCard';
import { getProductsByCategory } from '../../../helpers/Backend';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { useAppSelector } from '../../../redux/Hooks';
import Loader from '../../../components/ProductLoader';

const Products = ({ route }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const storeId = useAppSelector((state) => state.user.storeId);
    const fav = useAppSelector((state) => state.user.fav);
    const [selected, setSelected] = useState("");

    useEffect(() => {
        setLoading(true)
        if (category.sub_categories.length === 0) {
            GetProducts(category.id)
        } else {
            GetProducts(category.sub_categories[0].id)
            setSelected(category.sub_categories[0].id)
        }
    }, [])

    const GetProducts = (id) => {
        getProductsByCategory(id, storeId)
            .then(res => {
                console.log ("RES=>", res.data)
                setProducts(res.data.data);
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            <ScrollView showsVerticalScrollIndicator={false}  >
                <View style={styles.container}>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {
                                (category.sub_categories).map((subCategory, index) => {
                                    return (
                                        <TouchableOpacity key={index}
                                            onPress={() => {
                                                setLoading(true);
                                                GetProducts(subCategory.id)
                                                setSelected(subCategory.id)
                                            }}
                                        >
                                            {
                                                (subCategory.category_id === selected)
                                                    ? <View style={{
                                                        margin: 5,
                                                        backgroundColor: 'white',
                                                        borderWidth: 1,
                                                        borderColor: '#0066B1',
                                                        padding: 15,
                                                        paddingLeft: 25,
                                                        paddingRight: 25,
                                                        borderRadius: 50,
                                                    }}>
                                                        <Text style={{ color: '#0066B1', fontSize: 15 }}>{subCategory.name}</Text>
                                                    </View>
                                                    : <View style={{
                                                        margin: 5,
                                                        backgroundColor: '#0066B1',
                                                        padding: 15,
                                                        paddingLeft: 25,
                                                        paddingRight: 25,
                                                        borderRadius: 50,
                                                    }}>
                                                        <Text style={{ color: 'white', fontSize: 15 }}>{subCategory.name}</Text>
                                                    </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>

                    <View style={styles.productView}>
                        {
                            (loading !== true)
                                ? (
                                    (products.length > 0)
                                        ? products.map((product, index) => {
                                            return (
                                                <ProductCard key={index}
                                                    id={product.product_id}
                                                    image={product.thumb}
                                                    price={product.price}
                                                    description={product.description}
                                                    name={product.name}
                                                    isFav={fav.some(element => {
                                                        if (element.product_id === product.product_id)
                                                            return true;
                                                        else
                                                            return false;
                                                    })}
                                                />
                                            )
                                        }) : <View
                                            style={{
                                                width: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: 20,
                                            }}
                                        >
                                            <Text style={{ color: 'black', justifyContent: 'center', textAlign: 'center', fontSize: 18 }}>
                                                No Products found
                                            </Text>
                                        </View>
                                ) : <View
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    <Loader />
                                </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: 30
    },
    productView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 15,
        marginBottom: 50,
    }
})

export default Products;
