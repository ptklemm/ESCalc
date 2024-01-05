import { Character, Difficulty } from "./Character";
import { Inventory } from "./Inventory";

const AttackRatingPerDexterity = 5;
const DefensePerDexterity = 0.25;

const ResistancePenalty = {
    [Difficulty.Normal]: 0,
    [Difficulty.Nightmare]: -40,
    [Difficulty.Hell]: -100
}

export default function CalculateStats(character: Character, inventory: Inventory) {
    const TotalStatPoints = (character.Level - 1) * character.StatPointsPerLevel;
    const StatsInStrength = character.Strength - character.BaseStrength;
    const StatsInDexterity = character.Dexterity - character.BaseDexterity;
    const StatsInVitality = character.Vitality - character.BaseVitality;
    const StatsInEnergy = character.Energy - character.BaseEnergy;
    const StatPointsSpent = StatsInStrength + StatsInDexterity + StatsInVitality + StatsInEnergy;
    const StatPointsRemaining = TotalStatPoints - StatPointsSpent;

    const Strength = character.Strength;
    const Dexterity = character.Dexterity;
    const Vitality = character.Vitality;
    const Energy = character.Energy;

    const Life = Math.floor(character.BaseLife + (character.LifePerLevel * 0.25 * character.Level) + (character.LifePerVitality * 0.25 * StatsInVitality));
    const Mana = Math.floor(character.BaseMana + (character.ManaPerLevel * 0.25 * character.Level) + (character.ManaPerEnergy * 0.25 * StatsInEnergy));
    const Stamina = Math.floor(character.BaseStamina + (character.StaminaPerLevel * 0.25 * character.Level) + (character.StaminaPerVitality * 0.25 * StatsInVitality));

    const AttackDamageMin = 1;
    const AttackDamageMax = 2;

    const AttackRating = ((character.Dexterity - 7) * AttackRatingPerDexterity) + character.ToHitFactor;
    const ChanceToHit = 95;
    
    const Defense = Math.floor(character.Dexterity * DefensePerDexterity);
    const ChanceToBeHit = 95;
    const ChanceToBlock = 0;

    const ResistanceFire = ResistancePenalty[character.DifficultyLevel];
    const ResistanceCold = ResistancePenalty[character.DifficultyLevel];
    const ResistanceLightning = ResistancePenalty[character.DifficultyLevel];
    const ResistancePoison = ResistancePenalty[character.DifficultyLevel];

    return {
        TotalStatPoints,
        StatsInStrength,
        StatsInDexterity,
        StatsInVitality,
        StatsInEnergy,
        StatPointsSpent,
        StatPointsRemaining,
        Strength,
        Dexterity,
        Vitality,
        Energy,
        Life,
        Mana,
        Stamina,
        AttackDamageMin,
        AttackDamageMax,
        AttackRating,
        ChanceToHit,
        Defense,
        ChanceToBeHit,
        ChanceToBlock,
        ResistanceFire,
        ResistanceCold,
        ResistanceLightning,
        ResistancePoison
    }
}
