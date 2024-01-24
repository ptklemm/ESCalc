import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, NewCharacter, CharacterClass, Difficulty, QuestStatusChange } from '../types/Character';

export const characterSlice = createSlice({
    name: 'character',
    initialState: NewCharacter(),
    reducers: {
        changeCharacter: (_character, action: PayloadAction<Character>) => action.payload,
        changeName: (character, action: PayloadAction<string>) => {character.name = action.payload},
        changeClass: (character, action: PayloadAction<CharacterClass>) => {character.characterClass = action.payload},
        changeLevel: (character, action: PayloadAction<number>) => {character.level = action.payload},
        changeDifficulty: (character, action: PayloadAction<Difficulty>) => {character.difficultyLevel = action.payload},
        changeStrength: (character, action: PayloadAction<number>) => {character.strength = action.payload},
        changeDexterity: (character, action: PayloadAction<number>) => {character.dexterity = action.payload},
        changeVitality: (character, action: PayloadAction<number>) => {character.vitality = action.payload},
        changeEnergy: (character, action: PayloadAction<number>) => {character.energy = action.payload},
        changeQuestStatus: (character, action: PayloadAction<QuestStatusChange>) => {character.quests[action.payload.difficulty][action.payload.quest] = action.payload.isCompleted}
    }
});

export const { 
    changeCharacter,
    changeName,
    changeClass,
    changeLevel,
    changeDifficulty,
    changeStrength,
    changeDexterity,
    changeVitality,
    changeEnergy,
    changeQuestStatus
} = characterSlice.actions;

export default characterSlice.reducer;
