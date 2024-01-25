import { Character, Difficulty, Quest } from "../../types/Character";
import { Inventory } from "../../types/Inventory";
import { Item, itemIsWeapon, getItemPropertyByName, calculateWeaponDamage } from "../../types/Item";
import { ItemProperty, PropertyCode } from "../../types/Property";
import { toNumber } from "../../types/utils";

// https://www.purediablo.com/strategy/diablo-2-guide-facts-and-formulae-archive

const AttackRatingPerDexterity = 5;
const DefensePerDexterity = 0.25;

const ResistancePenalty = {
    [Difficulty.Normal]: 0,
    [Difficulty.Nightmare]: -40,
    [Difficulty.Hell]: -100
}

function SumOfProperty(inventory: Inventory, propertyCode: PropertyCode, useParameter?: boolean) {
    let sum = 0;

    for (const slot of Object.keys(inventory)) {
        const item = inventory[slot];
        if (item) {
            const prop = getItemPropertyByName(item, propertyCode);
            if (prop) {
                sum += useParameter ? toNumber(prop.parameter) : prop.max;
            }
        }
    }

    return sum;
}

function SumOfPropertyOnlyArmor(inventory: Inventory, propertyCode: PropertyCode, useParameter?: boolean) {
    let total = SumOfProperty(inventory, propertyCode, useParameter);
    let tempProp: ItemProperty | undefined;

    if (inventory.Primary1 && itemIsWeapon(inventory.Primary1)) {
        tempProp = getItemPropertyByName(inventory.Primary1, propertyCode);

        if (tempProp) { 
            total -= useParameter ? toNumber(tempProp.parameter) : tempProp.max;
        }
    }

    if (inventory.Secondary1 && itemIsWeapon(inventory.Secondary1)) {
        tempProp = getItemPropertyByName(inventory.Secondary1, propertyCode);

        if (tempProp) { 
            total -= useParameter ? toNumber(tempProp.parameter) : tempProp.max;
        }
    }

    return total;
}

interface Attributes {
    strength: number;
    dexterity: number; 
    vitality: number; 
    energy: number;
}

function calculateStatBonus(modifiedAttributes: Attributes, item: Item | null) {
    if (!item) {
        return 0;
    }

    const strBonus = (modifiedAttributes.strength * (item.strengthBonus / 100)) / 100;
    const dexBonus = (modifiedAttributes.dexterity * (item.dexterityBonus / 100)) / 100;
    return strBonus + dexBonus;
}

function calculateTotalDamage(character: Character, modifiedAttributes: Attributes, inventory: Inventory) {
    // Total Minimum Damage = (Weapon Minimum Damage + (+x To Minimum Damage)) * (1 + StatBonus + (+x% Enhanced Damage) / 100)
    // Total Maximum Damage = (Weapon Maximum Damage + (+x To Maximum Damage)) * (1 + StatBonus + (+x % Enhanced Damage) / 100)
    const [WeaponDamageMin, WeaponDamageMax] = calculateWeaponDamage(inventory.Primary1, character.level);
    const ExtraMinDamage = SumOfPropertyOnlyArmor(inventory, PropertyCode.PlusMinimumDamage);
    const ExtraMaxDamage = SumOfPropertyOnlyArmor(inventory, PropertyCode.PlusMaximumDamage);
    const StatBonus = calculateStatBonus(modifiedAttributes, inventory.Primary1);
    const EnhancedDamage = SumOfPropertyOnlyArmor(inventory, PropertyCode.EnhancedDamage);

    const damageMin = Math.floor((WeaponDamageMin + ExtraMinDamage) * (1 + StatBonus + (EnhancedDamage / 100)));
    const damageMax = Math.floor((WeaponDamageMax + ExtraMaxDamage) * (1 + StatBonus + (EnhancedDamage / 100)));

    return {
        damageMin,
        damageMax
    }
}

