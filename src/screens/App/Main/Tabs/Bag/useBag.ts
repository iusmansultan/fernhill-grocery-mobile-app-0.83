import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../../../../../redux/Hooks";
import { removeItem } from "../../../../../redux/bag/BagSlice";
import {
    DeleteProductFromCart,
    DeleteDealFromCart,
} from "../../../../../helpers/Backend";

const useBag = () => {
    const token = useAppSelector((state: any) => state.user.token);
    const user = useAppSelector((state: any) => state.user.value);
    const cart = useAppSelector((state: any) => state.bag.value);
    const total = useAppSelector((state: any) => state.bag.total);

    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [refreshing, _setRefreshing] = useState(false);

    const RemoveProduct = (id: any) => {
        const pid = id;
        const uid = user.userData.id;

        setLoading(true);
        DeleteProductFromCart(token, pid, uid)
            .then((res: any) => {
                console.log(res);
                dispatch(removeItem(res));
                setLoading(false);
            })
            .catch((err: any) => {
                console.log(err);
                setLoading(false);
            });
    };

    const removeDealFromCart = (dealId: number) => {
        const uid = user.userData.id;

        setLoading(true);
        DeleteDealFromCart(token, dealId, uid)
            .then((res: any) => {
                console.log(res);
                dispatch(removeItem(res));
                setLoading(false);
            })
            .catch((err: any) => {
                console.log(err);
                setLoading(false);
            });

    }

    const CheckOut = () => {
        (navigation as any).navigate("BookASlot");
    };

    const RemoveAllProduct = () => {
        const uid = user.userData.id;
        setLoading(true);

        cart.map((item: any) => {
            DeleteProductFromCart(token, item.product_id, uid)
                .then((res: any) => {
                    dispatch(removeItem(res));
                    if (res.length === 0) {
                        setLoading(false);
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    setLoading(false);
                });
        });
    };

    const ClearCart = () => {
        Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
            { text: "Cancel", onPress: () => { }, style: "cancel" },
            {
                text: "Yes",
                onPress: () => {
                    RemoveAllProduct();
                },
            },
        ]);
    };

    const onRefresh = () => {
        // getCart();
    };

    return {
        token,
        user,
        cart,
        total,
        loading,
        refreshing,
        navigation,
        RemoveProduct,
        CheckOut,
        ClearCart,
        onRefresh,
        removeDealFromCart
    };
};

export default useBag;
