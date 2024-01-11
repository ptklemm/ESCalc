import { ItemType } from './ItemType';
import { ItemProperty } from './Property';

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

export function ItemIsWeapon(item: Item | null) {
    return item && item.isWearable && (item.weaponClass1H || item.weaponClass2H);
}
