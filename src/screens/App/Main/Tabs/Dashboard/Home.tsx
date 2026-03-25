import { useState, useRef, useCallback } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View, TextInput, ActivityIndicator, FlatList, Dimensions, ScrollView } from "react-native";
import { styles } from "./Styles";
import logo from "../../../../../assets/logoW.png";
import useHome from "./useHome";
import ProductCard from "../../../../../components/ProductCard";
import DealCard from "../../../../../components/DealCard";
import Loader from "../../../../../components/ProductLoader";
import Modal from "react-native-modal";
import { AddProductToCart, GetUserCart } from "../../../../../helpers/Backend";
import { addItem } from "../../../../../redux/bag/BagSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hooks";
import Toast from "react-native-simple-toast";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_SPACING = 14;

const C = {
    brand: '#1946A9',
    brandLight: '#1A72EE',
    brandDark: '#083FA0',
    accent: '#FF4D4D',
    accentAmber: '#FFB800',
    surface: '#FFFFFF',
    bg: '#F4F7FC',
    cardBg: '#FFFFFF',
    text: '#0D1B2A',
    textMid: '#4A5568',
    textLight: '#9AA5B4',
    border: '#E8EDF5',
    sale: '#FF3B30',
    green: '#22C55E',
    shadow: 'rgba(10,95,214,0.12)',
};

const PROMO_BANNERS = [
    {
        id: '1',
        title: 'Fresh Fruits & Vegetables',
        subtitle: 'Up to 30% off on seasonal produce',
        bgColor: '#22C55E',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
    },
    {
        id: '2',
        title: 'Dairy Essentials',
        subtitle: 'Milk, Cheese & Yogurt deals',
        bgColor: '#3B82F6',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    },
    {
        id: '3',
        title: 'Bakery Fresh',
        subtitle: 'Freshly baked bread & pastries',
        bgColor: '#F59E0B',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    },
];

const promoBannerStyles = {
    container: {
        marginTop: 10,
        marginBottom: 10,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    banner: {
        height: 140,
        borderRadius: 16,
        flexDirection: 'row' as const,
        overflow: 'hidden' as const,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center' as const,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800' as const,
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        fontWeight: '500' as const,
        marginBottom: 12,
    },
    shopNowBtn: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start' as const,
    },
    shopNowText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700' as const,
    },
    image: {
        width: 120,
        height: '100%' as const,
    },
    dotsRow: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        gap: 6,
        marginTop: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E8EDF5',
    },
    dotActive: {
        width: 18,
        backgroundColor: '#1946A9',
    },
};

function PromoBanners() {
    const [activeIndex, setActiveIndex] = useState(0);
    const bannerWidth = SCREEN_WIDTH - 40;

    const onScroll = useCallback((e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        const idx = Math.round(x / bannerWidth);
        setActiveIndex(idx);
    }, [bannerWidth]);

    return (
        <View style={promoBannerStyles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.dealsSectionTitle}>Special Offers</Text>
            </View>
            <FlatList
                data={PROMO_BANNERS}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={promoBannerStyles.listContent}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[promoBannerStyles.banner, { backgroundColor: item.bgColor, width: bannerWidth }]}
                    >
                        <View style={promoBannerStyles.textContainer}>
                            <Text style={promoBannerStyles.title}>{item.title}</Text>
                            <Text style={promoBannerStyles.subtitle}>{item.subtitle}</Text>
                            <View style={promoBannerStyles.shopNowBtn}>
                                <Text style={promoBannerStyles.shopNowText}>Shop Now</Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: item.image }}
                            style={promoBannerStyles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
            />
            <View style={promoBannerStyles.dotsRow}>
                {PROMO_BANNERS.map((_, i) => (
                    <View
                        key={i}
                        style={[promoBannerStyles.dot, i === activeIndex && promoBannerStyles.dotActive]}
                    />
                ))}
            </View>
        </View>
    );
}

