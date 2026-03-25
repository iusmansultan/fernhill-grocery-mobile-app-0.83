import { Platform, StyleSheet } from "react-native"

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container: {
        flex: 1.5,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 100,
    },
    topBar: {
        width: '100%',
        backgroundColor: '#1946A9',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    searchbar: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    statusBarContainer: {
        height: 40,
        backgroundColor: '#1946A9',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    listContainer: {
        width: '100%',
        height: Platform.OS === 'ios' ? '93%' : '96%',
        alignItems: 'center',
    },
    // Search styles
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    searchInput: {
        flex: 1,
        height: 44,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#1946A9',
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    // Filters styles
    filtersContainer: {
        backgroundColor: 'white',
        paddingVertical: 12,
        marginBottom: 8,
    },
    categoryPillsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        marginRight: 8,
    },
    categoryPillActive: {
        backgroundColor: '#1946A9',
    },
    categoryPillText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoryPillTextActive: {
        color: 'white',
    },
    resultsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    resultsText: {
        fontSize: 14,
        color: '#666',
    },
    sortButton: {
        padding: 12,
        backgroundColor: '#1946A9',
        borderRadius: 1000,
    },
    sortButtonText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    // Product list styles
    productRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    productListContent: {
        paddingBottom: 100,
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingMoreText: {
        marginTop: 8,
        color: '#666',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalClose: {
        fontSize: 24,
        color: '#999',
        padding: 4,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    sortOptionsContainer: {
        marginBottom: 20,
    },
    sortOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 8,
    },
    sortOptionActive: {
        backgroundColor: '#E6F0FA',
        borderWidth: 1,
        borderColor: '#1946A9',
    },
    sortOptionText: {
        fontSize: 15,
        color: '#333',
    },
    sortOptionTextActive: {
        color: '#1946A9',
        fontWeight: '600',
    },
    applyButton: {
        backgroundColor: '#1946A9',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    // Filter button row
    filterButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 5
    },
    // Price range styles
    priceRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceInputWrapper: {
        flex: 1,
    },
    priceInputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    priceInput: {
        height: 44,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
    },
    priceSeparator: {
        fontSize: 18,
        color: '#999',
        marginHorizontal: 12,
        marginTop: 16,
    },
})

export default styles