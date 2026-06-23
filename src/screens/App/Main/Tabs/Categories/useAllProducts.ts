import { useCallback, useEffect, useRef, useState } from 'react';
import { useCategoriesQuery, useProductsQuery } from '../../../../../api/hooks';
import type { Category } from '../../../../../api/types';

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

const useAllProducts = () => {
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  const categoriesQuery = useCategoriesQuery();

  const categories = (categoriesQuery.data?.data || []) as Category[];

  const getDeepestCategoryId = useCallback(
    (categoryId: string, subCategoryIds: string[]): string | null => {
      if (categoryId === 'all') return null;

      for (let i = subCategoryIds.length - 1; i >= 0; i--) {
        if (subCategoryIds[i]) {
          return subCategoryIds[i];
        }
      }
      return categoryId;
    },
    []
  );

  const categoryIdForFetch = getDeepestCategoryId(
    selectedCategory,
    selectedSubCategories
  );

  const productsQuery = useProductsQuery(
    {
      page: currentPage,
      limit: pageSize,
      search: searchQueryRef.current.trim(),
      categoryId: categoryIdForFetch,
    },
    true
  );

  const getFirstSubCategoryId = useCallback(
    (categoryId: string): string | null => {
      if (categoryId === 'all') return null;
      const mainCat = categories.find((c) => c.id.toString() === categoryId);
      const firstSub = mainCat?.sub_categories?.[0];
      return firstSub ? firstSub.id.toString() : null;
    },
    [categories]
  );

  useEffect(() => {
    if (!categoriesQuery.data?.data || selectedCategory !== 'all') return;
    const sorted = [...categoriesQuery.data.data].sort(
      (a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)
    );
    if (sorted[0]) {
      setSelectedCategory(sorted[0].id.toString());
    }
  }, [categoriesQuery.data?.data, selectedCategory]);

  useEffect(() => {
    if (!productsQuery.data) return;

    let fetchedProducts = productsQuery.data.data || [];
    if (productsQuery.data.pagination) {
      setPagination(productsQuery.data.pagination);
    }

    fetchedProducts = fetchedProducts.filter((p: any) => {
      const price = parseFloat(p.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    if (sortBy === 'price_low') {
      fetchedProducts.sort(
        (a: any, b: any) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (sortBy === 'price_high') {
      fetchedProducts.sort(
        (a: any, b: any) => parseFloat(b.price) - parseFloat(a.price)
      );
    } else if (sortBy === 'name') {
      fetchedProducts.sort((a: any, b: any) =>
        a.name?.localeCompare(b.name)
      );
    }

    if (currentPage > 1) {
      setAccumulatedProducts((prev) => [...prev, ...fetchedProducts]);
      setLoadingMore(false);
    } else {
      setAccumulatedProducts(fetchedProducts);
    }
  }, [productsQuery.data, currentPage, sortBy, priceRange]);

  const fetchProducts = useCallback(
    (
      page: number = 1,
      isLoadMore: boolean = false,
      categoryId: string | null = null,
      subCategoryIds: string[] = []
    ) => {
      if (isLoadMore) {
        setLoadingMore(true);
      }
      setSelectedCategory(categoryId || 'all');
      setSelectedSubCategories(subCategoryIds);
      setCurrentPage(page);
    },
    []
  );

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !pagination?.hasMore) return;
    fetchProducts(currentPage + 1, true, selectedCategory, selectedSubCategories);
  }, [
    fetchProducts,
    currentPage,
    loadingMore,
    pagination?.hasMore,
    selectedCategory,
    selectedSubCategories,
  ]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchProducts(1, false, selectedCategory, selectedSubCategories);
  }, [fetchProducts, selectedCategory, selectedSubCategories]);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      const firstSubCategoryId = getFirstSubCategoryId(categoryId);
      const initialSelections = firstSubCategoryId ? [firstSubCategoryId] : [];
      setCurrentPage(1);
      fetchProducts(1, false, categoryId, initialSelections);
    },
    [fetchProducts, getFirstSubCategoryId]
  );

  const handleSubCategoryChange = useCallback(
    (subCategoryId: string, level: number) => {
      setSelectedSubCategories((prev) => {
        const newSelections = prev.slice(0, level);
        newSelections[level] = subCategoryId;
        setCurrentPage(1);
        fetchProducts(1, false, selectedCategory, newSelections);
        return newSelections;
      });
    },
    [fetchProducts, selectedCategory]
  );

  const getSubCategoriesAtLevel = useCallback(
    (level: number): SubCategory[] => {
      if (selectedCategory === 'all') return [];

      if (level === 0) {
        const mainCat = categories.find(
          (c) => c.id.toString() === selectedCategory
        );
        return (mainCat?.sub_categories as SubCategory[]) || [];
      }

      let currentSubs: SubCategory[] = [];
      const mainCat = categories.find(
        (c) => c.id.toString() === selectedCategory
      );
      currentSubs = (mainCat?.sub_categories as SubCategory[]) || [];

      for (let i = 0; i < level; i++) {
        const selectedId = selectedSubCategories[i];
        if (!selectedId) return [];

        const selectedSub = currentSubs.find(
          (s) => s.id.toString() === selectedId
        );
        if (!selectedSub?.sub_categories?.length) return [];
        currentSubs = selectedSub.sub_categories;
      }

      return currentSubs;
    },
    [categories, selectedCategory, selectedSubCategories]
  );

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

  return {
    products: accumulatedProducts,
    categories,
    loading: productsQuery.isLoading && currentPage === 1,
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
