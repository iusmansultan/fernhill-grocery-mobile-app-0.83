import { useNavigation } from "@react-navigation/native";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import styles from "./Styles";

const CardView = ({ category }: any) => {
    const navigation = useNavigation();

    const onPress = () => {
        if (category.id === 14) {
            Alert.alert(
                "Age Ristriction",
                "Are you above age 18?",
                [
                    {
                        text: "Yes",
                        onPress: () => {
                            (navigation as any).navigate('Products', { category: category })
                        }
                    },
                    {
                        text: "No",
                        onPress: () => { }
                    }
                ]
            )
        } else {
            (navigation as any).navigate('Products', { category: category })
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: category.thumb || "https://ps.w.org/gazchaps-woocommerce-auto-category-product-thumbnails/assets/icon-256x256.png?rev=1848416" }} style={styles.image} />
            <Text style={styles.label}>{category.name}</Text>
        </TouchableOpacity>
    );
}

export default CardView