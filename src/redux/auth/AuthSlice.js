//Action and Reducers 

import { createSlice } from '@reduxjs/toolkit';

//Combination of reducer and action
const AuthSlice = createSlice({
    name: 'user',
    initialState: {
        value: {
            isLoggedIn: false,
            userData: {}
        },
        token: "",
        image: "",
        storeId: "1",
        fav: [],
        zip: ""
    },
    reducers: {
        //All Actions 
        saveUser(state, action) {
            const data = action.payload;
            state.value = action.payload;
        },
        saveToken(state, action) {
            state.token = action.payload;
        },
        saveImage(state, action) {
            state.image = action.payload;
        },
        saveStoreId(state, action) {
            state.store_id = action.payload;
        },
        saveFav(state, action) {
            state.fav = action.payload;
        },
        saveZip(state, action) {
            state.zip = action.payload;
        }
    }
})

//export all actions 
export const { saveUser, saveToken, saveImage, saveStoreId, saveFav, saveZip } = AuthSlice.actions;
//export reducer
export default AuthSlice.reducer;