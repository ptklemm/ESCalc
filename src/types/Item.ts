import strings from '../data/json/strings.json';
import ItemTypes from '../data/json/ItemTypes.json';
import { ItemData } from './ItemData';
// import { UniqueItemData } from './UniqueItemData';
import { ItemType } from './ItemType';
// import { MagicProperty } from './Property';
// import { ItemCatalog } from './ItemCatalog';

export function ToNumber(value: string | undefined | null): number {
    const numValue = Number(value);

    if (!numValue) {
        return 0;
    }

    return numValue;
}

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

function recurseItemTypes(codeList: ItemType[], types: any[], codeToFind: ItemType): any {
    const codeToAdd = types.find(itemType => itemType.Code == codeToFind);

    if (codeToAdd && !codeList.includes(codeToAdd.Code)) {
        codeList.push(codeToAdd.Code);

        if (codeToAdd.Equiv1) {
            recurseItemTypes(codeList, types, codeToAdd.Equiv1);
        }

        if (codeToAdd.Equiv2) {
            recurseItemTypes(codeList, types, codeToAdd.Equiv2);
        }
    }

    return codeToAdd;
}

export interface Item {
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

export const NewItem = (itemData: ItemData): Item => {
    const Code = itemData.code;
    const Type = itemData.type as ItemType;
    const Type2 = itemData.type2 as ItemType;
    const TypeCodes: ItemType[] = [];
    const itemType = recurseItemTypes(TypeCodes, ItemTypes, Type);
    const IsWearable = Boolean(ToNumber(itemType?.Body));
    const BodyLocations: BodyLocation[] = [];
    if (IsWearable) {
        BodyLocations.push(itemType!.BodyLoc1);
        BodyLocations.push(itemType!.BodyLoc2);
    }
    const StaffMods = itemType?.StaffMods;
    const ClassRestriction = itemType?.Class;
    const Name = itemData.name;
    const DisplayName = strings[itemData.namestr as keyof typeof strings] || Name;
    const QualityLevel = ToNumber(itemData.level);
    const AutoPrefix = itemData['auto prefix'];
    const IsIndestructible = Boolean(ToNumber(itemData.nodurability));
    const Speed = ToNumber(itemData.speed);
    const RequiredLevel = ToNumber(itemData.levelreq);
    const IsInsertable = Boolean(ToNumber(itemType?.Gem as string)); 
    const IsSocketable = Boolean(ToNumber(itemData.hasinv));
    const MaxSockets = ToNumber(itemData.gemsockets);
    const SocketType = GemType[ToNumber(itemData.gemapplytype) as keyof typeof GemType];
    const DamageMin = ToNumber(itemData.mindam);
    const DamageMax = ToNumber(itemData.maxdam);

    // Equipment Properties
    const CodeNormal = itemData.normcode;
    const CodeExceptional = itemData.ubercode;
    const CodeElite = itemData.ultracode;

    let Tier: ItemTier;
    switch (Code) {
        case CodeExceptional:
            Tier = ItemTier.Exceptional;
            break;
        case CodeElite:
            Tier = ItemTier.Elite;
            break;
        case CodeNormal:
        default:
            Tier = ItemTier.Normal;
            break;
    }

    const MagicLevel = ToNumber(itemData['magic lvl']);
    const Durability = ToNumber(itemData.durability);
    const RequiredStrength = ToNumber(itemData.reqstr);
    const StrengthBonus = ToNumber(itemData.StrBonus);
    const DexterityBonus = ToNumber(itemData.DexBonus);

    // Armor Properties
    const DefenseMin = ToNumber(itemData.minac);
    const DefenseMax = ToNumber(itemData.maxac);
    const ChanceToBlock = ToNumber(itemData.block);

    // Weapon Properties
    const RequiredDexterity = ToNumber(itemData.reqdex);
    const WeaponClass1H = itemData.wclass;
    const WeaponClass2H = itemData['2handedwclass'];
    const Is2H = Boolean(ToNumber(itemData['2handed']));
    const IsDualWieldable = Boolean(ToNumber(itemData['1or2handed']));
    const DamageMin2H = ToNumber(itemData['2handmindam']);
    const DamageMax2H = ToNumber(itemData['2handmaxdam']);
    const Range = ToNumber(itemData.rangeadder);

    return {
        DisplayName,
        Name,
        Code,
        Type,
        Type2,
        TypeCodes,
        QualityLevel,
        RequiredLevel,
        IsIndestructible,
        IsWearable,
        BodyLocations,
        AutoPrefix,
        StaffMods,
        ClassRestriction,
        Speed,
        DamageMin,
        DamageMax,
        IsInsertable,
        IsSocketable,
        MaxSockets,
        SocketType,
        CodeNormal,
        CodeExceptional,
        CodeElite,
        Tier,
        MagicLevel,
        Durability,
        RequiredStrength,
        StrengthBonus,
        DexterityBonus,
        DefenseMin,
        DefenseMax,
        ChanceToBlock,
        RequiredDexterity,
        WeaponClass1H,
        WeaponClass2H,
        Is2H,
        IsDualWieldable,
        DamageMin2H,
        DamageMax2H,
        Range
    }
}

// export class ItemOld {
//     // Common Properties
//     public DisplayName: string;
//     public Name: string;
//     public Code: string;
//     public Type: ItemType;
//     public Type2: string;
//     public TypeCodes: ItemType[];
//     public QualityLevel: number;
//     public RequiredLevel: number;
//     public IsIndestructible: boolean;
//     public IsWearable: boolean;
//     public BodyLocations: Set<string>;
//     public AutoPrefix: string;
//     public StaffMods: string | undefined;
//     public ClassRestriction: string | undefined;
//     public Speed: number;
//     public DamageMin: number;
//     public DamageMax: number;
//     public IsInsertable: boolean;
//     public IsSocketable: boolean;
//     public MaxSockets: number;
//     public SocketType: string;
//     // Equipment Properties
//     public CodeNormal: string;
//     public CodeExceptional: string;
//     public CodeElite: string;
//     public Tier: ItemTier;
//     public MagicLevel: number;
//     public Durability: number;
//     public RequiredStrength: number;
//     public StrengthBonus: number;
//     public DexterityBonus: number;
//     // Armor Properties
//     public DefenseMin: number;
//     public DefenseMax: number;
//     public ChanceToBlock: number;
//     // Weapon Properties
//     public RequiredDexterity: number;
//     public WeaponClass1H: string | undefined;
//     public WeaponClass2H: string | undefined;
//     public Is2H: boolean;
//     public IsDualWieldable: boolean;
//     public DamageMin2H: number;
//     public DamageMax2H: number;
//     public Range: number;

//     constructor(d: ItemData) {
//         this.Code = d.code;
//         this.Type = d.type as ItemType;
//         this.Type2 = d.type2;
//         this.TypeCodes = [];
//         const itemType = recurseItemTypes(this.TypeCodes, ItemTypes, this.Type);
//         this.IsWearable = Boolean(ToNumber(itemType?.Body));
//         this.BodyLocations = new Set();
//         if (this.IsWearable) {
//             this.BodyLocations.add(itemType!.BodyLoc1);
//             this.BodyLocations.add(itemType!.BodyLoc2);
//         }
//         this.StaffMods = itemType?.StaffMods;
//         this.ClassRestriction = itemType?.Class;
//         this.Name = d.name;
//         this.DisplayName = strings[d.namestr as keyof typeof strings] || this.Name;
//         this.QualityLevel = ToNumber(d.level);
//         this.AutoPrefix = d['auto prefix'];
//         this.IsIndestructible = Boolean(ToNumber(d.nodurability));
//         this.Speed = ToNumber(d.speed);
//         this.RequiredLevel = ToNumber(d.levelreq);
//         this.IsInsertable = Boolean(ToNumber(itemType?.Gem as string)); 
//         this.IsSocketable = Boolean(ToNumber(d.hasinv));
//         this.MaxSockets = ToNumber(d.gemsockets);
//         this.SocketType = GemType[ToNumber(d.gemapplytype) as keyof typeof GemType];
//         this.DamageMin = ToNumber(d.mindam);
//         this.DamageMax = ToNumber(d.maxdam);

//         // Equipment Properties
//         this.CodeNormal = d.normcode;
//         this.CodeExceptional = d.ubercode;
//         this.CodeElite = d.ultracode;
        
//         switch (this.Code) {
//             case this.CodeExceptional:
//                 this.Tier = ItemTier.Exceptional;
//                 break;
//             case this.CodeElite:
//                 this.Tier = ItemTier.Elite;
//                 break;
//             case this.CodeNormal:
//             default:
//                 this.Tier = ItemTier.Normal;
//                 break;
//         }

//         this.MagicLevel = ToNumber(d['magic lvl']);
//         this.Durability = ToNumber(d.durability);
//         this.RequiredStrength = ToNumber(d.reqstr);
//         this.StrengthBonus = ToNumber(d.StrBonus);
//         this.DexterityBonus = ToNumber(d.DexBonus);

//         // Armor Properties
//         this.DefenseMin = ToNumber(d.minac);
//         this.DefenseMax = ToNumber(d.maxac);
//         this.ChanceToBlock = ToNumber(d.block);

//         // Weapon Properties
//         this.RequiredDexterity = ToNumber(d.reqdex);
//         this.WeaponClass1H = d.wclass;
//         this.WeaponClass2H = d['2handedwclass'];
//         this.Is2H = Boolean(ToNumber(d['2handed']));
//         this.IsDualWieldable = Boolean(ToNumber(d['1or2handed']));
//         this.DamageMin2H = ToNumber(d['2handmindam']);
//         this.DamageMax2H = ToNumber(d['2handmaxdam']);
//         this.Range = ToNumber(d.rangeadder);
//     }
// }

// export interface MagicItem {
//     BaseItem: Item | undefined;
//     MagicProperties: MagicProperty[];
// }

// export class UniqueItem implements MagicItem {
//     public Name: string;
//     public BaseItem: Item | undefined;
//     public QualityLevelUnique: number;
//     public RequiredLevelUnique: number;
//     public CarryOne: boolean;
//     public MagicProperties: MagicProperty[];

//     constructor(catalog: ItemCatalog, data: UniqueItemData) {
//         this.BaseItem = catalog.GetItemByCode(data.code);
//         this.Name = strings[data.index as keyof typeof strings];
//         this.CarryOne = Boolean(Number(data.carry1));
//         this.QualityLevelUnique = Number(data.lvl);
//         this.RequiredLevelUnique = Number(data['lvl req']);
//         this.MagicProperties = [];

//         for (let i = 1; i < 13; i++) {
//             const property = catalog.GetPropertyByCode(data[`prop${i}` as keyof UniqueItemData]);
//             if (property) {
//                 this.MagicProperties.push(new MagicProperty(
//                     property,
//                     data[`par${i}` as keyof UniqueItemData],
//                     Number(data[`min${i}` as keyof UniqueItemData]),
//                     Number(data[`max${i}` as keyof UniqueItemData])
//                 ));
//             }
//         }
//     }
// }