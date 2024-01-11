import { Character, Difficulty } from "../../types/Character";
import { Inventory } from "../../types/Inventory";
import { Item, ItemIsWeapon } from "../../types/Item";
import { ItemProperty, PropertyCode, SpecialProperty } from "../../types/Property";

// https://www.purediablo.com/strategy/diablo-2-guide-facts-and-formulae-archive

const AttackRatingPerDexterity = 5;
const DefensePerDexterity = 0.25;

const ResistancePenalty = {
    [Difficulty.Normal]: 0,
    [Difficulty.Nightmare]: -40,
    [Difficulty.Hell]: -100
}

function SumOfBaseItemField(inventory: Inventory, field: string) {
    let sum = 0;
    for (const slot of Object.keys(inventory)) {
        const item = inventory[slot];
        if (item) {
            sum += item[field];
        }
    }
    return sum;
}

function GetItemPropertyByName(item: Item, propertyName: string) {
    return item.properties.find(p => p.code === propertyName);
}

function SumOfProperty(inventory: Inventory, propertyName: string) {
    let sum = 0;

    for (const slot of Object.keys(inventory)) {
        const item = inventory[slot];
        if (item) {
            const prop = GetItemPropertyByName(item, propertyName);
            if (prop) {
                sum += prop.max;
            }
        }
    }

    return sum;
}

function SumOfPropertyOnlyArmor(inventory: Inventory, propertyName: string) {
    let total = SumOfProperty(inventory, propertyName);
    let tempProp: ItemProperty | undefined;

    if (inventory.Primary1 && ItemIsWeapon(inventory.Primary1)) {
        tempProp = GetItemPropertyByName(inventory.Primary1, propertyName);

        if (tempProp) { 
            total -= tempProp.max
        }
    }

    if (inventory.Secondary1 && ItemIsWeapon(inventory.Secondary1)) {
        tempProp = GetItemPropertyByName(inventory.Secondary1, propertyName);

        if (tempProp) { 
            total -= tempProp.max
        }
    }

    return total;
}

function calculateWeaponDamage(weapon: Item | null, characterLevel: number): [number, number] {
    // Normal
    // Weapon Minimum Damage = Base Minimum Damage * (1 + (+x% Enhanced Damage)/100) + (+x to Minimum Damage)
    // Weapon Maximum Damage = Base Maximum Damage * (1 + (+x% Enhanced Damage)/100) + (+x to Maximum Damage)

    // Ethereal
    // Weapon Minimum Damage = [[Base Minimum Damage * 1.5] * (1+ (+x % Enhanced Damage)/100)] + (+x to Minimum Damage)
    // Weapon Maximum Damage = [[Base Maximum Damage * 1.5] * (1+ (+x % Enhanced Damage)/100)] + (+x to Maximum Damage)
    
    if (!weapon) {
        return [1, 2];
    }

    const BaseDamageMin = weapon.is2H ? weapon.damageMin2H : weapon.damageMin;
    const BaseDamageMax = weapon.is2H ? weapon.damageMax2H : weapon.damageMax;

    const ethereal = GetItemPropertyByName(weapon, SpecialProperty.Ethereal);
    const enhancedDmgProperty = GetItemPropertyByName(weapon, SpecialProperty.EnhancedDamage);
    const plusMinDmgProperty = GetItemPropertyByName(weapon, SpecialProperty.PlusMinimumDamage);
    const plusMaxDmgProperty = GetItemPropertyByName(weapon, SpecialProperty.PlusMaximumDamage);
    const plusMaxDmgPerLvlProperty = GetItemPropertyByName(weapon, "dmg/lvl");

    // To Do: This formula uses Max ED. Future release to allow use of Min, Avg, or a specific amount.
    const EnhancedDamage = enhancedDmgProperty ? enhancedDmgProperty.max : 0;
    const ExtraMinimumDamage = plusMinDmgProperty ? plusMinDmgProperty.max : 0;
    const ExtraMaximumDamage = plusMaxDmgProperty ? plusMaxDmgProperty.max : 0;
    const ExtraMaxDmgFromLvl = plusMaxDmgPerLvlProperty ? Math.floor((Number(plusMaxDmgPerLvlProperty.parameter) / 8) * characterLevel) : 0;

    let EtherealModifier;
    if (ethereal) {
        EtherealModifier = 1.5;
    } else {
        EtherealModifier = 1.0;
    }

    const DamageMin = Math.floor(Math.floor(BaseDamageMin * EtherealModifier) * (1 + EnhancedDamage / 100)) + ExtraMinimumDamage;
    const DamageMax = Math.floor(Math.floor(BaseDamageMax * EtherealModifier) * (1 + EnhancedDamage / 100)) + ExtraMaximumDamage + ExtraMaxDmgFromLvl;
    
    return [DamageMin, DamageMax];
}

