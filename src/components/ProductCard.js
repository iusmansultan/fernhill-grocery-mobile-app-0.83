import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import heartIcon from "../assets/heartIcon.png";
import heartFillIcon from "../assets/heartFillIcon.png";
import { useNavigation } from "@react-navigation/native";
import thumbnail from "../assets/no-thumbnail.png";
import Toast from "react-native-simple-toast";
import { useAppSelector, useAppDispatch } from "../redux/Hooks";
import { saveFav } from "../redux/auth/AuthSlice";
import { addItem } from "../redux/bag/BagSlice";
import { AddFav } from "../redux/fav/FavSlice";
import {
  AddProdToFav,
  GetFavProducts,
  AddProductToCart,
  RemoveProdToFav,
  GetUserCart,
} from "../helpers/Backend";
import plus from "../assets/accountIcons/plus.png";
import min from "../assets/accountIcons/min.png";
import { ActivityIndicator } from "react-native-paper";

const ProductCard = ({ id, image, price, name, description, isFav }) => {
  const defaultImage =
    "http://mckinleytrade.com/public/images/no-thumbnail.jpg";
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const [qty, setQty] = useState(1);

  const [favProducts, setFavProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFav = () => {
    const body = {
      productId: id,
      userId: user.userData.id,
    };

    AddProdToFav(token, body)
      .then((res) => {
        GetFavProducts(token, user.userData.id)
          .then((res) => {
            dispatch(saveFav(res.data.data));
            dispatch(AddFav(res.data.data));
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        Alert.alert("Error", "Something went wrong");
      });
  };

  const handleRemoveFav = () => {
    const body = {
      productId: id,
      userId: user.userData.id,
    };

    RemoveProdToFav(token, body)
      .then((res) => {
        GetFavProducts(token, user.userData.id)
          .then((res) => {
            dispatch(saveFav(res.data.data));
            dispatch(AddFav(res.data.data));
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        Alert.alert("Error", "Something went wrong");
      });
  };

  const AddToBag = () => {
    setLoading(true);
    const body = {
      productId: id,
      userId: user.userData.id,
      qty: qty,
    };

    AddProductToCart(token, body)
      .then((res) => {
          setLoading(false);
          GetUserCart(token, user.userData.id)
            .then((res) => {
              console.log("CART",res.data);
              dispatch(addItem(res.data.data))
              Toast.show("Product added to bag");
            })
            .catch((err) => {
              setLoading(false);
              Toast.show("Something went wrong");
              console.log(err);
            });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={[styles.productCard, styles.shadowProp]}>
      <View
        style={{
          height: "10%",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={handleFav}
          style={{
            width: "100%",
            height: 30,
            padding: 2,
            // backgroundColor: 'green',
          }}
        >
          {isFav ? (
            <Image source={heartFillIcon} style={styles.favImage} />
          ) : (
            <Image source={heartIcon} style={styles.favImage} />
          )}
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: "72%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Details", { id: id });
          }}
        >
          <View>
            <View style={styles.prodImage}>
              {image !== "" ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Image
                  source={thumbnail}
                  style={{
                    width: "75%",
                    height: "75%",
                    opacity: 0.5,
                    aspectRatio: 1,
                  }}
                />
              )}
            </View>
            <View style={styles.prodDetails}>
              <View>
                <Text
                  style={{ color: "black", paddingLeft: 5 }}
                  numberOfLines={1}
                >
                  {name}
                </Text>
                <Text
                  style={{ color: "black", paddingLeft: 5, marginBottom: 5 }}
                >
                  £{price}
                </Text>
              </View>
              {/* <Text numberOfLines={2} style={{ color: 'black' }}>{description}</Text> */}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomViewBtn}>
        <View style={styles.qtyBtn}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (qty > 1) {
                  setQty(qty - 1);
                }
              }}
            >
              <Image source={min} style={styles.qtyBtnImg} />
            </TouchableOpacity>
            <Text style={styles.qtyBtnText}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty(qty + 1)}>
              <Image source={plus} style={styles.qtyBtnImg} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={AddToBag} style={styles.btnAddtoBag}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.btnText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: "48%",
    backgroundColor: "white",
    height: 280,
    padding: 8,
    marginBottom: 15,
    borderRadius: 15,
  },
  shadowProp: {
    borderWidth: 3,
    borderColor: "#e8e8e8",
  },
  prodImage: {
    height: "80%",
    width: "100%",
    resizeMode: "contain",
    alignItems: "center",
  },
  prodDetails: {
    paddingTop: 5,
    height: "20%",
  },
  favImage: {
    marginLeft: "88%",
    width: 18,
    height: 18,
    // padding: 6,
  },
  bottomViewBtn: {
    marginTop: 13,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    height: "10%",
  },
  qtyBtn: {
    width: "40%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'blue',
    // paddingBottom: 5
  },
  btnAddtoBag: {
    width: "50%",
    backgroundColor: "#0066B1",
    borderRadius: 50,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnImg: {
    width: 10,
    height: 18,
    aspectRatio: 1,
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  qtyBtnText: {
    color: "black",
  },
});

export default ProductCard;
