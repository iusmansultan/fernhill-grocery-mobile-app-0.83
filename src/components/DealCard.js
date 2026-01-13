import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import thumbnail from '../assets/no-thumbnail.png';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const DealCard = ({ deal }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DealDetails', { deal });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={deal.thumb ? { uri: deal.thumb } : thumbnail}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{deal.discount_percentage}% OFF</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.dealPrice}>£{deal.deal_price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>£{deal.original_price.toFixed(2)}</Text>
        </View>
        <Text style={styles.productsCount}>
          {deal.products.length} product{deal.products.length > 1 ? 's' : ''} included
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066B1',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  productsCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default DealCard;
