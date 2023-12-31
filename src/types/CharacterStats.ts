import { Character } from "./Character";

const AttackRatingPerDexterity = 5;
const DefensePerDexterity = 0.25;

const ResistancePenalty = {
    Normal: 0,
    Nightmare: -40,
    Hell: -100
}

export class CharacterStats {
    public TotalStatPoints: number;
    public StatsInStrength: number;
    public StatsInDexterity: number;
    public StatsInVitality: number;
    public StatsInEnergy: number;
    public StatPointsSpent: number;
    public StatPointsRemaining: number;
    
    public Strength: number;
    public Dexterity: number;
    public Vitality: number;
    public Energy: number;

    public Life: number;
    public Mana: number;
    public Stamina: number;

    public AttackDamageMin: number;
    public AttackDamageMax: number;

    public AttackRating: number;
    public ChanceToHit: number;

    public Defense: number;
    public ChanceToBeHit: number;
    public ChanceToBlock: number;

    public ResistanceFire: number;
    public ResistanceCold: number;
    public ResistanceLightning: number;
    public ResistancePoison: number;

    constructor(c: Character) {
        this.TotalStatPoints = (c.Level - 1) * c.StatPointsPerLevel;
        this.StatsInStrength = c.Strength - c.BaseStrength;
        this.StatsInDexterity = c.Dexterity - c.BaseDexterity;
        this.StatsInVitality = c.Vitality - c.BaseVitality;
        this.StatsInEnergy = c.Energy - c.BaseEnergy;
        this.StatPointsSpent = this.StatsInStrength + this.StatsInDexterity + this.StatsInVitality + this.StatsInEnergy;
        this.StatPointsRemaining = this.TotalStatPoints - this.StatPointsSpent;

        this.Strength = c.Strength;
        this.Dexterity = c.Dexterity;
        this.Vitality = c.Vitality;
        this.Energy = c.Energy;

        this.Life = c.BaseLife + (c.LifePerLevel * 0.25 * c.Level) + (c.LifePerVitality * 0.25 * this.StatsInVitality);
        this.Mana = c.BaseMana + (c.ManaPerLevel * 0.25 * c.Level) + (c.ManaPerEnergy * 0.25 * this.StatsInEnergy);
        this.Stamina = Math.floor(c.BaseStamina + (c.StaminaPerLevel * 0.25 * c.Level) + (c.StaminaPerVitality * 0.25 * this.StatsInVitality));

        this.AttackDamageMin = 1;
        this.AttackDamageMax = 2;

        this.AttackRating = ((c.Dexterity - 7) * AttackRatingPerDexterity) + c.ToHitFactor;
        this.ChanceToHit = 95;
        
        this.Defense = Math.floor(c.Dexterity * DefensePerDexterity);
        this.ChanceToBeHit = 95;
        this.ChanceToBlock = 0;

        this.ResistanceFire = ResistancePenalty[c.Difficulty];
        this.ResistanceCold = ResistancePenalty[c.Difficulty];
        this.ResistanceLightning = ResistancePenalty[c.Difficulty];
        this.ResistancePoison = ResistancePenalty[c.Difficulty];
    }
}