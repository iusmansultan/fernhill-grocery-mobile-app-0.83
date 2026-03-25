import React from "react";
import { View, Text, Image, ActivityIndicator } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const Loader = () => {
    return (
        <ActivityIndicator size="large" color="#1946A9" />
    );
}

export default Loader;
