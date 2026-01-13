//Action and Reducers 

import { createSlice } from '@reduxjs/toolkit';

//Combination of reducer and action
const BagSlice = createSlice({
    name: 'bag',
    initialState: {
        value: [],
        total: 0,
    },
    reducers: {
        //All Actions 
        addItem(state, action) {
            const data = action.payload;
            state.value = data;
            console.log("DATA =>", data)
            state.total = data.reduce(
              (total, item) => item.item_type === "deal" ? total + item.Deal.deal_price * item.qty : total + item.Product.price * item.qty,
              0
            );
        },
        removeItem(state, action) {
            const data = action.payload;
            state.value = data;
            state.total = data.reduce(
              (total, item) => item.item_type === "deal" ? total + item.Deal.deal_price * item.qty : total + item.Product.price * item.qty,
              0
            );

        },
        reset(state, action) {
            state.value = [];
            state.total = 0;
        }
    }
})

//export all actions 
export const { addItem, removeItem, reset } = BagSlice.actions;
//export reducer
export default BagSlice.reducer;