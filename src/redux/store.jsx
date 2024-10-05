
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import inventoryReducer from './slices/InventorySlice';
import addedItemsReducer  from './slices/AddedItemsSlice'

// Redux Persist Configuration
const persistConfig = {
  key: 'root', 
  storage,     
};

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  addedItems: addedItemsReducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check
    }),
});

// Export the persistor
export const persistor = persistStore(store);

