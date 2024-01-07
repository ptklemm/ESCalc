import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, NewCharacter, Difficulty } from '../types/Character';

export const characterSlice = createSlice({
    name: 'character',
    initialState: NewCharacter(),
    reducers: {
        changeCharacter: (_character, action: PayloadAction<Character>) => action.payload,
        changeLevel: (character, action: PayloadAction<number>) => {character.level = action.payload},
        changeDifficulty: (character, action: PayloadAction<Difficulty>) => {character.difficultyLevel = action.payload},
        changeStrength: (character, action: PayloadAction<number>) => {character.strength = action.payload},
        changeDexterity: (character, action: PayloadAction<number>) => {character.dexterity = action.payload},
        changeVitality: (character, action: PayloadAction<number>) => {character.vitality = action.payload},
        changeEnergy: (character, action: PayloadAction<number>) => {character.energy = action.payload},
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
