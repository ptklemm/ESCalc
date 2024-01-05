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

export interface Character {
    Name: string;
    Class: CharacterClass;
    Level: number;
    DifficultyLevel: Difficulty;
    // ToDo: Quest Completion for stats, skills, resists
    BaseStrength: number;
    BaseDexterity: number;
    BaseVitality: number;
    BaseEnergy: number;
    BaseLife: number;
    BaseMana: number;
    BaseStamina: number;
    StatPointsPerLevel: number;
    LifePerLevel: number;
    ManaPerLevel: number;
    StaminaPerLevel: number;
    LifePerVitality: number;
    ManaPerEnergy: number;
    StaminaPerVitality: number;
    Strength: number;
    Dexterity: number;
    Vitality: number;
    Energy: number;
    ToHitFactor: number;
}

export const NewCharacter = (characterClass?: CharacterClass, name?: string): Character => {
    const Class = characterClass || CharacterClass.Amazon;
    const Name = name || "";
    const Level = 1;
    const DifficultyLevel = Difficulty.Normal;
    let BaseStrength = 15;
    let BaseDexterity = 15;
    let BaseVitality = 15;
    let BaseEnergy = 15;
    let BaseLife = BaseVitality;
    let BaseMana = BaseEnergy;
    let BaseStamina = 80;
    let StatPointsPerLevel = 5;
    let LifePerLevel = 0;
    let ManaPerLevel = 0;
    let StaminaPerLevel = 0;
    let LifePerVitality = 0;
    let ManaPerEnergy = 0;
    let StaminaPerVitality = 0;
    let ToHitFactor = 0;

    const baseStats = CharacterStats.find(characterStatData => characterStatData.class == Class);

    if (baseStats) {
        BaseStrength = Number(baseStats.str);
        BaseDexterity = Number(baseStats.dex);
        BaseVitality = Number(baseStats.vit);
        BaseEnergy = Number(baseStats.int);
        BaseLife = BaseVitality + Number(baseStats.hpadd);
        BaseMana = BaseEnergy;
        BaseStamina = Number(baseStats.stamina);
        StatPointsPerLevel = Number(baseStats.StatPerLevel);
        LifePerLevel = Number(baseStats.LifePerLevel);
        ManaPerLevel = Number(baseStats.ManaPerLevel);
        StaminaPerLevel = Number(baseStats.StaminaPerLevel);
        LifePerVitality = Number(baseStats.LifePerVitality);
        ManaPerEnergy = Number(baseStats.ManaPerMagic);
        StaminaPerVitality = Number(baseStats.StaminaPerVitality);
        ToHitFactor = Number(baseStats.ToHitFactor);
    }

    const Strength = BaseStrength;
    const Dexterity = BaseDexterity;
    const Vitality = BaseVitality;
    const Energy = BaseEnergy;

    return {
        Name,
        Class,
        Level,
        DifficultyLevel,
        BaseStrength,
        BaseDexterity,
        BaseVitality,
        BaseEnergy,
        BaseLife,
        BaseMana,
        BaseStamina,
        StatPointsPerLevel,
        LifePerLevel,
        ManaPerLevel,
        StaminaPerLevel,
        LifePerVitality,
        ManaPerEnergy,
        StaminaPerVitality,
        Strength,
        Dexterity,
        Vitality,
        Energy,
        ToHitFactor
    }
}
