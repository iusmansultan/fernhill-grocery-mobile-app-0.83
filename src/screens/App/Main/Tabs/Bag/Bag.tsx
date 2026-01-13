import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import styles from "./Styles";
import useBag from "./useBag";
import Loader from "../../../../../components/ProductLoader";
import empty_cart from "../../../../../assets/empty_cart.png";
import thumbnail from "../../../../../assets/no-thumbnail.png";
import remove from "../../../../../assets/remove.png";
import logo from "../../../../../assets/logoW.png";
import basket from "../../../../../assets/basket.png";

const Bag = () => {
    const {
        cart,
        total,
        loading,
        buttonLoading,
        navigation,
        RemoveProduct,
        CheckOut,
        ClearCart,
        removeDealFromCart
    } = useBag();

    // eslint-disable-next-line react/no-unstable-nested-components
    const OnRightSwipe = (id: any, type: string) => (
        <View style={styles.swipeDeleteContainer}>
            <TouchableOpacity onPress={() => type === "deal" ? removeDealFromCart(id) : RemoveProduct(id)}>
                <View style={styles.swipeDeleteBtn}>
                    <Image source={remove} style={styles.swipeDeleteIcon} />
                </View>
            </TouchableOpacity>
        </View>
    );

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyContainerInner}>
                    <View style={styles.statusBarContainer}>
                        <StatusBar backgroundColor={"#0066B1"} barStyle="light-content" />
                    </View>
                    <View style={styles.topBar}>
                        <Image source={logo} style={styles.logo} />
                        <Text style={styles.headerTitle}>Cart</Text>
                    </View>
                </View>
                <Image source={empty_cart} style={styles.emptyCartImage} />
            </View>
        );
    }

    return (
        <>
            <View style={styles.statusBarContainer}>
                <StatusBar backgroundColor={"#0066B1"} barStyle="light-content" />
            </View>
            {
                loading && (
                    <View style={styles.loadingContainer}>
                        <Loader />
                    </View>
                )
            }
            <View style={styles.container}>
                <View style={styles.containerInner}>
                    <View style={styles.topBar}>
                        <View style={styles.topBarRow}>
                            <Image style={styles.basketIcon} source={basket} />
                            <Text style={styles.basketTitle}>Basket</Text>
                        </View>
                        <TouchableOpacity onPress={ClearCart} style={styles.clearCartBtn}>
                            <Text style={styles.clearCartBtnText}>Clear Cart</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cartContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {cart.map((item: any, index: number) => (
                                <View style={item.item_type === "deal" ? styles.dealItemContainer : styles.itemContainer} key={index}>
                                    <Swipeable
                                        renderRightActions={() => OnRightSwipe(item.item_type === "deal" ? item.deal_id : item.product_id, item.item_type)}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item.item_type === "deal") {
                                                    (navigation as any).navigate("DealDetails", {
                                                        deal: item.Deal,
                                                    });
                                                } else {
                                                    (navigation as any).navigate("CartProductDetails", {
                                                        product: item,
                                                    });
                                                }
                                            }}
                                        >
                                            {item.item_type === "deal" ? (
                                                <View style={styles.dealItems}>
                                                    <View style={styles.dealBadge}>
                                                        <Text style={styles.dealBadgeText}>DEAL</Text>
                                                    </View>
                                                    <View style={styles.imageContainer}>
                                                        {item.Deal?.thumb ? (
                                                            <Image
                                                                source={{ uri: item.Deal.thumb }}
                                                                style={styles.image}
                                                            />
                                                        ) : (
                                                            <Image source={thumbnail} style={styles.image} />
                                                        )}
                                                    </View>
                                                    <View style={styles.itemDetails}>
                                                        <Text style={styles.dealItemName} numberOfLines={2}>
                                                            {item.Deal?.name}
                                                        </Text>
                                                        <View style={styles.dealInfoRow}>
                                                            <Text style={styles.dealProductCount}>
                                                                {item.Deal?.products?.length || 0} products
                                                            </Text>
                                                            <Text style={styles.dealDiscount}>
                                                                {item.Deal?.discount_percentage}% OFF
                                                            </Text>
                                                        </View>
                                                        <View style={styles.qtyBtn}>
                                                            <View style={styles.qtyRow}>
                                                                <Text style={styles.qtyLabel}>Qty:</Text>
                                                                <Text style={styles.qtyBtnText}>{item.qty}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.itemPriceContainer}>
                                                        <Text style={styles.dealItemPrice}>
                                                            £{(item.Deal?.deal_price * item.qty).toFixed(2)}
                                                        </Text>
                                                        <Text style={styles.dealOriginalPrice}>
                                                            £{(item.Deal?.original_price * item.qty).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                <View style={styles.items}>
                                                    <View style={styles.imageContainer}>
                                                        {item.Product?.thumb ? (
                                                            <Image
                                                                source={{ uri: item.Product.thumb }}
                                                                style={styles.image}
                                                            />
                                                        ) : (
                                                            <Image source={thumbnail} style={styles.image} />
                                                        )}
                                                    </View>
                                                    <View style={styles.itemDetails}>
                                                        <Text style={styles.itemName} numberOfLines={2}>
                                                            {item.Product?.name}
                                                        </Text>
                                                        <View style={styles.qtyBtn}>
                                                            <View style={styles.qtyRow}>
                                                                <Text style={styles.qtyLabel}>Quantity:</Text>
                                                                <Text style={styles.qtyBtnText}>{item.qty}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.itemPriceContainer}>
                                                        <Text style={styles.itemPrice}>
                                                            £{(item.Product?.price * item.qty).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </Swipeable>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.cartTotal}>
                        <Text style={styles.cartTotalText}>
                            Your bag total: £ {total.toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={CheckOut}>
                        <View style={styles.checkoutBtnContainer}>
                            {buttonLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.checkoutBtnText}>Checkout</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Bag;