interface ModifiedAttributes {
    strength: number;
    dexterity: number; 
    vitality: number; 
    energy: number;
}

function calculateStatBonus(modifiedAttributes: ModifiedAttributes, item: Item | null) {
    if (!item) {
        return 0;
    }

    const strBonus = (modifiedAttributes.strength * (item.strengthBonus / 100) / 100);
    const dexBonus = (modifiedAttributes.dexterity * (item.dexterityBonus / 100) / 100);
    return strBonus + dexBonus;
}

function calculateTotalDamage(character: Character, modifiedAttributes: ModifiedAttributes, inventory: Inventory) {
    // Total Minimum Damage = (Weapon Minimum Damage + (+x To Minimum Damage)) * (1 + StatBonus + (+x% Enhanced Damage) / 100)
    // Total Maximum Damage = (Weapon Maximum Damage + (+x To Maximum Damage)) * (1 + StatBonus + (+x % Enhanced Damage) / 100)
    const [WeaponDamageMin, WeaponDamageMax] = calculateWeaponDamage(inventory.Primary1, character.level);
    const ExtraMinDamage = SumOfPropertyOnlyArmor(inventory, SpecialProperty.PlusMinimumDamage);
    const ExtraMaxDamage = SumOfPropertyOnlyArmor(inventory, SpecialProperty.PlusMaximumDamage);
    const StatBonus = calculateStatBonus(modifiedAttributes, inventory.Primary1);
    const EnhancedDamage = SumOfPropertyOnlyArmor(inventory, SpecialProperty.EnhancedDamage);

    const damageMin = Math.floor((WeaponDamageMin + ExtraMinDamage) * (1 + StatBonus + (EnhancedDamage / 100)));
    const damageMax = Math.floor((WeaponDamageMax + ExtraMaxDamage) * (1 + StatBonus + (EnhancedDamage / 100)));

    return {
        damageMin,
        damageMax
    }
}

function calculateAttributes(inventory: Inventory) {
    const AllStats = SumOfProperty(inventory, PropertyCode.AllStats) 
    const strength = SumOfProperty(inventory, PropertyCode.Strength) + AllStats;
    const dexterity = SumOfProperty(inventory, PropertyCode.Dexterity) + AllStats;
    const vitality = SumOfProperty(inventory, PropertyCode.Vitality) + AllStats;
    const energy = SumOfProperty(inventory, PropertyCode.Energy) + AllStats;

    return {
        strength,
        dexterity,
        vitality,
        energy
    }
}

function calculateInventoryStats(inventory: Inventory) {
    const defense = SumOfBaseItemField(inventory, "defenseMax");
    const chanceToBlock = inventory.secondary1 ? inventory.secondary1.chanceToBlock : 0;

    return {
        defense,
        chanceToBlock
    }
}

export default function calculateStats(character: Character, inventory: Inventory) {
    const totalStatPoints = (character.level - 1) * character.statPointsPerLevel;
    const statsInStrength = character.strength - character.baseStrength;
    const statsInDexterity = character.dexterity - character.baseDexterity;
    const statsInVitality = character.vitality - character.baseVitality;
    const statsInEnergy = character.energy - character.baseEnergy;
    const statPointsSpent = statsInStrength + statsInDexterity + statsInVitality + statsInEnergy;
    const statPointsRemaining = totalStatPoints - statPointsSpent;

    // Modify Base Attributes before performing other calculations
    const attributesFromItems = calculateAttributes(inventory);
    const strength = character.strength + attributesFromItems.strength;
    const dexterity = character.dexterity + attributesFromItems.dexterity;
    const vitality = character.vitality + attributesFromItems.vitality;
    const energy = character.energy + attributesFromItems.energy;
    const modifiedAttributes: ModifiedAttributes = { strength, dexterity, vitality, energy };

    // Calculate general stats
    const inventoryStats = calculateInventoryStats(inventory);

    const life = Math.floor(character.baseLife + (character.lifePerLevel * 0.25 * character.level) + (character.lifePerVitality * 0.25 * (vitality - character.baseVitality)));
    const mana = Math.floor(character.baseMana + (character.manaPerLevel * 0.25 * character.level) + (character.manaPerEnergy * 0.25 * (energy - character.baseEnergy)));
    const stamina = Math.floor(character.baseStamina + (character.staminaPerLevel * 0.25 * character.level) + (character.staminaPerVitality * 0.25 * (vitality - character.baseVitality)));

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

    // Calculate Total Damage
    const totalDamage = calculateTotalDamage(character, modifiedAttributes, inventory);
    const attackDamageMin = totalDamage.damageMin;
    const attackDamageMax = totalDamage.damageMax;

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
