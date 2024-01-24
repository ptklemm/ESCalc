import CharacterStats from '../data/json/CharacterStats.json';

export enum CharacterClass {
    Empty = "",
    Amazon = "Amazon",
    Assassin = "Assassin",
    Barbarian = "Barbarian",
    Druid = "Druid",
    Necromancer = "Necromancer",
    Paladin = "Paladin",
    Sorceress = "Sorceress"
}

export const CLASS_OPTIONS_MINIMAL = [
    {label: CharacterClass.Amazon, value: CharacterClass.Amazon},
    {label: CharacterClass.Assassin, value: CharacterClass.Assassin},
    {label: CharacterClass.Barbarian, value: CharacterClass.Barbarian},
    {label: CharacterClass.Druid, value: CharacterClass.Druid},
    {label: CharacterClass.Necromancer, value: CharacterClass.Necromancer},
    {label: CharacterClass.Paladin, value: CharacterClass.Paladin},
    {label: CharacterClass.Sorceress, value: CharacterClass.Sorceress}
];

export const CLASS_OPTIONS = [
    {label: CharacterClass.Empty, value: CharacterClass.Empty},
    ...CLASS_OPTIONS_MINIMAL
];

export enum Difficulty {
    Normal = "Normal",
    Nightmare = "Nightmare",
    Hell = "Hell"
}

export const DIFFICULTY_OPTIONS = [
    {label: Difficulty.Normal, value: Difficulty.Normal},
    {label: Difficulty.Nightmare, value: Difficulty.Nightmare},
    {label: Difficulty.Hell, value: Difficulty.Hell}
];

export enum Attribute {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Vitality = "Vitality",
    Energy = "Energy"
}

export enum Quest {
    DenOfEvil = "Den of Evil", // +1 skill point
    Radament = "Radament's Lair", // +1 skill point
    GoldenBird = "The Golden Bird", // +20 life
    LamEsen = "Lam Esen's Tome", // +5 stat points
    Izual = "The Fallen Angel", // +2 skill points
    Anya = "The Prison of Ice" // +10% all resistances
}

interface QuestCompletionList {
    [Quest.DenOfEvil]: boolean;
    [Quest.Radament]: boolean;
    [Quest.GoldenBird]: boolean;
    [Quest.LamEsen]: boolean;
    [Quest.Izual]: boolean;
    [Quest.Anya]: boolean;
}

const NewQuestCompletionList = (): QuestCompletionList => {
    return {
        [Quest.DenOfEvil]: false,
        [Quest.Radament]: false,
        [Quest.GoldenBird]: false,
        [Quest.LamEsen]: false,
        [Quest.Izual]: false,
        [Quest.Anya]: false
    }
}

export interface QuestCompletionMatrix {
    [Difficulty.Normal]: QuestCompletionList,
    [Difficulty.Nightmare]: QuestCompletionList,
    [Difficulty.Hell]: QuestCompletionList
}

const NewQuestCompletionMatrix = (): QuestCompletionMatrix => {
    return {
        [Difficulty.Normal]: NewQuestCompletionList(),
        [Difficulty.Nightmare]: NewQuestCompletionList(),
        [Difficulty.Hell]: NewQuestCompletionList()
    }
}

export interface QuestStatusChange {
    difficulty: Difficulty;
    quest: Quest;
    isCompleted: boolean;
}

export interface Character {
    name: string;
    characterClass: CharacterClass;
    level: number;
    difficultyLevel: Difficulty;
    quests: QuestCompletionMatrix;
    baseStrength: number;
    baseDexterity: number;
    baseVitality: number;
    baseEnergy: number;
    baseLife: number;
    baseMana: number;
    baseStamina: number;
    statPointsPerLevel: number;
    lifePerLevel: number;
    manaPerLevel: number;
    staminaPerLevel: number;
    lifePerVitality: number;
    manaPerEnergy: number;
    staminaPerVitality: number;
    strength: number;
    dexterity: number;
    vitality: number;
    energy: number;
    toHitFactor: number;
}

export const NewCharacter = (charClass?: CharacterClass, charName?: string): Character => {
    const name = charName || "";
    const characterClass = charClass || CharacterClass.Amazon;
    const level = 1;
    const difficultyLevel = Difficulty.Normal;
    const quests = NewQuestCompletionMatrix();
    let baseStrength = 15;
    let baseDexterity = 15;
    let baseVitality = 15;
    let baseEnergy = 15;
    let baseLife = baseVitality;
    let baseMana = baseEnergy;
    let baseStamina = 80;
    let statPointsPerLevel = 5;
    let lifePerLevel = 0;
    let manaPerLevel = 0;
    let staminaPerLevel = 0;
    let lifePerVitality = 0;
    let manaPerEnergy = 0;
    let staminaPerVitality = 0;
    let toHitFactor = 0;

    const baseStats = CharacterStats.find(characterStatData => characterStatData.class == characterClass);

    if (baseStats) {
        baseStrength = Number(baseStats.str);
        baseDexterity = Number(baseStats.dex);
        baseVitality = Number(baseStats.vit);
        baseEnergy = Number(baseStats.int);
        baseLife = baseVitality + Number(baseStats.hpadd);
        baseMana = baseEnergy;
        baseStamina = Number(baseStats.stamina);
        statPointsPerLevel = Number(baseStats.StatPerLevel);
        lifePerLevel = Number(baseStats.LifePerLevel);
        manaPerLevel = Number(baseStats.ManaPerLevel);
        staminaPerLevel = Number(baseStats.StaminaPerLevel);
        lifePerVitality = Number(baseStats.LifePerVitality);
        manaPerEnergy = Number(baseStats.ManaPerMagic);
        staminaPerVitality = Number(baseStats.StaminaPerVitality);
        toHitFactor = Number(baseStats.ToHitFactor);
    }

    const strength = baseStrength;
    const dexterity = baseDexterity;
    const vitality = baseVitality;
    const energy = baseEnergy;

    return {
        name,
        characterClass,
        level,
        difficultyLevel,
        quests,
        baseStrength,
        baseDexterity,
        baseVitality,
        baseEnergy,
        baseLife,
        baseMana,
        baseStamina,
        statPointsPerLevel,
        lifePerLevel,
        manaPerLevel,
        staminaPerLevel,
        lifePerVitality,
        manaPerEnergy,
        staminaPerVitality,
        strength,
        dexterity,
        vitality,
        energy,
        toHitFactor
    }
}
