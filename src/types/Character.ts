
import CharacterStats from '../data/json/CharacterStats.json';

export const enum CharacterClass {
    Amazon = "Amazon",
    Assassin = "Assassin",
    Barbarian = "Barbarian",
    Druid = "Druid",
    Necromancer = "Necromancer",
    Paladin = "Paladin",
    Sorceress = "Sorceress"
}

export const CLASSES = [
    CharacterClass.Amazon,
    CharacterClass.Assassin,
    CharacterClass.Barbarian,
    CharacterClass.Druid,
    CharacterClass.Necromancer,
    CharacterClass.Paladin,
    CharacterClass.Sorceress
];

export const enum Difficulty {
    Normal = "Normal",
    Nightmare = "Nightmare",
    Hell = "Hell"
}

export const DIFFICULTIES = [
    Difficulty.Normal,
    Difficulty.Nightmare,
    Difficulty.Hell
];

export enum Attribute {
    Strength = "Strength",
    Dexterity = "Dexterity",
    Vitality = "Vitality",
    Energy = "Energy"
}

export class Character {
    public Name: string;
    public Class: CharacterClass;
    public Level: number;
    public Difficulty: Difficulty;

    // ToDo: Quest Completion for stats, skills, resists

    // Base stats
    public BaseStrength: number;
    public BaseDexterity: number;
    public BaseVitality: number;
    public BaseEnergy: number;
    public BaseLife: number;
    public BaseMana: number;
    public BaseStamina: number;
    // Stat scaling values
    public StatPointsPerLevel: number;
    public LifePerLevel: number;
    public ManaPerLevel: number;
    public StaminaPerLevel: number;
    public LifePerVitality: number;
    public ManaPerEnergy: number;
    public StaminaPerVitality: number;
    // Stats modified by investing stat points
    public Strength: number;
    public Dexterity: number;
    public Vitality: number;
    public Energy: number;

    public ToHitFactor: number;

    constructor(characterClass?: CharacterClass, name?: string) {
        this.Class = characterClass || CharacterClass.Amazon;
        this.Name = name || "";
        this.Level = 1;
        this.Difficulty = Difficulty.Normal;

        this.BaseStrength = 15;
        this.BaseDexterity = 15;
        this.BaseVitality = 15;
        this.BaseEnergy = 15;

        this.BaseLife = this.BaseVitality;
        this.BaseMana = this.BaseEnergy;
        this.BaseStamina = 80;

        this.StatPointsPerLevel = 5;
        this.LifePerLevel = 0;
        this.ManaPerLevel = 0;
        this.StaminaPerLevel = 0;
        this.LifePerVitality = 0;
        this.ManaPerEnergy = 0;
        this.StaminaPerVitality = 0;

        this.ToHitFactor = 0;

        const baseStats = CharacterStats.find((characterStatSet) => {
            return characterStatSet.class == this.Class;
        });

        if (baseStats) {
            this.BaseStrength = Number(baseStats.str);
            this.BaseDexterity = Number(baseStats.dex);
            this.BaseVitality = Number(baseStats.vit);
            this.BaseEnergy = Number(baseStats.int);
            this.BaseLife = this.BaseVitality + Number(baseStats.hpadd);
            this.BaseMana = this.BaseEnergy;
            this.BaseStamina = Number(baseStats.stamina);
            this.StatPointsPerLevel = Number(baseStats.StatPerLevel);
            this.LifePerLevel = Number(baseStats.LifePerLevel);
            this.ManaPerLevel = Number(baseStats.ManaPerLevel);
            this.StaminaPerLevel = Number(baseStats.StaminaPerLevel);
            this.LifePerVitality = Number(baseStats.LifePerVitality);
            this.ManaPerEnergy = Number(baseStats.ManaPerMagic);
            this.StaminaPerVitality = Number(baseStats.StaminaPerVitality);
            this.ToHitFactor = Number(baseStats.ToHitFactor);
        }

        this.Strength = this.BaseStrength;
        this.Dexterity = this.BaseDexterity;
        this.Vitality = this.BaseVitality;
        this.Energy = this.BaseEnergy;
    }
}
