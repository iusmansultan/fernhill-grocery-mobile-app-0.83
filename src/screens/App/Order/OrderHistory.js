/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import { useAppSelector } from "../../../redux/Hooks";
import { GetOrders } from "../../../helpers/Backend";
import ProductLoader from "../../../components/ProductLoader";
import Moment from "moment";

const OrderHistory = ({ navigation }) => {

  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);

  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    GetOrdersData("0", "100");
  }, []);

  const GetOrdersData = (p, l) => {
    setLoading(true);
    GetOrders(user.userData.id, token, p, l)
      .then((res) => {
        console.log("RESRESRESRESRESRES", res);
        // eslint-disable-next-line valid-typeof
        if (typeof res !== "{}") {
          // setPagination(res.pagination);
          setOrders(res);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ProductLoader />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {orders.length === 0 ? (
          <Text style={{ color: "black" }}>No Orders found</Text>
        ) : (
          orders &&
          orders.map((items, index) => {
            return (
              <View style={styles.OrderContainer} key={index}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 70,
                    // paddingLeft: 15,
                    padding: 10,
                    backgroundColor: "#0066B1",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {items.status === "ON_THE_WAY"
                        ? "Order in on the way"
                        : items.status === "ORDER_CONFIRMED"
                        ? "Order Confirmed"
                        : items.status === "PENDING"
                        ? "Order Pending"
                        : items.status === "ACCEPTED_BY_DRIVER"
                        ? "Order Accepted by Driver"
                        : items.status === "COMPLETED"
                        ? "Order Completed"
                        : null}
                    </Text>
                    <Text style={{ color: "white" }}>
                      {Moment(new Date(items.delivery_details.delivery_date))
                        .format("ddd, Do MMM YYYY")
                        .toString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        textAlign: "right",
                      }}
                    >
                      £{items.total}
                    </Text>
                  </View>
                </View>
                {items.products.map((item, ind) => {
                  console.log("+++++++++>", item);
                  return (
                    <View
                      key={ind}
                      style={{
                        width: "100%",
                        height: 80,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        padding: 10,
                        backgroundColor: "white",
                      }}
                    >
                      <View style={styles.items}>
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.thumb }}
                            style={styles.image}
                          />
                        </View>
                        <View style={styles.itemDetails}>
                          <Text style={styles.itemName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemName} numberOfLines={2}>
                            Quantity: {item.quantity}
                          </Text>
                        </View>
                        <View style={styles.itemPriceContainer}>
                          <Text style={styles.itemPrice}>
                            £{item.price.toFixed(2)}
                          </Text>
                          <Text style={styles.itemPrice}>
                            £{item.price.toFixed(2) * item.quantity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
                {items.deals && items.deals.length > 0 && items.deals.map((deal, dealIndex) => (
                  <View key={`deal-${dealIndex}`} style={styles.dealContainer}>
                    <View style={styles.dealHeader}>
                      <View style={styles.dealBadge}>
                        <Text style={styles.dealBadgeText}>DEAL</Text>
                      </View>
                      <View style={styles.dealHeaderInfo}>
                        <Text style={styles.dealName} numberOfLines={1}>
                          {deal.name}
                        </Text>
                        <Text style={styles.dealQty}>Qty: {deal.quantity}</Text>
                      </View>
                      <View style={styles.dealPriceContainer}>
                        <Text style={styles.dealPrice}>
                          £{(deal.price * deal.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dealProductsContainer}>
                      <Text style={styles.dealProductsTitle}>Products in this deal:</Text>
                      {deal.products && deal.products.map((product, prodIndex) => (
                        <View key={`deal-product-${prodIndex}`} style={styles.dealProductItem}>
                          <View style={styles.dealProductImageContainer}>
                            <Image
                              source={{ uri: product.product_thumb }}
                              style={styles.dealProductImage}
                            />
                          </View>
                          <View style={styles.dealProductDetails}>
                            <Text style={styles.dealProductName} numberOfLines={2}>
                              {product.product_name}
                            </Text>
                            <Text style={styles.dealProductQty}>
                              Qty: {product.quantity} {product.product_unit}
                            </Text>
                          </View>
                          <View style={styles.dealProductPriceContainer}>
                            <Text style={styles.dealProductPrice}>
                              £{product.product_price.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}

                <View
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    paddingBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 10,
                    }}
                  >
                    Other Charges:
                  </Text>

                  <View
                    style={{
                      width: "97%",
                      height: 25,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        Tax:
                      </Text>
                    </View>
                    <View style={styles.itemPriceContainer}>
                      <Text style={styles.itemPrice}>
                        £{items.delivery_details?.others?.sales_tax.toFixed(2) || 0}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "97%",
                      height: 25,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        Service Charges:
                      </Text>
                    </View>
                    <View style={styles.itemPriceContainer}>
                      <Text style={styles.itemPrice}>
                        £
                        {items.delivery_details?.others?.delivery_charges.toFixed(
                          2
                        ) || 0}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "97%",
                      height: 25,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        Discount:
                      </Text>
                    </View>
                    <View style={styles.itemPriceContainer}>
                      <Text style={styles.itemPrice}>£0</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  OrderContainer: {
    width: "95%",
    borderWidth: 2,
    borderColor: "#0066B1",
    borderRadius: 20,
    marginBottom: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  items: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  imageContainer: {
    width: "20%",
  },
  itemPriceContainer: {
    width: "13%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    width: "60%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    color: "#0066B1",
  },
  itemPrice: {
    textAlign: "right",
    color: "#0066B1",
  },
  dealContainer: {
    width: "100%",
    // backgroundColor: "#FFF8E7",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B00",
    // marginTop: 5,
  },
  dealHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFF8E7",
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
  },
  dealBadge: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  dealBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  dealHeaderInfo: {
    flex: 1,
  },
  dealName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dealQty: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  dealPriceContainer: {
    alignItems: "flex-end",
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B00",
  },
  dealProductsContainer: {
    padding: 10,
    backgroundColor: "#FFFDF5",
  },
  dealProductsTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  dealProductItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0e6d3",
  },
  dealProductImageContainer: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  dealProductImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    resizeMode: "cover",
  },
  dealProductDetails: {
    flex: 1,
  },
  dealProductName: {
    fontSize: 13,
    color: "#333",
  },
  dealProductQty: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  dealProductPriceContainer: {
    alignItems: "flex-end",
  },
  dealProductPrice: {
    fontSize: 12,
    color: "#666",
  },
});

export default OrderHistory;