function calculateAttributesFromItems(inventory: Inventory, characterLevel: number): Attributes {
    const AllStats  = SumOfProperty(inventory, PropertyCode.AllStats );

    const StrengthFromLevels  = (SumOfProperty(inventory, PropertyCode.StrengthPerLevel)  * 0.25) * characterLevel;
    const DexterityFromLevels = (SumOfProperty(inventory, PropertyCode.DexterityPerLevel) * 0.25) * characterLevel;
    const VitalityFromLevels  = (SumOfProperty(inventory, PropertyCode.VitalityPerLevel)  * 0.25) * characterLevel;
    const EnergyFromLevels    = (SumOfProperty(inventory, PropertyCode.EnergyPerLevel)    * 0.25) * characterLevel;

    const strength  = SumOfProperty(inventory, PropertyCode.Strength ) + StrengthFromLevels  + AllStats;
    const dexterity = SumOfProperty(inventory, PropertyCode.Dexterity) + DexterityFromLevels + AllStats;
    const vitality  = SumOfProperty(inventory, PropertyCode.Vitality ) + VitalityFromLevels  + AllStats;
    const energy    = SumOfProperty(inventory, PropertyCode.Energy   ) + EnergyFromLevels    + AllStats;

    return { strength, dexterity, vitality, energy }
}

// function calculateDefenseFromItems(inventory: Inventory) {
//     let totalDefense = 0;
// }

function calculateInventoryStats(inventory: Inventory) {
    // const defense = SumOfBaseItemField(inventory, "defenseMax");
    const defense = 0;
    const chanceToBlock = inventory.secondary1 ? inventory.secondary1.chanceToBlock : 0;

    return {
        defense,
        chanceToBlock
    }
}

function calculateLife(character: Character, inventory: Inventory, attributesFromItems: Attributes) {
    // https://forums.d2jsp.org/topic.php?t=28710016&f=87

    // Max Life = (Boostable Life)*(1 + Life Boost/100) + Non-boostable Life
    // Max Mana = (Boostable Mana)*(1 + Mana Boost/100) + Non-boostable Mana
    // Max Stamina = (Boostable Stamina)*(1 + Stamina Boost/100) + Non-boostable Stamina

    // Boostable Life / Mana bonuses
    // Life / Mana gained naturally per level-up *)
    // Life / Mana gained from points spent in Vitality / Energy **)
    // Life / Mana gained from the item bonuses, "+X to Life" / "+Y to Mana"
    // Life gained from a Potion of Life ("+20 to Life"), quest reward, "The Golden Bird" (Act III)

    // Non-boostable Life / Mana bonuses
    // Life / Mana gained from Vitality / Energy item bonuses (e.g. Infinity, The Oculus, Lidless Wall)
    // Life / Mana gained from Character Level based item bonuses (e.g. Fortitude, Harlequin Crest, Wizardspike)

    const BaseLife = character.baseLife;
    const LifeFromLevels = (character.lifePerLevel / 4) * (character.level - 1);
    const LifeFromCharacterVitality = (character.lifePerVitality / 4) * (character.vitality - character.baseVitality);
    const PlusLife = SumOfProperty(inventory, PropertyCode.Life);
    let LifeFromQuests = 0;
    if (character.quests[Difficulty.Normal][Quest.GoldenBird]) { LifeFromQuests += 20; }
    if (character.quests[Difficulty.Nightmare][Quest.GoldenBird]) { LifeFromQuests += 20; }
    if (character.quests[Difficulty.Hell][Quest.GoldenBird]) { LifeFromQuests += 20; }

    const PlusMaximumLifePercent = SumOfProperty(inventory, PropertyCode.LifePercent);

    const LifeFromItemVitality = (character.lifePerVitality / 4) * attributesFromItems.vitality;
    const LifeFromItemLifePerLevel = (SumOfProperty(inventory, PropertyCode.LifePerLevel, true) / 8) * character.level;

    const MaximumLife = Math.floor((BaseLife + LifeFromLevels + LifeFromCharacterVitality + PlusLife + LifeFromQuests) * (1 + (PlusMaximumLifePercent / 100)) + LifeFromItemVitality + LifeFromItemLifePerLevel);

    return MaximumLife;
}

