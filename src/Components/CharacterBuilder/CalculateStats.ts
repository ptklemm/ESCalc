import { Character, Difficulty } from "../../types/Character";
import { Inventory } from "../../types/Inventory";

// https://www.purediablo.com/strategy/diablo-2-guide-facts-and-formulae-archive

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

function calculateInventoryStats(inventory: Inventory) {
    const damageMin = inventory.primary1 ? inventory.primary1.damageMin : 0;
    const damageMax = inventory.primary1 ? inventory.primary1.damageMax : 0;
    const defense = SumOf(inventory, "defenseMax");
    const chanceToBlock = inventory.secondary1 ? inventory.secondary1.chanceToBlock : 0;

    return {
        damageMin,
        damageMax,
        defense,
        chanceToBlock
    }
}

export default function calculateStats(character: Character, inventory: Inventory) {
    const inventoryStats = calculateInventoryStats(inventory);
    
    const totalStatPoints = (character.level - 1) * character.statPointsPerLevel;
    const statsInStrength = character.strength - character.baseStrength;
    const statsInDexterity = character.dexterity - character.baseDexterity;
    const statsInVitality = character.vitality - character.baseVitality;
    const statsInEnergy = character.energy - character.baseEnergy;
    const statPointsSpent = statsInStrength + statsInDexterity + statsInVitality + statsInEnergy;
    const statPointsRemaining = totalStatPoints - statPointsSpent;

    const strength = character.strength;
    const dexterity = character.dexterity;
    const vitality = character.vitality;
    const energy = character.energy;

    const life = Math.floor(character.baseLife + (character.lifePerLevel * 0.25 * character.level) + (character.lifePerVitality * 0.25 * statsInVitality));
    const mana = Math.floor(character.baseMana + (character.manaPerLevel * 0.25 * character.level) + (character.manaPerEnergy * 0.25 * statsInEnergy));
    const stamina = Math.floor(character.baseStamina + (character.staminaPerLevel * 0.25 * character.level) + (character.staminaPerVitality * 0.25 * statsInVitality));

    const attackDamageMin = inventoryStats.damageMin || 1;
    const attackDamageMax = inventoryStats.damageMax || 2;

    const attackRating = ((character.dexterity - 7) * AttackRatingPerDexterity) + character.toHitFactor;
    const chanceToHit = 95;
    
    const defense = Math.floor(character.dexterity * DefensePerDexterity) + inventoryStats.defense;
    const chanceToBeHit = 95;

    // Total Blocking = [(Blocking * (Dexterity – 15)) / (Character Level * 2)]
    const chanceToBlock = Math.floor((inventoryStats.chanceToBlock * (dexterity - 15)) / (character.level * 2));

    const resistanceFire = ResistancePenalty[character.difficultyLevel];
    const resistanceCold = ResistancePenalty[character.difficultyLevel];
    const resistanceLightning = ResistancePenalty[character.difficultyLevel];
    const resistancePoison = ResistancePenalty[character.difficultyLevel];

    return {
        totalStatPoints,
        statsInStrength,
        statsInDexterity,
        statsInVitality,
        statsInEnergy,
        statPointsSpent,
        statPointsRemaining,
        strength,
        dexterity,
        vitality,
        energy,
        life,
        mana,
        stamina,
        attackDamageMin,
        attackDamageMax,
        attackRating,
        chanceToHit,
        defense,
        chanceToBeHit,
        chanceToBlock,
        resistanceFire,
        resistanceCold,
        resistanceLightning,
        resistancePoison
    }
}
