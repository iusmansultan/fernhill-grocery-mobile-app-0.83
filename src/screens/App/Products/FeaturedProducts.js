import React, { useState, useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { GetFeaturedProducts } from "../../../helpers/Backend";
import Loader from "../../../components/ProductLoader";
import ProductCard from "../../../components/ProductCard";

import { useAppSelector } from "../../../redux/Hooks";

const FeaturedProducts = () => {
  const fav = useAppSelector((state) => state.user.fav);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetFeaturedProducts()
      .then((res) => {
        setProducts(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.productsView}>
        {products.length > 0 ? (
          products.map((product, index) => {
            return (
              <ProductCard
                key={index}
                id={product.id}
                image={product.thumb}
                price={product.price}
                description={product.description}
                name={product.name}
                isFav={fav.some((element) => {
                  if (element.Product.id === product.id) return true;
                  else return false;
                })}
              />
            );
          })
        ) : (
          <Text style={styles.noProducts}>No products found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  productsView: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default FeaturedProducts;
