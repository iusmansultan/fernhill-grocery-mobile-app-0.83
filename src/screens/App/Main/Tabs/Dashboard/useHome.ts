import { Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { GetFavProducts, getProducts, GetStoreId, GetUserCart, GetActiveDeals } from "../../../../../helpers/Backend";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hooks";
import { addItem } from "../../../../../redux/bag/BagSlice";
import { saveFav, saveStoreId, saveZip } from "../../../../../redux/auth/AuthSlice";
import { AddFav } from "../../../../../redux/fav/FavSlice";

const useHome = () => {
    const [isFeatured, setIsFeatured] = useState<boolean>(true);
    const [products, setProducts] = useState<any>([]);
    const [deals, setDeals] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dealsLoading, setDealsLoading] = useState<boolean>(false);
    const storeId = useAppSelector((state: any) => state.user.storeId);
    const fav = useAppSelector((state: any) => state.user.fav);
    const token = useAppSelector((state: any) => state.user.token);
    const user = useAppSelector((state: any) => state.user.value);
    const oldZip = useAppSelector((state: any) => state.user.zip);
    const [zip, setZip] = useState<string>(oldZip);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [loadZip, setLoadZip] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    const GetProducts = useCallback((page: string, limit: string) => {
        setLoading(true);
        getProducts(storeId, page, limit)
            .then((res: any) => {
                console.log("REESS =>", res.data);
                // setPagination(res.data.pagination);
                setProducts(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [storeId])

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

    useEffect(() => {
        GetProducts("0", "100");
        GetFav();
        GetCart();
        GetDeals();
    }, [GetProducts, GetFav, GetCart, GetDeals])

    const HandleAllProducts = useCallback(() => {
        setIsFeatured(false);
    }, []);

    const HandleFeaturedProducts = useCallback(() => {
        setIsFeatured(true);
    }, []);

    const findFeaturedProducts = useCallback(() => {
        return products.filter((product: any) => product.is_featured === true);
    }, [products]);


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
                        GetProducts("0", "100");
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
        products: isFeatured ? findFeaturedProducts() : products,
        loading,
        fav,
        deals,
        dealsLoading,
        HandleAllProducts,
        HandleFeaturedProducts,
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