import { useState } from "react";
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
    const {
        products,
        categories,
        loading,
        loadingMore,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        loadMoreProducts,
        applyFilters,
    } = useAllProducts();

    const fav = useAppSelector((state: any) => state.user.fav);
    const [showFilters, setShowFilters] = useState(false);

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_low' },
        { label: 'Price: High to Low', value: 'price_high' },
        { label: 'Name A-Z', value: 'name' },
    ];

    const handleSearch = () => {
        applyFilters();
    };

    const renderProduct = ({ item: product }: { item: any }) => (
        <ProductCard
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
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsContainer}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryPill,
                        selectedCategory === 'all' && styles.categoryPillActive
                    ]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Text style={[
                        styles.categoryPillText,
                        selectedCategory === 'all' && styles.categoryPillTextActive
                    ]}>All</Text>
                </TouchableOpacity>
                {categories.map((cat: any) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryPill,
                            selectedCategory === cat.id.toString() && styles.categoryPillActive
                        ]}
                        onPress={() => setSelectedCategory(cat.id.toString())}
                    >
                        <Text style={[
                            styles.categoryPillText,
                            selectedCategory === cat.id.toString() && styles.categoryPillTextActive
                        ]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
                        <Loader />
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