import { Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { GetFavProducts, getProducts, GetStoreId, GetUserCart, GetActiveDeals, GetFeaturedProducts } from "../../../../../helpers/Backend";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hooks";
import { addItem } from "../../../../../redux/bag/BagSlice";
import { saveFav, saveStoreId, saveZip } from "../../../../../redux/auth/AuthSlice";
import { AddFav } from "../../../../../redux/fav/FavSlice";

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

const useHome = () => {
    const [isFeatured, setIsFeatured] = useState<boolean>(true);
    const [products, setProducts] = useState<any>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any>([]);
    const [deals, setDeals] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [dealsLoading, setDealsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;
    const storeId = useAppSelector((state: any) => state.user.storeId);
    const fav = useAppSelector((state: any) => state.user.fav);
    const token = useAppSelector((state: any) => state.user.token);
    const user = useAppSelector((state: any) => state.user.value);
    const oldZip = useAppSelector((state: any) => state.user.zip);
    const [zip, setZip] = useState<string>(oldZip);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [loadZip, setLoadZip] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    const GetProducts = useCallback((page: number = 1, isLoadMore: boolean = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        getProducts(storeId, page, pageSize)
            .then((res: any) => {
                console.log("REESS =>", res.data);
                if (res.data.pagination) {
                    setPagination(res.data.pagination);
                }
                if (isLoadMore) {
                    setProducts((prev: any) => [...prev, ...res.data.data]);
                    setLoadingMore(false);
                } else {
                    setProducts(res.data.data);
                    setLoading(false);
                }
                setCurrentPage(page);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setLoadingMore(false);
            });
    }, [storeId])

    const loadMoreProducts = useCallback(() => {
        if (loadingMore || !pagination?.hasMore) return;
        GetProducts(currentPage + 1, true);
    }, [GetProducts, currentPage, loadingMore, pagination?.hasMore])

    const GetFav = useCallback(() => {
        GetFavProducts(token, user.userData.id)
            .then((res: any) => {
                console.log("FAVVVV", res.data);
                dispatch(saveFav(res.data.data));
                dispatch(AddFav(res.data.data));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [dispatch, token, user.userData.id]);

    const GetCart = useCallback(() => {
        GetUserCart(token, user.userData.id)
            .then((res: any) => {
                console.log("RES DATA", res.data)
                dispatch(addItem(res.data.data));
            })
            .catch((err) => {
                console.log(err);
            });
    }, [dispatch, token, user.userData.id]);

    const GetDeals = useCallback(() => {
        setDealsLoading(true);
        GetActiveDeals()
            .then((res: any) => {
                console.log("DEALS =>", res.data);
                if (res.data.status) {
                    setDeals(res.data.data);
                }
                setDealsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setDealsLoading(false);
            });
    }, []);

    const fetchFeaturedProducts = useCallback(() => {
        GetFeaturedProducts(1, 20)
            .then((res: any) => {
                console.log("FEATURED =>", res.data);
                if (res.data.status) {
                    setFeaturedProducts(res.data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        GetProducts(1, false);
        fetchFeaturedProducts();
        GetFav();
        GetCart();
        GetDeals();
    }, [GetProducts, fetchFeaturedProducts, GetFav, GetCart, GetDeals])

    const HandleAllProducts = useCallback(() => {
        setIsFeatured(false);
    }, []);

    const HandleFeaturedProducts = useCallback(() => {
        setIsFeatured(true);
    }, []);


    const onModalButtonPress = useCallback(() => {
        if (zip !== "") {
            setLoadZip(true);
            GetStoreId(zip, token)
                .then((res: any) => {
                    console.log("res =>", res.data.data);
                    if (res.data.status) {
                        setLoadZip(false);
                        dispatch(saveStoreId(res.data.data));
                        dispatch(saveZip(zip));
                        GetProducts(1, false);
                        setIsModalVisible(false);
                    } else {
                        setLoadZip(false);
                        Alert.alert(
                            "Sorry",
                            "We are not in your area. We have noted, and we will be there soon."
                        );
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    Alert.alert(err.message);
                });
        } else {
            Alert.alert("Please enter postal code");
        }
    }, [GetProducts, dispatch, token, zip]);

    return {
        isFeatured,
        products: products,
        featuredProducts,
        loading,
        loadingMore,
        fav,
        deals,
        dealsLoading,
        pagination,
        HandleAllProducts,
        HandleFeaturedProducts,
        loadMoreProducts,
        zip,
        isModalVisible,
        loadZip,
        setLoadZip,
        setIsModalVisible,
        setZip,
        onModalButtonPress
    }
}

export default useHome;