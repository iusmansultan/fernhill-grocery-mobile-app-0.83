import { FlatList, Image, StatusBar, View } from "react-native"
import { Text } from "react-native-gesture-handler"
import styles from "./Styles"
import logo from '../../../../../assets/logoW.png';
import useCategories from "./useCategories";
import CardView from "./Card/CardView";
import Loader from "../../../../../components/ProductLoader";

const Categories = () => {
    const { categories, loading } = useCategories();

    return (
        <View style={styles.mainContainer}>
            {
                loading && (
                    <View style={styles.loadingContainer} >
                        <Loader />
                    </View>
                )
            }

            <View style={styles.statusBarContainer}>
                <StatusBar backgroundColor={'#0066B1'} barStyle="light-content" />
            </View>
            <View>
                <View style={styles.topBar}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.headerTitle}>Categories</Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => <CardView category={item} />}
                        numColumns={2}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default Categories