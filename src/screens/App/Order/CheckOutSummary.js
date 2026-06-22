/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import thumbnail from '../../../assets/no-thumbnail.png';

const COLORS = {
  primary: '#1946A9',
  background: '#e8e8e8',
  cardDark: '#FFFFFF',
  cardBorder: '#FFFFFF',
  white: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#A3A3A3',
  textDark: '#1F2937',
  discount: '#22C55E',
};

const isProductTaxable = (item) => {
  const status = (item.tax_status || '').toLowerCase();
  const taxClass = (item.tax_class || '').toLowerCase();

  if (taxClass === 'zero-rate') return false;
  if (status === 'none') return false;
  return status === 'taxable' || taxClass === 'standard-rate';
};

const formatMoney = (value = 0) => `£${Number(value || 0).toFixed(2)}`;

const Checkoutsummary = ({ navigation, route }) => {
  const { type, address, date, time, deliveryInstruction, bag, addressId } =
    route.params;

  const orderDate = useMemo(() => {
    const selectedDate = type === 'Pickup' ? new Date() : new Date(date);
    return {
      day: selectedDate.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
      date: selectedDate.getDate().toString(),
      month: selectedDate.toLocaleDateString('en-GB', { month: 'short' }),
    };
  }, [type, date]);

  const lineItems = useMemo(() => {
    const products = (bag?.products || []).map((item) => ({
      id: `product-${item.id}`,
      name: item.name,
      quantity: item.quantity || 1,
      price: Number(item.price || 0),
      thumb: item.thumb,
      tax_status: item.tax_status,
      tax_class: item.tax_class,
      isDeal: false,
    }));

    const deals = (bag?.deals || []).map((deal, index) => ({
      id: `deal-${deal.id || index}`,
      name: deal.name,
      quantity: deal.quantity || 1,
      price: Number(deal.deal_price || deal.total_price || 0),
      thumb: deal.thumb,
      tax_status: null,
      tax_class: null,
      isDeal: true,
    }));

    return [...products, ...deals];
  }, [bag]);

  const pricing = useMemo(() => {
    const discount = Number(bag?.off_amount || 0);
    const subtotal = Number(bag?.total_price || 0);
    const vat = Number(bag?.sales_tax || 0);
    const delivery = Number(bag?.delivery_charges || 0);
    const govtBagCharge = Number(bag?.govt_bag_charge || 0);
    const total = Number(bag?.total_price_inclusive_tax || 0);

    return { subtotal, discount, vat, delivery, govtBagCharge, total };
  }, [bag]);

  const continueToPay = () => {
    navigation.navigate('PayOrder', {
      bag,
      address,
      deliveryInstruction,
      date,
      time,
      type,
      voucherCode: '',
      promodiscount: { amount: 0 },
      addressId,
    });
  };

  const isPickup = type === 'Pickup';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.addressCard}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeDay}>{orderDate.day}</Text>
            <Text style={styles.dateBadgeDate}>{orderDate.date}</Text>
            <Text style={styles.dateBadgeMonth}>{orderDate.month}</Text>
          </View>

          <View style={styles.addressContent}>
            <Text style={styles.addressLabel}>
              {isPickup ? 'Pickup details' : 'Delivery address'}
            </Text>
            <Text style={styles.addressText}>
              {isPickup ? `Pickup time: ${time}` : address}
            </Text>
          </View>
        </View>

        {deliveryInstruction ? (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsLabel}>Delivery instructions</Text>
            <Text style={styles.instructionsText}>{deliveryInstruction}</Text>
          </View>
        ) : null}

        <View style={styles.itemsCard}>
          {lineItems.map((item) => {
            const lineTotal = item.price * item.quantity;

            return (
              <View key={item.id} style={styles.itemRow}>
                <Image
                  source={item.thumb ? { uri: item.thumb } : thumbnail}
                  style={styles.itemImage}
                />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>

                <View style={styles.itemPriceWrap}>
                  <Text style={styles.itemPrice}>{formatMoney(lineTotal)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.breakdownCard}>
          {[
            { label: 'Subtotal', value: formatMoney(pricing.subtotal), icon: 'tag-outline', },
            ...(pricing.discount > 0
              ? [{
                  label: 'Discount',
                  value: `- ${formatMoney(pricing.discount)}`,
                  valueStyle: styles.discountValue,
                  icon: 'cash',
                }]
              : []),
            { label: 'VAT', value: formatMoney(pricing.vat), icon: 'percent-outline', },
            ...(pricing.govtBagCharge > 0
              ? [{ label: 'Gov bag charge', value: formatMoney(pricing.govtBagCharge), icon: 'bag-suitcase-outline', }]
              : []),
            {
              label: 'Delivery',
              value: formatMoney(pricing.delivery),
              icon: 'truck-delivery-outline',
            },
          ].map((row, index, rows) => (
            <BreakdownRow
              key={row.label}
              {...row}
              isLast={index === rows.length - 1}
            />
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatMoney(pricing.total)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={continueToPay}>
          <Text style={styles.checkoutBtnText}>Continue to pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BreakdownRow = ({ label, value, valueStyle, icon, isLast }) => (
  <View style={[styles.breakdownRow, isLast && styles.breakdownRowLast]}>
    <View style={styles.breakdownLabelWrap}>
      {icon ? <Icon name={icon} size={14} color={COLORS.textSecondary} /> : null}
      <Text style={styles.breakdownLabel}>{label}</Text>
    </View>
    <Text style={[styles.breakdownValue, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  dateBadge: {
    width: 72,
    height: 88,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDay: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  dateBadgeDate: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  dateBadgeMonth: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  addressText: {
    color: COLORS.textDark,
    fontSize: 14,
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 20,
  },
  instructionsLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  instructionsText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  itemsCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    // backgroundColor: COLORS.primary,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemQty: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  itemPriceWrap: {
    alignItems: 'flex-end',
    minWidth: 72,
  },
  itemPrice: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  taxableBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  taxableBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  breakdownCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  breakdownRowLast: {
    borderBottomWidth: 0,
  },
  breakdownLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  breakdownValue: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  discountValue: {
    color: COLORS.discount,
  },
  totalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default Checkoutsummary;
