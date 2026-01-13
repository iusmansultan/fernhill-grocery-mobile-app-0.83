import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getCategories } from "../../../../../helpers/Backend";

const useCategories = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("categories", categories)
    useEffect(() => {
        setLoading(true)
        GetCategories()
    }, [])

    const ApplySearch = () => {
        if (search.length > 2) {
            const filteredArray = categories.filter((category: any) => {
                if (category.name.toLowerCase().includes(search.toLowerCase())) {
                    return category;
                }
            })
            setCategories(filteredArray);
        } else {
            GetCategories()
        }
    }
    const GetCategories = () => {
        getCategories()
            .then((res: any) => {
                setLoading(false)
                setCategories(res.data.data);
            })
            .catch((err: any) => {
                setLoading(false)
                console.log(err);
            })
    }

    return {
        search,
        setSearch,
        categories,
        loading,
        ApplySearch,
        GetCategories,
        navigation
    }
}

export default useCategories