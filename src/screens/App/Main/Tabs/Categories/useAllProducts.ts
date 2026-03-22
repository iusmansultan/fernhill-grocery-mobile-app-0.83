import { useCallback, useEffect, useState } from "react";
import { getProducts, getCategories, getProductsByCategory } from "../../../../../helpers/Backend";

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
    const [sortBy, setSortBy] = useState<string>('newest');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

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

        const fetchFn = selectedCategory !== 'all' 
            ? getProductsByCategory(selectedCategory, page, pageSize)
            : getProducts(null, page, pageSize);

        fetchFn
            .then((res: any) => {
                console.log("Products response:", res.data);
                if (res.data?.pagination) {
                    setPagination(res.data.pagination);
                }
                
                let fetchedProducts = res.data?.data || [];
                
                // Apply client-side filters
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    fetchedProducts = fetchedProducts.filter((p: any) => 
                        p.name?.toLowerCase().includes(query) ||
                        p.description?.toLowerCase().includes(query) ||
                        p.barcode?.includes(query)
                    );
                }

                // Apply price filter
                fetchedProducts = fetchedProducts.filter((p: any) => {
                    const price = parseFloat(p.price) || 0;
                    return price >= priceRange.min && price <= priceRange.max;
                });

                // Apply sorting
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
    }, [selectedCategory, searchQuery, sortBy, priceRange]);

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
        setSelectedCategory('all');
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