function calculateMana(character: Character, inventory: Inventory, attributesFromItems: Attributes) {
    const BaseMana = character.baseMana;
    const ManaFromLevels = (character.manaPerLevel / 4) * (character.level - 1);
    const ManaFromCharacterEnergy = (character.manaPerEnergy / 4) * (character.energy - character.baseEnergy);
    const PlusMana = SumOfProperty(inventory, PropertyCode.Mana);

    const PlusMaximumManaPercent = SumOfProperty(inventory, PropertyCode.ManaPercent);

    const ManaFromItemEnergy = (character.manaPerEnergy / 4) * attributesFromItems.energy;
    const ManaFromItemManaPerLevel = (SumOfProperty(inventory, PropertyCode.ManaPerLevel, true) / 8) * character.level;

    const MaximumMana = Math.floor((BaseMana + ManaFromLevels + ManaFromCharacterEnergy + PlusMana) * (1 + (PlusMaximumManaPercent / 100)) + ManaFromItemEnergy + ManaFromItemManaPerLevel);

    return MaximumMana;
}

function calculateStamina(character: Character, inventory: Inventory, attributesFromItems: Attributes) {
    const BaseStamina = character.baseStamina;
    const StaminaFromLevels = (character.staminaPerLevel / 4) * (character.level - 1);
    const StaminaFromCharacterVitality = (character.staminaPerVitality / 4) * (character.vitality - character.baseVitality);
    const PlusStamina = SumOfProperty(inventory, PropertyCode.Stamina);

    const StaminaFromItemVitality = (character.staminaPerVitality / 4) * attributesFromItems.vitality;
    const StaminaFromItemStaminaPerLevel = (SumOfProperty(inventory, PropertyCode.StaminaPerLevel, true) / 8) * character.level;

    const MaximumStamina = Math.floor(BaseStamina + StaminaFromLevels + StaminaFromCharacterVitality + PlusStamina + StaminaFromItemVitality + StaminaFromItemStaminaPerLevel);

    return MaximumStamina;
}

function calculateStatPoints(character: Character) {
    let statPointsFromQuests = 0;
    
    if (character.quests[Difficulty.Normal][Quest.LamEsen]) { statPointsFromQuests += 5; }
    if (character.quests[Difficulty.Nightmare][Quest.LamEsen]) { statPointsFromQuests += 5; }
    if (character.quests[Difficulty.Hell][Quest.LamEsen]) { statPointsFromQuests += 5; }

    return ((character.level - 1) * character.statPointsPerLevel) + statPointsFromQuests;
}

function calculateAttackRating(character: Character, inventory: Inventory, modifiedAttributes: Attributes) {
    const baseAttackRating = ((modifiedAttributes.dexterity - 7) * AttackRatingPerDexterity) + character.toHitFactor;
    
    const plusAttackRating = SumOfProperty(inventory, PropertyCode.AttackRating);
    const plusAttackRatingPerLevel = SumOfProperty(inventory, PropertyCode.AttackRatingPerLevel, true) / 2;
    const totalPlusAttackRating = plusAttackRating + (plusAttackRatingPerLevel * character.level);

    const attackRatingPercent = SumOfProperty(inventory, PropertyCode.AttackRatingPercent);
    const attackRatingPercentPerLevel = SumOfProperty(inventory, PropertyCode.AttackRatingPercentPerLevel, true) / 2;
    const totalAttackRatingPercent = (attackRatingPercent + (attackRatingPercentPerLevel * character.level)) / 100;

    const attackRating = Math.floor((baseAttackRating + totalPlusAttackRating) * (1 + totalAttackRatingPercent));

    return attackRating;
}

