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

export interface Item {
    [index: string]: any;
    // Common Properties
    DisplayName: string;
    Name: string;
    Code: string;
    Type: ItemType;
    Type2: ItemType;
    TypeCodes: ItemType[];
    QualityLevel: number;
    RequiredLevel: number;
    IsIndestructible: boolean;
    IsWearable: boolean;
    BodyLocations: BodyLocation[];
    AutoPrefix: string;
    StaffMods: string | undefined;
    ClassRestriction: string | undefined;
    Speed: number;
    DamageMin: number;
    DamageMax: number;
    IsInsertable: boolean;
    IsSocketable: boolean;
    MaxSockets: number;
    SocketType: string;
    // Equipment Properties
    CodeNormal: string;
    CodeExceptional: string;
    CodeElite: string;
    Tier: ItemTier;
    MagicLevel: number;
    Durability: number;
    RequiredStrength: number;
    StrengthBonus: number;
    DexterityBonus: number;
    // Armor Properties
    DefenseMin: number;
    DefenseMax: number;
    ChanceToBlock: number;
    // Weapon Properties
    RequiredDexterity: number;
    WeaponClass1H: string | undefined;
    WeaponClass2H: string | undefined;
    Is2H: boolean;
    IsDualWieldable: boolean;
    DamageMin2H: number;
    DamageMax2H: number;
    Range: number;
}

export interface ModifiedBaseItem {
    QualityLevel: number;
    RequiredLevel: number;
    // IsIndestructible: boolean;
    // ClassRestriction: string | undefined;
    // Sockets: number;
    // Durability: number;
    // RequiredStrength: number;
    // RequiredDexterity: number;
    // DefenseMin: number;
    // DefenseMax: number;
    // ChanceToBlock: number;
    // DamageMin: number;
    // DamageMax: number;
    // DamageMin2H: number;
    // DamageMax2H: number;
}

export enum PropertiedItemType {
    Unique
}

export interface PropertiedItem {
    PropertiedItemType: PropertiedItemType;
    BaseItem: Item | undefined;
    Properties: ItemProperty[];
    ModifiedItem: ModifiedBaseItem | undefined;
}

export interface UniqueItem extends PropertiedItem {
    Name: string;
    QualityLevelUnique: number;
    RequiredLevelUnique: number;
    CarryOne: boolean;
}