function FeaturedCard({ item }: { item: any }) {
    const [qty, setQty] = useState(1);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: any) => state.user.value);
    const token = useAppSelector((state: any) => state.user.token);

    const AddToBag = () => {
        const body = {
            productId: item.id,
            userId: user.userData.id,
            qty: qty,
        };

        AddProductToCart(token, body)
            .then(() => {
                GetUserCart(token, user.userData.id)
                    .then((res: any) => {
                        dispatch(addItem(res.data.data));
                        (Toast as any).show("Product added to bag");
                    })
                    .catch((err: any) => {
                        (Toast as any).show("Something went wrong");
                        console.log(err);
                    });
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    return (
        <View style={styles.featuredCard}>
            <View style={styles.featTag}>
                <Text style={styles.featTagText}>Featured</Text>
            </View>
            <Image source={{ uri: item.thumb }} style={styles.featImage} />
            <View style={styles.featInfo}>
                <Text style={styles.featName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.featPrice}>£{item.price}</Text>
            </View>
            <View style={styles.featControls}>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        onPress={() => setQty((q: number) => Math.max(1, q - 1))}
                        style={styles.qtyBtn}
                    >
                        <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{qty}</Text>
                    <TouchableOpacity onPress={() => setQty((q: number) => q + 1)} style={[styles.qtyBtn, styles.qtyBtnPlus]}>
                        <Text style={[styles.qtyBtnText, { color: C.surface }]}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={AddToBag}>
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function FeaturedCarousel({ featuredProducts }: { featuredProducts: any }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const onScroll = useCallback((e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        const idx = Math.round(x / (CARD_WIDTH + CARD_SPACING));
        setActiveIndex(idx);
    }, []);

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.dealsSectionTitle}>Featured Products 🔥</Text>
            </View>
            <FlatList
                ref={flatRef}
                data={featuredProducts}
                keyExtractor={(i: any) => i.id.toString()}
                renderItem={({ item }) => <FeaturedCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                onScroll={onScroll}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
            />
            <View style={styles.dotsRow}>
                {featuredProducts.map((_: any, i: number) => (
                    <View
                        key={i}
                        style={[styles.dot, i === activeIndex && styles.dotActive]}
                    />
                ))}
            </View>
        </View>
    );
}

const Dashboard = () => {
    const {
        products,
        fav,
        deals,
        dealsLoading,
        featuredProducts,
        loading,
        loadingMore,
        pagination,
        loadMoreProducts,
        zip,
        isModalVisible,
        loadZip,
        setIsModalVisible,
        setZip,
        onModalButtonPress } = useHome();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    return (
        <View style={styles.flexContainer}>
            <Modal isVisible={isModalVisible}>
                <View
                    style={styles.modalViewContainer}
                >
                    <View
                        style={styles.modalViewInnerContainer}
                    >
                        <View style={styles.main}>
                            <View
                                style={styles.marginTop19}
                            >
                                <Text
                                    style={styles.helloText}
                                >
                                    Hello.
                                </Text>
                                <Text style={styles.blackText}>
                                    Please enter your postcode to start shopping.
                                </Text>
                                <View>
                                    <View style={styles.inputView}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder="Your Postcode"
                                            placeholderTextColor={"#1946A9"}
                                            onChangeText={(text) => setZip(text)}
                                            value={zip.toUpperCase()}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={onModalButtonPress}
                                        style={styles.searchBtn}
                                    >
                                        {loadZip ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text
                                                style={styles.searchButtonText}
                                            >
                                                Search
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <StatusBar backgroundColor="#1946A9" barStyle="light-content" />
            <View style={styles.topBar}>
                <Image
                    source={logo}
                    style={styles.logoStyles}
                />
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={styles.zipCodeButton}
                >

                    <Text style={styles.whiteText}>
                        Postcode: {zip.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
                    if (isCloseToBottom && pagination?.hasMore && !loadingMore) {
                        loadMoreProducts();
                    }
                }}
                scrollEventThrottle={400}
            >
                {/* Deals Section */}
                {/* {deals && deals.length > 0 && (
                    <View style={styles.dealsSection}>
                        <Text style={styles.dealsSectionTitle}>Hot Deals 🔥</Text>
                        {dealsLoading ? (
                            <ActivityIndicator size="small" color="#1946A9" />
                        ) : (
                            <FlatList
                                data={deals}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item: any) => item.id.toString()}
                                renderItem={({ item }: { item: any }) => <DealCard deal={item} />}
                                contentContainerStyle={styles.dealsListContainer}
                                nestedScrollEnabled={true}
                                scrollEnabled={true}
                            />
                        )}
                    </View>
                )} */}

                <FeaturedCarousel featuredProducts={featuredProducts} />

                {/* <PromoBanners /> */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.dealsSectionTitle}>All Products</Text>
                    {/* {pagination && (
                        <Text style={styles.paginationText}>
                            {products.length} of {pagination.total}
                        </Text>
                    )} */}
                </View>

                {/* Products Grid */}
                <View style={styles.productView}>
                    {products && products.length > 0 ? (
                        products.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                id={product?.id}
                                image={product?.thumb}
                                price={product?.price}
                                description={product?.description}
                                name={product?.name}
                                isFav={fav.some((element: any) => element.Product?.id === product?.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.loadingMoreContainer}>
                            <Text style={styles.loadingMoreText}>No products available</Text>
                        </View>
                    )}
                </View>

                {/* Loading More Indicator */}
                {loadingMore && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#1946A9" />
                        <Text style={styles.loadingMoreText}>Loading more products...</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

export default Dashboard;
