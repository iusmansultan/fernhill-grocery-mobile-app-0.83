import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { useCategoriesQuery } from '../../../../../api/hooks';
import { sortCategoryTree } from '../../../../../helpers/categorySort';
import type { Category } from '../../../../../api/types';

const useCategories = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch, isFetching } = useCategoriesQuery();

  const allCategories = useMemo(() => {
    const raw = data?.data;
    return raw ? sortCategoryTree(raw as Category[]) : [];
  }, [data?.data]);

  const categories = useMemo(() => {
    if (search.length > 2) {
      return allCategories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return allCategories;
  }, [allCategories, search]);

  const ApplySearch = () => {
    if (search.length <= 2) {
      refetch();
    }
  };

  return {
    search,
    setSearch,
    categories,
    loading: isLoading || isFetching,
    ApplySearch,
    GetCategories: refetch,
    navigation,
  };
};

export default useCategories;
