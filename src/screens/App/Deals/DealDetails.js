import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../../redux/Hooks';
import { AddDealToCart, GetUserCart } from '../../../helpers/Backend';
import { addItem } from '../../../redux/bag/BagSlice';
import Toast from 'react-native-simple-toast';
import Loader from '../../../components/ProductLoader';
import thumbnail from '../../../assets/no-thumbnail.png';
import plus from '../../../assets/accountIcons/plus.png';
import min from '../../../assets/accountIcons/min.png';

const DealDetails = ({ route }) => {
  const { deal } = route.params;
  const navigation = useNavigation();
  const token = useAppSelector((state) => state.user.token);
  const user = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const maxQty = deal.max_quantity || 10;

  const AddDealToBag = async () => {
    setLoading(true);
    try {
      const body = {
        dealId: deal.id,
        userId: user.userData.id,
        qty: qty,
      }

      await AddDealToCart(token, body);
      const userCart = await GetUserCart(token, user.userData.id);
      console.log("userCart", userCart);
      dispatch(addItem(userCart.data.data));
      Toast.show('Deal added to bag');
      setLoading(false);
      navigation.pop();
    } catch (e) {
      setLoading(false);
      console.log('Error adding deal to bag:', e);
      Alert.alert('Error', 'Failed to add deal to bag');
    }
  };

  return (
    <View style={styles.container}>
      {
        loading && (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        )
      }
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={deal.thumb ? { uri: deal.thumb } : thumbnail}
          style={styles.image}
        />

        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{deal.discount_percentage}% OFF</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{deal.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.dealPrice}>£{deal.deal_price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>
              £{deal.original_price.toFixed(2)}
            </Text>
            <Text style={styles.savings}>
              Save £{(deal.original_price - deal.deal_price).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.description}>{deal.description}</Text>

          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Products Included:</Text>
            {deal.products.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Image
                  source={
                    product.product_thumb
                      ? { uri: product.product_thumb }
                      : thumbnail
                  }
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.product_name}
                  </Text>
                  <Text style={styles.productQty}>
                    Qty: {product.quantity} {product.product_unit}
                  </Text>
                  <Text style={styles.productPrice}>
                    £{product.product_price.toFixed(2)} each
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomView}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <View style={styles.bottomViewBtn}>
          <View style={styles.qtyBtn}>
            <View style={styles.qtyBtnInner}>
              <TouchableOpacity
                onPress={() => {
                  if (qty > 1) {
                    setQty(qty - 1);
                  }
                }}>
                <Image source={min} style={styles.qtyBtnImg} />
              </TouchableOpacity>
              <Text style={styles.qtyBtnText}>{qty}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (qty < maxQty) {
                    setQty(qty + 1);
                  } else {
                    Toast.show(`Maximum ${maxQty} allowed`);
                  }
                }}>
                <Image source={plus} style={styles.qtyBtnImg} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.btnAddtoBag} onPress={AddDealToBag}>
            <Text style={styles.btnText}>
              Add to bag - £{(deal.deal_price * qty).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066B1',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  dealPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0066B1',
    marginRight: 15,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 15,
  },
  savings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#5c5c5b',
    lineHeight: 22,
    marginBottom: 20,
  },
  productsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productQty: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 13,
    color: '#0066B1',
    fontWeight: '500',
  },
  bottomView: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quantityLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  bottomViewBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qtyBtn: {
    width: '30%',
    height: 55,
    borderWidth: 2,
    borderColor: '#0066B1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  qtyBtnInner: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnAddtoBag: {
    width: '65%',
    height: 55,
    backgroundColor: '#0066B1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyBtnText: {
    color: 'black',
    fontSize: 16,
  },
  qtyBtnImg: {
    width: 20,
    height: 20,
  },
});

export default DealDetails;
