import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, DEFAULT_ITEM_SEARCH_OPTIONS } from '../types/ItemCatalog';
import { SlotType } from '../types/Inventory';
import { CharacterClass } from '../types/Character';

export const inventorySearchSlice = createSlice({
    name: 'inventorySearch',
    initialState: DEFAULT_ITEM_SEARCH_OPTIONS,
    reducers: {
        resetToDefault: () => DEFAULT_ITEM_SEARCH_OPTIONS,
        changeName: (options, action: PayloadAction<string>) => {options.name = action.payload},
        changeCode: (options, action: PayloadAction<string>) => {options.code = action.payload},
        changeCategory: (options, action: PayloadAction<Category>) => {options.category = action.payload},
        changeSlotType: (options, action: PayloadAction<SlotType>) => {options.slotType = action.payload},
        changeCharacterClass: (options, action: PayloadAction<CharacterClass>) => {options.characterClass = action.payload},
        changeRequiredLevel: (options, action: PayloadAction<number>) => {options.requiredLevel = action.payload}
    }
});

export const { 
    resetToDefault,
    changeName,
    changeCode,
    changeCategory,
    changeSlotType,
    changeCharacterClass,
    changeRequiredLevel
} = inventorySearchSlice.actions;

export default inventorySearchSlice.reducer;
