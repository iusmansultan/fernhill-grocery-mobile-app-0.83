import { useState, useRef, useCallback } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View, TextInput, ActivityIndicator, FlatList, Dimensions, ScrollView } from "react-native";
import { styles } from "./Styles";
import logo from "../../../../../assets/logoW.png";
import useHome from "./useHome";
import ProductCard from "../../../../../components/ProductCard";
import Loader from "../../../../../components/ProductLoader";
import Modal from "react-native-modal";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.48;
const CARD_SPACING = 10;

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

function PromoBanners({ banners }: { banners: any[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const bannerWidth = SCREEN_WIDTH - 40;

    const onScroll = useCallback((e: any) => {
        const x = e.nativeEvent.contentOffset.x;
        const idx = Math.round(x / bannerWidth);
        setActiveIndex(idx);
    }, [bannerWidth]);


    return (
        <View style={promoBannerStyles.container}>

            <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
               <Image source={require("../../../../../assets/banners/£5_OFF.png")} style={{ width: bannerWidth, height: 100, resizeMode: 'contain' }} />
               <Image source={require("../../../../../assets/banners/Free_Delvery.png")} style={{ width: bannerWidth, height: 150, resizeMode: 'contain' }} />
               <Image source={require("../../../../../assets/banners/OAP.png")} style={{ width: bannerWidth, height:100,  resizeMode: 'contain' }} />
            </View>

        </View>
    );
}

function FeaturedCard({ item, isFav }: { item: any; isFav: boolean }) {
    return (
        <View style={{ position: "relative" }}>
            <ProductCard
                tax_status={item.tax_status}
                tax_class={item.tax_class}
                id={item.id}
                image={item.thumb}
                price={item.price}
                description={item.description}
                name={item.name}
                isFav={isFav}
                cardStyle={{
                    width: CARD_WIDTH,
                    marginRight: CARD_SPACING,
                    marginBottom: 0,
                }}
            />

            <View style={styles.featTag}>
                <Text style={styles.featTagText}>Sale</Text>
            </View>
        </View>
    );
}

function FeaturedCarousel({ featuredProducts, fav }: { featuredProducts: any; fav: any[] }) {
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
                <Text style={styles.dealsSectionTitle}>Special Offers 🔥</Text>
            </View>
            <FlatList
                ref={flatRef}
                data={featuredProducts}
                keyExtractor={(i: any) => i.id.toString()}
                renderItem={({ item }) => (
                    <FeaturedCard
                        item={item}
                        isFav={!!fav?.some((element: any) => element.Product?.id === item.id)}
                    />
                )}
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
        featuredProducts,
        loading,
        loadingMore,
        promoBanners,
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
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 1,
                                padding: 5,
                            }}
                        >
                            <Text style={{ fontSize: 18, color: '#666', fontWeight: 'bold' }}>✕</Text>
                        </TouchableOpacity>
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
                                            maxLength={7}
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
                        Check Postcode: {zip.toUpperCase()}
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

                <FeaturedCarousel featuredProducts={featuredProducts} fav={fav} />

                <PromoBanners banners={promoBanners} />
                {/* 
                <View style={styles.sectionHeader}>
                    <Text style={styles.dealsSectionTitle}>All Products</Text>
                    {pagination && (
                        <Text style={styles.paginationText}>
                            {products.length} of {pagination.total}
                        </Text>
                    )}
                </View> */}

                {/* Products Grid */}
                {/* <View style={styles.productView}>
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
                </View> */}

                {/* Loading More Indicator */}
                {/* {loadingMore && (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#1946A9" />
                        <Text style={styles.loadingMoreText}>Loading more products...</Text>
                    </View>
                )} */}
            </ScrollView>
        </View>
    )
}

export default Dashboard;
