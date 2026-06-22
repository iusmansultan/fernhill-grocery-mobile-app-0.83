import React, { useRef, useState } from "react";
import {
    FlatList,
    Image,
    StatusBar,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal
} from "react-native";
import styles from "./Styles";
import logo from '../../../../../assets/logoW.png';
import useAllProducts from "./useAllProducts";
import ProductCard from "../../../../../components/ProductCard";
import Loader from "../../../../../components/ProductLoader";
import { useAppSelector } from "../../../../../redux/Hooks";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Categories = () => {
    const s = styles as any;
    const {
        products,
        categories,
        loading,
        loadingMore,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        selectedSubCategories,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        loadMoreProducts,
        applyFilters,
        handleCategoryChange,
        handleSubCategoryChange,
        getSubCategoriesAtLevel,
    } = useAllProducts();

    const fav = useAppSelector((state: any) => state.user.fav);
    const [showFilters, setShowFilters] = useState(false);
    const categoryScrollRef = useRef<ScrollView>(null);
    const categoryScrollXRef = useRef(0);
    // Store scroll refs and positions for each subcategory level
    const subCategoryScrollRefs = useRef<{ [key: number]: ScrollView | null }>({});
    const subCategoryScrollPositions = useRef<{ [key: number]: number }>({});

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_low' },
        { label: 'Price: High to Low', value: 'price_high' },
        { label: 'Name A-Z', value: 'name' },
    ];

    const handleSearch = () => {
        applyFilters();
    };

    // Wrapper to reset subcategory scroll positions when main category changes
    const onCategoryChange = (categoryId: string) => {
        // Reset all subcategory scroll positions to start
        subCategoryScrollPositions.current = {};
        handleCategoryChange(categoryId);
    };

    // Wrapper to reset child level scroll positions when a parent subcategory changes
    const onSubCategoryChange = (subCategoryId: string, level: number) => {
        // Reset scroll positions for all levels deeper than current
        Object.keys(subCategoryScrollPositions.current).forEach(key => {
            if (parseInt(key, 10) > level) {
                delete subCategoryScrollPositions.current[parseInt(key, 10)];
            }
        });
        handleSubCategoryChange(subCategoryId, level);
    };

    const renderProduct = ({ item: product }: { item: any }) => (
        <ProductCard
            tax_status={product?.tax_status}
            tax_class={product?.tax_class}
            id={product?.id}
            image={product?.thumb}
            price={product?.price}
            description={product?.description}
            name={product?.name}
            isFav={fav?.some((element: any) => element.Product?.id === product?.id)}
        />
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#1946A9" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.filtersContainer}>
            {/* Category Pills */}
            <ScrollView
                ref={categoryScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsContainer}
                onScroll={(e: any) => {
                    categoryScrollXRef.current = e.nativeEvent.contentOffset.x;
                }}
                onContentSizeChange={() => {
                    // Keep user's horizontal position after category selection re-renders.
                    requestAnimationFrame(() => {
                        categoryScrollRef.current?.scrollTo({
                            x: categoryScrollXRef.current,
                            animated: false,
                        });
                    });
                }}
                scrollEventThrottle={16}
            >
                {/* <TouchableOpacity
                    style={[
                        styles.categoryPill,
                        selectedCategory === 'all' && styles.categoryPillActive
                    ]}
                    onPress={() => onCategoryChange('all')}
                >
                    <Text style={[
                        styles.categoryPillText,
                        selectedCategory === 'all' && styles.categoryPillTextActive
                    ]}>All</Text>
                </TouchableOpacity> */}
                {categories.map((cat: any) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryPill,
                            selectedCategory === cat.id.toString() && styles.categoryPillActive
                        ]}
                        onPress={() => onCategoryChange(cat.id.toString())}
                    >
                        <Text style={[
                            styles.categoryPillText,
                            selectedCategory === cat.id.toString() && styles.categoryPillTextActive
                        ]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Dynamic Subcategory Pills - renders all levels */}
            {selectedCategory !== 'all' && (() => {
                const levels: React.ReactElement[] = [];
                let level = 0;
                
                while (true) {
                    const subCategories = getSubCategoriesAtLevel(level);
                    if (!subCategories.length) break;
                    
                    const currentLevel = level;
                    const selectedAtLevel = selectedSubCategories[currentLevel];
                    
                    levels.push(
                        <ScrollView
                            key={`level-${currentLevel}`}
                            ref={(ref) => {
                                subCategoryScrollRefs.current[currentLevel] = ref;
                            }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.subCategoryPillsContainer}
                            scrollEventThrottle={16}
                            onScroll={(e: any) => {
                                subCategoryScrollPositions.current[currentLevel] = e.nativeEvent.contentOffset.x;
                            }}
                            onContentSizeChange={() => {
                                requestAnimationFrame(() => {
                                    const scrollRef = subCategoryScrollRefs.current[currentLevel];
                                    const scrollX = subCategoryScrollPositions.current[currentLevel] || 0;
                                    scrollRef?.scrollTo({ x: scrollX, animated: false });
                                });
                            }}
                        >
                            {subCategories.map((sub: any) => (
                                <TouchableOpacity
                                    key={sub.id}
                                    style={[
                                        s.subCategoryPill,
                                        selectedAtLevel === sub.id.toString() && s.subCategoryPillActive,
                                    ]}
                                    onPress={() => onSubCategoryChange(sub.id.toString(), currentLevel)}
                                >
                                    <Text
                                        style={[
                                            s.subCategoryPillText,
                                            selectedAtLevel === sub.id.toString() && s.subCategoryPillTextActive,
                                        ]}
                                    >
                                        {sub.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    );
                    
                    // Only continue to next level if current level has a selection
                    if (!selectedAtLevel) break;
                    level++;
                }
                
                return levels.length > 0 ? <View>{levels}</View> : null;
            })()}
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.statusBarContainer}>
                <StatusBar backgroundColor={'#1946A9'} barStyle="light-content" />
            </View>

            {/* Header */}
            <View style={styles.topBar}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.headerTitle}>All Products</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                {/* Filter Button */}
                <View style={styles.filterButtonRow}>
                    <TouchableOpacity
                        style={styles.sortButton}
                        onPress={() => setShowFilters(true)}
                    >
                        <Icon name="filter" size={20} color="white" />
                        {/* <Text style={styles.sortButtonText}>Sort & Filter</Text> */}
                    </TouchableOpacity>
                </View>
            </View>

            {
                loading && products.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                    </View>
                ) : null
            }

            {/* Products List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item: any) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.productRow}
                contentContainerStyle={styles.productListContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No products found</Text>
                    </View>
                )}
            />

            {/* Sort & Filter Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Sort & Filter</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.filterLabel}>Sort By</Text>
                        <View style={styles.sortOptionsContainer}>
                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.sortOption,
                                        sortBy === option.value && styles.sortOptionActive
                                    ]}
                                    onPress={() => setSortBy(option.value)}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        sortBy === option.value && styles.sortOptionTextActive
                                    ]}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Price Range */}
                        <Text style={styles.filterLabel}>Price Range</Text>
                        <View style={styles.priceRangeContainer}>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>Min £</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    keyboardType="numeric"
                                    value={priceRange.min.toString()}
                                    onChangeText={(text) => setPriceRange((prev: { min: number; max: number }) => ({ ...prev, min: parseInt(text, 10) || 0 }))}
                                    placeholder="0"
                                />
                            </View>
                            <Text style={styles.priceSeparator}>-</Text>
                            <View style={styles.priceInputWrapper}>
                                <Text style={styles.priceInputLabel}>Max £</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    keyboardType="numeric"
                                    value={priceRange.max.toString()}
                                    onChangeText={(text) => setPriceRange((prev: { min: number; max: number }) => ({ ...prev, max: parseInt(text, 10) || 0 }))}
                                    placeholder="1000"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => {
                                applyFilters();
                                setShowFilters(false);
                            }}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Categories;