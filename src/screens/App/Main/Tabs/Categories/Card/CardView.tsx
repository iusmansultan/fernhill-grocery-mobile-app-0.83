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
                            navigation.navigate('Products', { category: category })
                        }
                    },
                    {
                        text: "No",
                        onPress: () => { }
                    }
                ]
            )
        } else {
            navigation.navigate('Products', { category: category })
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: category.thumb }} style={styles.image} />
            <Text style={styles.label}>{category.name}</Text>
        </TouchableOpacity>
    );
}

export default CardView