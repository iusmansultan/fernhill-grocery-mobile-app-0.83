/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GetProductDetails, AddProductToCart, AddProdToFav, RemoveProdToFav, GetFavProducts, GetUserCart } from '../../../helpers/Backend';
import { useAppSelector, useAppDispatch } from '../../../redux/Hooks';
import { useNavigation } from '@react-navigation/native';
import { saveFav } from '../../../redux/auth/AuthSlice';
import { AddFav } from '../../../redux/fav/FavSlice';
import { addItem } from '../../../redux/bag/BagSlice';
import Toast from 'react-native-simple-toast';
import Loader from '../../../components/ProductLoader';
import thumbnail from '../../../assets/no-thumbnail.png';
import plus from '../../../assets/accountIcons/plus.png';
import min from '../../../assets/accountIcons/min.png';
import heartIcon from '../../../assets/heartIcon.png';
import heartFillIcon from '../../../assets/heartFillIcon.png';


const CartProductDetails = ({ route }) => {
  const token = useAppSelector(state => state.user.token);
  const user = useAppSelector(state => state.user.value);
  const fav = useAppSelector((state) => state.user.fav);
  const navigation = useNavigation();
  const [favorite, setFavorite] = useState(false);
  const dispatch = useAppDispatch();

  const { product } = route.params;
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(product.qty);


  useEffect(() => {
    // GetDetails();
    CheckFavorite();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // const GetDetails = () => {
  //     setLoading(true);
  //     GetProductDetails(token, id)
  //          .then((res) => {
  //            console.log("HEHHEHE", res.data);
  //            setProduct(res.data.data[0]);
  //            setLoading(false);
  //          })
  //          .catch((err) => {
  //            console.log(err);
  //            setLoading(false);
  //          });
  // }

  const CheckFavorite = () => {
    const favi = fav.filter(prod => {
      if (prod.id === product.Product.id) {
        return prod;
      }
    })
    if (favi.length > 0) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }

  const AddToBag = async () => {
    setLoading(true);
    let tempQty = qty;
    if (qty !== product.qty) {
      if (qty > product.qty) {
        tempQty = qty - product.qty;
      } else {
        tempQty = product.qty - qty;
        tempQty = -tempQty;
      }

      const body = {
        productId: product.Product.id,
        userId: user.userData.id,
        qty: tempQty,
      };

      try {
        const addToCartResponse = await AddProductToCart(token, body);
        console.log("addToCartResponse", addToCartResponse);
        const userCart = await GetUserCart(token, user.userData.id);
        console.log("userCart", userCart);
        dispatch(addItem(userCart.data.data));
        Toast.show("Product added to bag");
        setLoading(false);
        navigation.pop();
      } catch (e) {
        setLoading(false);
        console.log("e", e);
      }
    } else {
      navigation.pop()
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
      </View>
    )
  }


  const handleFav = () => {
    const body = {
      "product_id": product.id,
      "user_id": user.userData.user_id
    };


    AddProdToFav(token, body)
      .then(response => {
        GetFavProducts(token, user.userData.id)
          .then(res => {
            setFavorite(true);
            dispatch(saveFav(res.data.data))
            dispatch(AddFav(res.data.data))
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(() => {
        Alert.alert("Error", "Something went wrong")
      })
  }

  const handleRemoveFav = () => {
    const body = {
      "productId": product.id,
      "userId": user.userData.id
    };

    RemoveProdToFav(token, body)
      .then(response => {
        GetFavProducts(token, user.userData.id)
          .then(res => {
            setFavorite(false);
            dispatch(saveFav(res.data.data))
            dispatch(AddFav(res.data.data))
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch(() => {
        Alert.alert("Error", "Something went wrong")
      })

  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: "10%",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              favorite ? handleRemoveFav() : handleFav();
            }}
            style={{
              width: "100%",
              height: 30,
              padding: 2,
              // backgroundColor: 'green',
            }}
          >
            {favorite ? (
              <Image source={heartFillIcon} style={styles.favImage} />
            ) : (
              <Image source={heartIcon} style={styles.favImage} />
            )}
          </TouchableOpacity>
        </View>
        {product.thumb !== "" ? (
          <Image
            source={{ uri: product.Product.thumb }}
            style={styles.image}
          />
        ) : (
          <Image source={thumbnail} style={styles.image} />
        )}
        {/* <View
                    style={{
                        width: '50%',
                        alignSelf: 'flex-end',
                    }}
                >
                    <Rating rating={product.rating} />
                </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            margin: 10,
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <View>
            <Text style={styles.name}>{product.Product.name}</Text>
            <Text style={styles.price}>
              £{(product.Product.price * qty).toFixed(2)}
            </Text>
          </View>
        </View>
        <View
          style={{
            margin: 10,
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "black",
              marginBottom: 10,
            }}
          >
            Product Description:
          </Text>
          <Text style={styles.dis}>{product.Product.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>
          Quantity:
        </Text>
        <View style={styles.bottomViewBtn}>
          <View style={styles.qtyBtn}>
            <View
              style={{
                width: "80%",
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
          <View style={styles.btnAddtoBag}>
            <TouchableOpacity onPress={AddToBag}>
              <Text style={styles.btnText}>Add to bag</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },

  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  dis: {
    color: 'black',
    fontSize: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066B1',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',

    color: 'black',
  },
  bottomView: {
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    margin: 10,
    paddingLeft: 15,
    paddingRight: 15,

  },
  bottomViewBtn: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qtyBtn: {
    width: '40%',
    height: 55,
    borderWidth: 2,
    borderColor: '#0066B1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  btnAddtoBag: {
    width: '50%',
    height: 55,
    backgroundColor: '#0066B1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyBtnText: {
    color: 'black'
  },
  qtyBtnImg: {
    width: 20,
    height: 20,
  },
  favImage: {
    marginLeft: '86%',
    width: 18,
    height: 18,
    // padding: 6,
  },
})

export default CartProductDetails;


