import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, NewCharacter, Difficulty } from '../types/Character';

export const characterSlice = createSlice({
    name: 'character',
    initialState: NewCharacter(),
    reducers: {
        changeCharacter: (_character, action: PayloadAction<Character>) => action.payload,
        changeLevel: (character, action: PayloadAction<number>) => {character.Level = action.payload},
        changeDifficulty: (character, action: PayloadAction<Difficulty>) => {character.DifficultyLevel = action.payload},
        changeStrength: (character, action: PayloadAction<number>) => {character.Strength = action.payload},
        changeDexterity: (character, action: PayloadAction<number>) => {character.Dexterity = action.payload},
        changeVitality: (character, action: PayloadAction<number>) => {character.Vitality = action.payload},
        changeEnergy: (character, action: PayloadAction<number>) => {character.Energy = action.payload},
    }
});

export const { 
    changeCharacter,
    changeLevel,
    changeDifficulty,
    changeStrength,
    changeDexterity,
    changeVitality,
    changeEnergy
} = characterSlice.actions;

export default characterSlice.reducer;