function calculateResistances(character: Character, inventory: Inventory) {
    let resistancesFromQuests = 0;

    if (character.quests[Difficulty.Normal][Quest.Anya]) { resistancesFromQuests += 10; }
    if (character.quests[Difficulty.Nightmare][Quest.Anya]) { resistancesFromQuests += 10; }
    if (character.quests[Difficulty.Hell][Quest.Anya]) { resistancesFromQuests += 10; }

    const resistAllMax = SumOfProperty(inventory, PropertyCode.ResistAllMax);
    const resistFireMax = Math.min(95, 75 + SumOfProperty(inventory, PropertyCode.ResistFireMax) + resistAllMax);
    const resistColdMax = Math.min(95, 75 + SumOfProperty(inventory, PropertyCode.ResistColdMax) + resistAllMax);
    const resistLightningMax = Math.min(95, 75 + SumOfProperty(inventory, PropertyCode.ResistLightningMax) + resistAllMax);
    const resistPoisonMax = Math.min(95, 75 + SumOfProperty(inventory, PropertyCode.ResistPoisonMax) + resistAllMax);

    const resistAll = SumOfProperty(inventory, PropertyCode.ResistAll);
    const resistanceFire = Math.min(resistFireMax, ResistancePenalty[character.difficultyLevel] + resistancesFromQuests + SumOfProperty(inventory, PropertyCode.ResistFire) + resistAll);
    const resistanceCold = Math.min(resistColdMax, ResistancePenalty[character.difficultyLevel] + resistancesFromQuests + SumOfProperty(inventory, PropertyCode.ResistCold) + resistAll);
    const resistanceLightning = Math.min(resistLightningMax, ResistancePenalty[character.difficultyLevel] + resistancesFromQuests + SumOfProperty(inventory, PropertyCode.ResistLightning) + resistAll);
    const resistancePoison = Math.min(resistPoisonMax, ResistancePenalty[character.difficultyLevel] + resistancesFromQuests + SumOfProperty(inventory, PropertyCode.ResistPoison) + resistAll);

    return { resistanceFire, resistanceCold, resistanceLightning, resistancePoison }
}

export interface CalculatedStats {
    totalStatPoints: number;
    statsInStrength: number;
    statsInDexterity: number;
    statsInVitality: number;
    statsInEnergy: number;
    statPointsSpent: number;
    statPointsRemaining: number;
    strength: number;
    dexterity: number;
    vitality: number;
    energy: number;
    life: number;
    mana: number;
    stamina: number;
    attackDamageMin: number;
    attackDamageMax: number;
    attackRating: number;
    chanceToHit: number;
    defense: number;
    chanceToBeHit: number;
    chanceToBlock: number;
    resistanceFire: number;
    resistanceCold: number;
    resistanceLightning: number;
    resistancePoison: number;
}

export function calculateStats(character: Character, inventory: Inventory): CalculatedStats {
    const totalStatPoints = calculateStatPoints(character);
    const statsInStrength = character.strength - character.baseStrength;
    const statsInDexterity = character.dexterity - character.baseDexterity;
    const statsInVitality = character.vitality - character.baseVitality;
    const statsInEnergy = character.energy - character.baseEnergy;
    const statPointsSpent = statsInStrength + statsInDexterity + statsInVitality + statsInEnergy;
    const statPointsRemaining = totalStatPoints - statPointsSpent;

    // Modify Base Attributes before performing other calculations
    const attributesFromItems = calculateAttributesFromItems(inventory, character.level);
    const strength = character.strength + attributesFromItems.strength;
    const dexterity = character.dexterity + attributesFromItems.dexterity;
    const vitality = character.vitality + attributesFromItems.vitality;
    const energy = character.energy + attributesFromItems.energy;
    const modifiedAttributes: Attributes = { strength, dexterity, vitality, energy };

    const life = calculateLife(character, inventory, attributesFromItems);
    const mana = calculateMana(character, inventory, attributesFromItems);
    const stamina = calculateStamina(character, inventory, attributesFromItems);

    const attackRating = calculateAttackRating(character, inventory, modifiedAttributes);
    // 100 * AR / (AR + DR) * 2 * alvl / (alvl + dlvl)
    const chanceToHit = Math.floor(100 * (attackRating / (attackRating + 5000)) * 2 * (character.level / (character.level + character.level)));

    const inventoryStats = calculateInventoryStats(inventory);
    
    const defense = Math.floor(character.dexterity * DefensePerDexterity) + inventoryStats.defense;
    const chanceToBeHit = 95;

    // Total Blocking = [(Blocking * (Dexterity – 15)) / (Character Level * 2)]
    const chanceToBlock = Math.floor((inventoryStats.chanceToBlock * (dexterity - 15)) / (character.level * 2));

    const {
        resistanceFire, 
        resistanceCold, 
        resistanceLightning, 
        resistancePoison
     } = calculateResistances(character, inventory);

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
