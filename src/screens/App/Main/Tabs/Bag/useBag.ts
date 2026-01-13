import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../../../../../redux/Hooks";
import { removeItem } from "../../../../../redux/bag/BagSlice";
import {
    DeleteProductFromCart,
    CheckOutCart,
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
    const [buttonLoading, setButtonLoading] = useState(false);
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
        setButtonLoading(true);
        let products: any[] = [];
        let deals: any[] = [];
        console.log ("******", cart)

        cart.map((item: any) => {
            console.log("item", item.Product);
            if (item.item_type === "deal") {
                deals.push({
                    dealId: item.deal_id,
                    quantity: item.qty,
                });
            } else {
                products.push({
                    pId: item.product_id,
                    quantity: item.qty,
                });
            }
        });

        CheckOutCart({
            products,
            deals,
        })
            .then((res: any) => {
                console.log({ res });
                setButtonLoading(false);
                (navigation as any).navigate("BookASlot", { bag: res });
            })
            .catch((err: any) => {
                console.log(err);
            });
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
        buttonLoading,
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
