
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // Ensure this is defined
};

const addedItemsSlice = createSlice({
    name: 'addedItems',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.itemName !== action.payload.itemName);
        },
        clearItems: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, clearItems } = addedItemsSlice.actions;
export default addedItemsSlice.reducer;
