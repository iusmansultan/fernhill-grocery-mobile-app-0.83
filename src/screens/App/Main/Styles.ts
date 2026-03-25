import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    barStyles: { backgroundColor: '#1946A9', height: 100 },
    activeIndicatorStyle: { backgroundColor: 'transparent' },
    labelStyle: { color: 'white', fontSize: 12, alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
    iconStyle: { tintColor: 'gray', height: 22, width: 22, resizeMode: 'cover' },
    focusedIconStyle: { tintColor: 'white', height: 22, width: 22, resizeMode: 'cover' },
})

export default Styles