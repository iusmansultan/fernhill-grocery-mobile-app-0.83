import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
// Thunk is included by default with RTK; no need to import explicitly


import AuthReduicers from "./auth/AuthSlice";
import BagReduicers from "./bag/BagSlice";
import FavReduicers from "./fav/FavSlice";

const reducers = combineReducers({
    user: AuthReduicers,
    bag: BagReduicers,
    fav: FavReduicers
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
})
