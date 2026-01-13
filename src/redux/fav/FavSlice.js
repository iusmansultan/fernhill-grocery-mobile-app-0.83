//Action and Reducers 

import { createSlice } from '@reduxjs/toolkit';

//Combination of reducer and action
const FavSlice = createSlice({
    name: 'fav',
    initialState: {
        value: [],
    },
    reducers: {
        //All Actions 
        AddFav(state, action) {
            const data = action.payload;
            state.value = data;
        },
        removeItem(state, action) {
            const data = action.payload;
            state.value = data;
        },
        reset(state, action) {
            state.value = [];
        }
    }
})

//export all actions 
export const { AddFav, removeItem, reset } = FavSlice.actions;
//export reducer
export default FavSlice.reducer;