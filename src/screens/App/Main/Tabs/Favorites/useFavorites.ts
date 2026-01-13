import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAppSelector } from "../../../../../redux/Hooks";

const useFavorites = () => {
    const fav = useAppSelector((state: any) => state.user.fav);

    const [products, setProducts] = useState(fav);
    const [loading, _setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setProducts(fav);
        }, [fav])
    );

    return {
        fav,
        products,
        loading,
    };
};

export default useFavorites;
