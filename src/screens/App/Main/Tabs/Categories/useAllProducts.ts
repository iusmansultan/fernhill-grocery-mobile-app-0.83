import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, getCategories } from "../../../../../helpers/Backend";
import { sortCategoryTree } from "../../../../../helpers/categorySort";

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

interface SubCategory {
    id: number;
    name: string;
    parent_id?: number;
    category_id?: number;
    sort_order?: number;
    sub_categories?: SubCategory[];
}

interface Category {
    id: number;
    name: string;
    thumb?: string;
    sort_order?: number;
    sub_categories?: SubCategory[];
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
    // Track selected subcategories at each level: [level1Id, level2Id, ...]
    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

    /** Keeps latest search for API calls without recreating fetchProducts on every keystroke. */
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery;

    const fetchCategories = useCallback(async () => {
        try {
            const response: any = await getCategories();
            if (response.data?.data) {
                const allCategories = response.data.data as Category[];
                console.log ("allCategories ", allCategories)
                // Sort categories by sort_order
                const sortedCategories = allCategories.sort((a, b) => 
                    (a.sort_order ?? 999) - (b.sort_order ?? 999)
                );
                setCategories(sortedCategories);
                setSelectedCategory(sortedCategories[0].id.toString());
            }
        } catch (error) {
            console.log("Categories error:", error);
        }
    }, []);

    const getFirstSubCategoryId = useCallback((categoryId: string): string | null => {
        if (categoryId === 'all') return null;
        const mainCat = categories.find(c => c.id.toString() === categoryId);
        const firstSub = mainCat?.sub_categories?.[0];
        return firstSub ? firstSub.id.toString() : null;
    }, [categories]);

    // Get the deepest selected category ID for fetching products
    const getDeepestCategoryId = useCallback((
        categoryId: string,
        subCategoryIds: string[]
    ): string | null => {
        if (categoryId === 'all') return null;
        
        // Find the deepest selected subcategory
        for (let i = subCategoryIds.length - 1; i >= 0; i--) {
            if (subCategoryIds[i]) {
                return subCategoryIds[i];
            }
        }
        return categoryId;
    }, []);

    const fetchProducts = useCallback((
        page: number = 1, 
        isLoadMore: boolean = false,
        categoryId: string | null = null,
        subCategoryIds: string[] = []
    ) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const categoryIdForFetch = getDeepestCategoryId(
            categoryId || 'all',
            subCategoryIds
        );

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
    }, [sortBy, priceRange, getDeepestCategoryId]);

    const loadMoreProducts = useCallback(() => {
        if (loadingMore || !pagination?.hasMore) return;
        fetchProducts(currentPage + 1, true, selectedCategory, selectedSubCategories);
    }, [fetchProducts, currentPage, loadingMore, pagination?.hasMore, selectedCategory, selectedSubCategories]);

    const applyFilters = useCallback(() => {
        setCurrentPage(1);
        fetchProducts(1, false, selectedCategory, selectedSubCategories);
    }, [fetchProducts, selectedCategory, selectedSubCategories]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        const firstSubCategoryId = getFirstSubCategoryId(categoryId);
        const initialSelections = firstSubCategoryId ? [firstSubCategoryId] : [];

        setSelectedCategory(categoryId);
        setSelectedSubCategories(initialSelections);
        setCurrentPage(1);
        fetchProducts(1, false, categoryId, initialSelections);
    }, [fetchProducts, getFirstSubCategoryId]);

    // Handle subcategory change at a specific level
    const handleSubCategoryChange = useCallback((subCategoryId: string, level: number) => {
        setSelectedSubCategories(prev => {
            // Keep selections up to this level, then set this level's selection
            const newSelections = prev.slice(0, level);
            newSelections[level] = subCategoryId;
            
            // Fetch products with new selections
            setCurrentPage(1);
            fetchProducts(1, false, selectedCategory, newSelections);
            
            return newSelections;
        });
    }, [fetchProducts, selectedCategory]);

    // Get subcategories for a specific level
    const getSubCategoriesAtLevel = useCallback((level: number): SubCategory[] => {
        if (selectedCategory === 'all') return [];
        
        // Level 0: Get subcategories of selected main category
        if (level === 0) {
            const mainCat = categories.find(c => c.id.toString() === selectedCategory);
            return mainCat?.sub_categories || [];
        }
        
        // For deeper levels, traverse the tree
        let currentSubs: SubCategory[] = [];
        const mainCat = categories.find(c => c.id.toString() === selectedCategory);
        currentSubs = mainCat?.sub_categories || [];
        
        for (let i = 0; i < level; i++) {
            const selectedId = selectedSubCategories[i];
            if (!selectedId) return [];
            
            const selectedSub = currentSubs.find(s => s.id.toString() === selectedId);
            if (!selectedSub?.sub_categories?.length) return [];
            currentSubs = selectedSub.sub_categories;
        }
        
        return currentSubs;
    }, [categories, selectedCategory, selectedSubCategories]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        searchQueryRef.current = '';
        setSelectedCategory('all');
        setSelectedSubCategories([]);
        setSortBy('newest');
        setPriceRange({ min: 0, max: 1000 });
        setCurrentPage(1);
        fetchProducts(1, false, 'all', []);
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
        fetchProducts(1, false, 'all', []);
    }, [fetchCategories]);

    return {
        products,
        categories,
        loading,
        loadingMore,
        pagination,
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
        resetFilters,
        handleCategoryChange,
        handleSubCategoryChange,
        getSubCategoriesAtLevel,
    };
};

export default useAllProducts;
