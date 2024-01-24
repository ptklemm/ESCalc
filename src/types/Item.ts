import { ItemType } from './ItemType';
import { ItemProperty, PropertyCode } from './Property';

export const ETHEREAL_MODIFIER = 1.5;

export enum BodyLocation {
    None = "",
    Head ="head",
    Torso = "tors",
    Feet = "feet",
    Gloves = "glov",
    Belt = "belt",
    Neck = "neck",
    LeftRing = "lrin",
    RightRing = "rrin",
    LeftArm = "larm",
    RightArm = "rarm"
}

export enum ItemTier {
    Normal,
    Exceptional,
    Elite
}

export const GemType = {
    0: "Weapon",
    1: "Helm/Armor",
    2: "Shield"
}

export enum ClassRestriction {
    Amazon = "ama",
    Assassin = "ass",
    Barbarian = "bar",
    Druid = "dru",
    Necromancer = "nec",
    Paladin = "pal",
    Sorceress = "sor"
}

export enum ItemKind {
    BaseItem,
    UniqueItem
}

export interface Item {
    [index: string]: any;
    
    kind: ItemKind;
    code: string;
    name: string;
    baseName: string;
    type: ItemType;
    type2: ItemType;
    typeCodes: ItemType[];
    
    carryOne: boolean;
    qualityLevel: number;
    requiredLevel: number;
    isIndestructible: boolean;
    isWearable: boolean;
    bodyLocations: BodyLocation[];
    autoPrefix: string;
    staffMods: string | undefined;
    classRestriction: string | undefined;
    speed: number;
    damageMin: number;
    damageMax: number;
    isInsertable: boolean;
    isSocketable: boolean;
    maxSockets: number;
    socketType: string;
    // Equipment Properties
    codeNormal: string;
    codeExceptional: string;
    codeElite: string;
    tier: ItemTier;
    magicLevel: number;
    durability: number;
    requiredStrength: number;
    strengthBonus: number;
    dexterityBonus: number;
    // Armor Properties
    defenseMin: number;
    defenseMax: number;
    chanceToBlock: number;
    // Weapon Properties
    requiredDexterity: number;
    weaponClass1H: string | undefined;
    weaponClass2H: string | undefined;
    is2H: boolean;
    isDualWieldable: boolean;
    damageMin2H: number;
    damageMax2H: number;
    range: number;

    properties: ItemProperty[];
    isModified: boolean;
}

export function itemIsWeapon(item: Item | null) {
    return item && item.isWearable && (item.weaponClass1H || item.weaponClass2H);
}

export function applyPropertiesToItem(item: Item, characterLevel: number): Item {
    // Only perform this function at render/calculation-time, and not on item creation. Returns a clone of the item with modified properties.
    // Modifiable properties: isIndestructible, damageMin, damageMax, damageMin2H, damageMax2H, durability, requiredStrength, requiredDexterity, defenseMin, defenseMax, chanceToBlock?
    const clone = structuredClone(item);

    const etherealMod = getItemPropertyByName(item, PropertyCode.Ethereal);
    const indestructibleMod = getItemPropertyByName(item, PropertyCode.Indestructible);
    const [damageMin, damageMax] = calculateWeaponDamage(item, characterLevel); // To Do: Add elemental damage
    const plusDurabilityMod = getItemPropertyByName(item, PropertyCode.MaxDurability);
    const requirementsMod = getItemPropertyByName(item, PropertyCode.Requirements);
    const plusDefenseMod = getItemPropertyByName(item, PropertyCode.Defense);
    const plusDefensePercentMod = getItemPropertyByName(item, PropertyCode.DefensePercent);

    if (etherealMod) {
        // Armor has base defense +50%
        clone.defenseMin = Math.floor(clone.defenseMin * ETHEREAL_MODIFIER);
        clone.defenseMax = Math.floor(clone.defenseMax * ETHEREAL_MODIFIER);
        // Weapon has base damage +50% (This is already calculated by calculateWeaponDamage())
    }

    if (indestructibleMod) {
        clone.isIndestructible = true;
    }

    if (plusDurabilityMod) {
        clone.durability += plusDurabilityMod.max;
    }

    if (requirementsMod) {
        const reqMod = 1 + (requirementsMod.max / 100);
        clone.requiredStrength = Math.floor(clone.requiredStrength * reqMod);
        clone.requiredDexterity = Math.floor(clone.requiredDexterity * reqMod);
    }

    if (plusDefenseMod) {
        clone.defenseMin += plusDefenseMod.max;
        clone.defenseMax += plusDefenseMod.max;
    }

    if (plusDefensePercentMod) {
        const defMod = 1 + (plusDefensePercentMod.max / 100);
        clone.defenseMin = Math.floor(clone.defenseMin * defMod);
        clone.defenseMax = Math.floor(clone.defenseMax * defMod);
    }

    if (etherealMod) {
        // Durability = [maximum durability/2] + 1
        clone.durability = Math.floor(clone.durability / 2) + 1;
        // Required Strength -10 and required Dexterity -10 (after any Requirements -%)
        clone.requiredStrength -= 10;
        clone.requiredDexterity -= 10;
        clone.requiredStrength = Math.max(0, clone.requiredStrength);
        clone.requiredDexterity = Math.max(0, clone.requiredDexterity);
    }

    if (clone.is2H) {
        clone.damageMin2H = damageMin;
        clone.damageMax2H = damageMax;
    } else {
        clone.damageMin = damageMin;
        clone.damageMax = damageMax;
    }

    clone.isModified = true;

    return clone;
}

export function getItemPropertyByName(item: Item, propertyName: string) {
    return item.properties.find(p => p.code === propertyName);
}

export function calculateWeaponDamage(weapon: Item | null, characterLevel: number): [number, number] {
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

    const ethereal = getItemPropertyByName(weapon, PropertyCode.Ethereal);
    const enhancedDmgProperty = getItemPropertyByName(weapon, PropertyCode.EnhancedDamage);
    const plusMinDmgProperty = getItemPropertyByName(weapon, PropertyCode.PlusMinimumDamage);
    const plusMaxDmgProperty = getItemPropertyByName(weapon, PropertyCode.PlusMaximumDamage);
    const plusMaxDmgPerLvlProperty = getItemPropertyByName(weapon, "dmg/lvl");

    // To Do: This formula uses Max ED. Future release to allow use of Min, Avg, or a specific amount.
    const EnhancedDamage = enhancedDmgProperty ? enhancedDmgProperty.max : 0;
    const ExtraMinimumDamage = plusMinDmgProperty ? plusMinDmgProperty.max : 0;
    const ExtraMaximumDamage = plusMaxDmgProperty ? plusMaxDmgProperty.max : 0;
    const ExtraMaxDmgFromLvl = plusMaxDmgPerLvlProperty ? Math.floor((Number(plusMaxDmgPerLvlProperty.parameter) / 8) * characterLevel) : 0;

    let EtherealModifier;
    if (ethereal) {
        EtherealModifier = ETHEREAL_MODIFIER;
    } else {
        EtherealModifier = 1.0;
    }

    const DamageMin = Math.floor(Math.floor(BaseDamageMin * EtherealModifier) * (1 + EnhancedDamage / 100)) + ExtraMinimumDamage;
    const DamageMax = Math.floor(Math.floor(BaseDamageMax * EtherealModifier) * (1 + EnhancedDamage / 100)) + ExtraMaximumDamage + ExtraMaxDmgFromLvl;
    
    return [DamageMin, DamageMax];
}
