import { Character, Difficulty } from "../../types/Character";
import { Inventory } from "../../types/Inventory";

const AttackRatingPerDexterity = 5;
const DefensePerDexterity = 0.25;

const ResistancePenalty = {
    [Difficulty.Normal]: 0,
    [Difficulty.Nightmare]: -40,
    [Difficulty.Hell]: -100
}

function SumOf(inventory: Inventory, stat: string) {
    let sum = 0;
    for (const slot of Object.keys(inventory)) {
        const item = inventory[slot];
        if (item) {
            sum += item[stat];
        }
    }
    return sum;
}

function CalculateInventoryStats(inventory: Inventory) {
    const DamageMin = inventory.Primary1 ? inventory.Primary1.DamageMin : 0;
    const DamageMax = inventory.Primary1 ? inventory.Primary1.DamageMax : 0;
    const Defense = SumOf(inventory, "DefenseMax");
    const ChanceToBlock = inventory.Secondary1 ? inventory.Secondary1.ChanceToBlock : 0;

    return {
        DamageMin,
        DamageMax,
        Defense,
        ChanceToBlock
    }
}

export default function CalculateStats(character: Character, inventory: Inventory) {
    const InventoryStats = CalculateInventoryStats(inventory);
    
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

    const AttackDamageMin = InventoryStats.DamageMin || 1;
    const AttackDamageMax = InventoryStats.DamageMax || 2;

    const AttackRating = ((character.Dexterity - 7) * AttackRatingPerDexterity) + character.ToHitFactor;
    const ChanceToHit = 95;
    
    const Defense = Math.floor(character.Dexterity * DefensePerDexterity) + InventoryStats.Defense;
    const ChanceToBeHit = 95;
    const ChanceToBlock = InventoryStats.ChanceToBlock;

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
