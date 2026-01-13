import { View, Image, StatusBar, ScrollView, Platform, Text } from "react-native";
import styles from "./Styles";
import logo from '../../../../../assets/logoW.png';
import useFavorites from "./useFavorites";
import Loader from "../../../../../components/ProductLoader";
import ProductCard from "../../../../../components/ProductCard";

const Favorites = () => {
    const { products, loading } = useFavorites();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View>
                <View style={styles.statusBarContainer}>
                    <StatusBar backgroundColor={'#0066B1'} barStyle="light-content" />
                </View>
                <View style={styles.topBar}>
                    <Image source={logo} style={styles.logoSmall} />
                    <Text style={styles.headerTitle}>Favorites</Text>
                </View>
                <Text style={styles.emptyMessage}>
                    No products favorited! Why don't add some products to your list.
                </Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.statusBarContainer}>
                <StatusBar backgroundColor={'#0066B1'} barStyle="light-content" />
                {Platform.OS === 'ios' && <View style={styles.iosStatusBar} />}
            </View>
            <View>
                <View style={styles.topBar}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.headerTitle}>Favorites</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    <View style={styles.productView}>
                        {products && products.map((product: any, index: number) => (
                            <ProductCard
                                key={index}
                                id={product.Product.id}
                                image={product.Product.thumb}
                                price={product.Product.price}
                                description={product.Product.description}
                                name={product.Product.name}
                                isFav={true}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Favorites;
