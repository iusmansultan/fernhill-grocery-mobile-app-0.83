import { Image, StatusBar, Text, TouchableOpacity, View, TextInput, ActivityIndicator, FlatList } from "react-native";
import { styles } from "./Styles";
import logo from "../../../../../assets/logoW.png";
import useHome from "./useHome";
import ProductCard from "../../../../../components/ProductCard";
import DealCard from "../../../../../components/DealCard";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../../../../../components/ProductLoader";
import Modal from "react-native-modal";

const Dashboard = () => {
    const {
        products,
        fav,
        deals,
        dealsLoading,
        HandleAllProducts,
        HandleFeaturedProducts,
        loading,
        zip,
        isModalVisible,
        loadZip,
        setIsModalVisible,
        setZip,
        onModalButtonPress } = useHome();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Loader />
            </View>
        );
    }

    return (
        <View>
            <Modal isVisible={isModalVisible}>
                <View
                    style={styles.modalViewContainer}
                >
                    <View
                        style={styles.modalViewInnerContainer}
                    >
                        <View style={styles.main}>
                            <View
                                style={styles.marginTop19}
                            >
                                <Text
                                    style={styles.helloText}
                                >
                                    Hello.
                                </Text>
                                <Text style={styles.blackText}>
                                    Please enter your postcode to start shopping.
                                </Text>
                                <View>
                                    <View style={styles.inputView}>
                                        <TextInput
                                            style={styles.inputText}
                                            placeholder="Your Postcode"
                                            placeholderTextColor={"#0066B1"}
                                            onChangeText={(text) => setZip(text)}
                                            value={zip.toUpperCase()}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={onModalButtonPress}
                                        style={styles.searchBtn}
                                    >
                                        {loadZip ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text
                                                style={styles.searchButtonText}
                                            >
                                                Search
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <StatusBar backgroundColor="#0066B1" barStyle="light-content" />
            <View style={styles.topBar}>
                <Image
                    source={logo}
                    style={styles.logoStyles}
                />
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={styles.zipCodeButton}
                >

                    <Text style={styles.whiteText}>
                        Postcode: {zip.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* <View
                style={styles.userNameContainer}
            >
                <Text
                    style={styles.userNameText}
                >
                    Hey Demo!
                </Text>
            </View> */}
            <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
                {deals && deals.length > 0 && (
                    <View style={styles.dealsSection}>
                        <Text style={styles.dealsSectionTitle}>Hot Deals 🔥</Text>
                        {dealsLoading ? (
                            <ActivityIndicator size="small" color="#0066B1" />
                        ) : (
                            <FlatList
                                data={deals}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item: any) => item.id.toString()}
                                renderItem={({ item }: { item: any }) => <DealCard deal={item} />}
                                contentContainerStyle={styles.dealsListContainer}
                            />
                        )}
                    </View>
                )}
                <View
                    style={styles.buttonsContainer}
                >
                    <TouchableOpacity
                        onPress={HandleFeaturedProducts}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            Featured Products
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={HandleAllProducts}
                    >
                        <Text
                            style={styles.buttonText}
                        >
                            All Products
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.productView}>
                    {products &&
                        products.map((product: any, index: number) => {
                            return (
                                <ProductCard
                                    key={index}
                                    id={product?.id}
                                    image={product?.thumb}
                                    price={product?.price}
                                    description={product?.description}
                                    name={product?.name}
                                    isFav={fav.some((element: any) => {
                                        if (element.Product.id === product?.id)
                                            return true;
                                        else return false;
                                    })}
                                />
                            );
                        })}
                </View>
            </ScrollView>
        </View>
    )
}

export default Dashboard;