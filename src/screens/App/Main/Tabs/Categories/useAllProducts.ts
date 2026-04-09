import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, getCategories } from "../../../../../helpers/Backend";

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

interface Category {
    id: number;
    name: string;
    thumb?: string;
    sub_categories?: Array<{
        id: number;
        name: string;
        category_id?: number;
    }>;
}

const useAllProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;

    // Filters
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

    /** Keeps latest search for API calls without recreating fetchProducts on every keystroke. */
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;

    const fetchCategories = useCallback(() => {
        getCategories()
            .then((res: any) => {
                console.log("Categories response:", res.data);
                if (res.data?.data) {
                    setCategories(res.data.data || []);
                }
            })
            .catch((err) => {
                console.log("Categories error:", err);
            });
    }, []);

    const fetchProducts = useCallback((page: number = 1, isLoadMore: boolean = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const categoryIdForFetch =
            selectedCategory === 'all'
                ? null
                : selectedSubCategory !== 'all'
                    ? selectedSubCategory
                    : selectedCategory;

        const search = searchQueryRef.current.trim();

        getProducts({
            page,
            limit: pageSize,
            search,
            categoryId: categoryIdForFetch,
        })
            .then((res: any) => {
                console.log("Products response:", res.data);
                if (res.data?.pagination) {
                    setPagination(res.data.pagination);
                }
                
                let fetchedProducts = res.data?.data || [];
                
                // Backend applies search + category (GET /product?search=&categoryId=).
                // Sort + price range still applied on the current result set (not in API yet).
                fetchedProducts = fetchedProducts.filter((p: any) => {
                    const price = parseFloat(p.price) || 0;
                    return price >= priceRange.min && price <= priceRange.max;
                });

                if (sortBy === 'price_low') {
                    fetchedProducts.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
                } else if (sortBy === 'price_high') {
                    fetchedProducts.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price));
                } else if (sortBy === 'name') {
                    fetchedProducts.sort((a: any, b: any) => a.name?.localeCompare(b.name));
                }

                if (isLoadMore) {
                    setProducts((prev) => [...prev, ...fetchedProducts]);
                    setLoadingMore(false);
                } else {
                    setProducts(fetchedProducts);
                    setLoading(false);
                }
                setCurrentPage(page);
            })
            .catch((err) => {
                console.log("Products error:", err);
                setLoading(false);
                setLoadingMore(false);
            });
    }, [selectedCategory, selectedSubCategory, sortBy, priceRange]);

    const loadMoreProducts = useCallback(() => {
        if (loadingMore || !pagination?.hasMore) return;
        fetchProducts(currentPage + 1, true);
    }, [fetchProducts, currentPage, loadingMore, pagination?.hasMore]);

    const applyFilters = useCallback(() => {
        setCurrentPage(1);
        fetchProducts(1, false);
    }, [fetchProducts]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        searchQueryRef.current = '';
        setSelectedCategory('all');
        setSelectedSubCategory('all');
        setSortBy('newest');
        setPriceRange({ min: 0, max: 1000 });
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts(1, false);
    }, [selectedCategory, fetchProducts]);

    // Reset subcategory when category changes.
    useEffect(() => {
        setSelectedSubCategory('all');
    }, [selectedCategory]);

    return {
        products,
        categories,
        loading,
        loadingMore,
        pagination,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        loadMoreProducts,
        applyFilters,
        resetFilters,
    };
};

export default useAllProducts;
