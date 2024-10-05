// InventorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; 

const initialState = {
  items: [], // Store all inventory items here
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: uuidv4(),
        ...action.payload,
        dateAdded: new Date().toISOString(),
      });
    },
    
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    updateStock: (state, action) => {
      const { itemName, quantity } = action.payload; // Destructure payload
      const item = state.items.find(i => i.itemName === itemName);
      if (item) {
        item.Instock -= quantity; // Decrease stock
        item.purchasedQuantity = (Number(item.purchasedQuantity) || 0) + Number(quantity); // Increase purchased quantity
      }
    },
  },
});

export const { addItem, deleteItem, updateStock } = inventorySlice.actions;
export default inventorySlice.reducer;
