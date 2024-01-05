import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './characterReducer';
import inventoryReducer from './inventoryReducer';
import itemSearchReducer from './itemSearchReducer';

export const store = configureStore({
    reducer: {
        character: characterReducer,
        inventory: inventoryReducer,
        itemSearch: itemSearchReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  