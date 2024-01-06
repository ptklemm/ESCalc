import _ from 'lodash';
import { createContext } from 'react';

import strings from '../data/json/strings.json';
import ItemTypes from '../data/json/ItemTypes.json';
import MiscellaneousJson from '../data/json/Miscellaneous.json';
import ArmorJson from '../data/json/Armor.json';
import WeaponJson from '../data/json/Weapons.json';
import ItemStatJson from '../data/json/ItemStatCost.json';
import PropertyJson from '../data/json/Properties.json';
import UniqueItemJson from '../data/json/UniqueItems.json';

import { ItemData } from './ItemData';
import { ItemStatCostData } from './ItemStatCostData';
import { PropertyData } from './PropertyData';
import { UniqueItemData } from './UniqueItemData';

import { ItemType } from './ItemType';
import { Stat, Property, ItemProperty, FormatSpecialPropertyDescription, FormatStatDescription } from './Property';
import { Item, ModifiedBaseItem, UniqueItem, BodyLocation, GemType, ItemTier, PropertiedItemType } from './Item';
import { CharacterClass } from './Character';
import { SlotType, SlotTypeToBodyLocations } from './Inventory';
import { ToNumber } from './utils';

export enum Category {
    Empty = "",
    Miscellaneous = "Miscellaneous",
    Armor = "Armor",
    Weapons = "Weapons",
    UniqueMiscellaneous = "UniqueMiscellaneous",
    UniqueArmor = "UniqueArmor",
    UniqueWeapons = "UniqueWeapons",
    Sets = "Sets",
    Gems = "Gems",
    Runewords = "Runewords",
    Gemwords = "Gemwords",
    Properties = "Properties"
}

export const CATEGORY_OPTIONS = [
    {label: Category.Empty, value: Category.Empty},
    {label: Category.Armor, value: Category.Armor},
    {label: Category.Weapons, value: Category.Weapons}
];

const CharacterClassToItemType = (characterClass: CharacterClass): ItemType => {
    switch(characterClass) {
        case CharacterClass.Amazon:
            return ItemType.AmazonItem;
        case CharacterClass.Assassin:
            return ItemType.AssassinItem;
        case CharacterClass.Barbarian:
            return ItemType.BarbarianItem;
        case CharacterClass.Druid:
            return ItemType.DruidItem;
        case CharacterClass.Necromancer:
            return ItemType.NecromancerItem;
        case CharacterClass.Paladin:
            return ItemType.PaladinItem;
        case CharacterClass.Sorceress:
            return ItemType.SorceressItem;
        case CharacterClass.Empty:
        default:
            return ItemType.Miscellaneous;
    }
}

const Robes = [ItemType.Robe, ItemType.Cloak];
const Maces = [ItemType.Mace, ItemType.Hammer];
const ThrowingWeapons = [ItemType.ThrowingAxe, ItemType.ThrowingKnife];

const AmazonWeapons = [
    ItemType.AmazonBow1,
    ItemType.AmazonBow2,
    ItemType.AmazonJavelin,
    ItemType.AmazonSpear
];

const AssassinWeapons = [
    ItemType.Assassin2HKatana,
    ItemType.HandToHand1,
    ItemType.HandToHand2
];

const NecromancerWeapons = [
    ItemType.NecromancerDagger, 
    ItemType.NecromancerPolearm
];

const SorceressWeapons = [
    ItemType.Orb,
    ItemType.SorceressManaBlade
];

export interface ItemSearchOptions {
    name: string;
    code: string;
    category: Category;
    slotType: SlotType;
    characterClass: CharacterClass;
    requiredLevel: number;
}

export const DEFAULT_ITEM_SEARCH_OPTIONS: ItemSearchOptions = {
    name: "",
    code: "",
    category: Category.Empty,
    slotType: SlotType.Empty,
    characterClass: CharacterClass.Empty,
    requiredLevel: 1
}

class ItemCatalog {
    private miscellaneous: Item[];
    private armor: Item[];
    private weapons: Item[];
    private properties: Property[];
    private uniques: UniqueItem[];

    constructor() {
        this.miscellaneous = [];
        this.armor = [];
        this.weapons = [];
        this.properties = [];
        this.uniques = [];

        // ToDo: Figure out why Typescript thinks this is an object
        (MiscellaneousJson as ItemData[]).forEach((itemData: ItemData) => {
            this.miscellaneous.push(this.NewItem(itemData));
        });

        ArmorJson.forEach((itemData: ItemData) => {
            this.armor.push(this.NewItem(itemData));
        });

        WeaponJson.forEach((itemData: ItemData) => {
            this.weapons.push(this.NewItem(itemData));
        });

        // console.log(ItemStatJson[0]);

        PropertyJson.forEach((propertyData: PropertyData) => {
            this.properties.push(this.NewProperty(propertyData));
        });

        UniqueItemJson.forEach((uniqueItemData: UniqueItemData) => {
            this.uniques.push(this.NewUniqueItem(uniqueItemData));
        });

        // console.log(this.GetPropertyByCode("dmg%"))
        // console.log(this.GetUniqueItemByName("The Fires of Sunlight"));
        // console.log(this.GetUniqueItemByName("The Grandfather"));
    }

    get AllItems() {return [ ...this.miscellaneous, ...this.armor, ...this.weapons ]}

    //#region Armor Getters
    get Armor() {return this.armor}
    get Helms() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Helm, [ItemType.Circlet, ItemType.Pelt, ItemType.PrimalHelm]))}
    get Circlets() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Circlet))}
    get Pelts() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Pelt))}
    get PrimalHelms() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.PrimalHelm))}
    get BodyArmor() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Armor, Robes))}
    get Robes() {return this.SortArmor(this.GetItemsByTypeGroup(this.armor, Robes))}
    get Shields() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Shield))}
    get ShrunkenHeads() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.VoodooHeads))}
    get AuricShields() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.AuricShields))}
    get Gloves() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Gloves))}
    get Belts() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Belt))}
    get Boots() {return this.SortArmor(this.GetItemsByType(this.armor, ItemType.Boots))}
    //#endregion

    //#region Weapon Getters
    get Weapons() {return this.weapons}
    get Axes() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Axe))}
    get Bows() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Bow))}
    get Crossbows() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Crossbow))}
    get Daggers() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Knife))}
    get Javelins() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Javelin))}
    get Knuckles() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Knuckle))}
    get Maces() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, Maces))}
    get Polearms() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Polearm))}
    get Scepters() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Scepter))}
    get Spears() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Spear))}
    get Staves() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Staff, SorceressWeapons))}
    get Swords() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Sword))}
    get ThrowingWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, ThrowingWeapons))}
    get Wands() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.Wand))}
    get AmazonWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, AmazonWeapons))}
    get AssassinWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, AssassinWeapons))}
    get BarbarianWeapons() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.BarbarianJavs))}
    get DruidWeapons() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.DruidClub))}
    get NecromancerWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, NecromancerWeapons))}
    get PaladinWeapons() {return this.SortWeapons(this.GetItemsByType(this.weapons, ItemType.PaladinSword))}
    get SorceressWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.weapons, SorceressWeapons))}
    //#endregion

    //#region Unique Item Getters
    // get UniqueItems() {return this.uniques}
    //#endregion

    //#region Base Item Methods
    private SortItems(items: Item[], category: Category) {
        switch (category) {
            case Category.Miscellaneous:
                return _(items as Item[]).sortBy(item => item.QualityLevel).value();
            case Category.Armor:
            case Category.Weapons:
                return _(items as Item[]).sortBy(item => item.QualityLevel).sortBy(item => item.Tier).uniqBy(item => item.DisplayName).value();
            default:
                return items;
        }
    }

    public SortMisc(misc: Item[]) {
        return this.SortItems(misc, Category.Miscellaneous);
    }

    public SortArmor(armor: Item[]) {
        return this.SortItems(armor, Category.Armor);
    }

    public SortWeapons(weapons: Item[]) {
        return this.SortItems(weapons, Category.Weapons);
    }

    private FilterItems(items: Item[], predicate: _.ListIterateeCustom<Item, boolean> | undefined) {
        return _(items).filter(predicate).value();             
    }
    
    GetAllItemsByType(type: ItemType | ItemType[]) {
        return this.GetItemsByType(this.armor, type)
                        .concat(this.GetItemsByType(this.weapons, type));
    }
    
    GetItemsByType(items: Item[], include: ItemType | ItemType[], exclude?: ItemType | ItemType[]) {
        let result;

        if (include instanceof Array) {
            result = this.FilterItems(items, (item) => include.every(val => item.TypeCodes.includes(val)));
        } else {
            result = this.FilterItems(items, (item) => item.TypeCodes.includes(include));
        }

        if (exclude) {
            if (exclude instanceof Array) {
                result = result.filter(item => exclude.every(val => !item.TypeCodes.includes(val)));
            } else {
                result = result.filter(item => !item.TypeCodes.includes(exclude));
            }
        }

        return result;
    }

    GetItemsByTypeGroup(items: Item[], include: ItemType[]) {
        return this.FilterItems(items, item => include.includes(item.Type));
    }

    GetMiscByCode(code: string) {
        return this.miscellaneous.find(item => item.Code == code);
    }

    GetArmorByCode(code: string) {
        return this.armor.find(item => item.Code == code);
    }

    GetWeaponByCode(code: string) {
        return this.weapons.find(item => item.Code == code);
    }

    GetItemByCode(code: string) {
        let item: Item | undefined;
        item = this.GetMiscByCode(code);
        if (item) {return item;}
        item = this.GetArmorByCode(code);
        if (item) {return item;}
        item = this.GetWeaponByCode(code);
        return item;
    }

    GetItemsByCategory(category: Category) {
        switch (category) {
            case Category.Armor:
                return this.Armor;
            case Category.Weapons:
                return this.Weapons;
            case Category.Empty:
            default:
                return this.AllItems;
        }
    }

    SearchForItems(options: ItemSearchOptions) {
        let results: Item[] = [];

        results = this.GetItemsByCategory(options.category);

        if (options.slotType.length) {
            results = results.filter(item => SlotTypeToBodyLocations(options.slotType).some(loc => item.BodyLocations.includes(loc)));
        }

        if (options.characterClass.length) {
            results = results.filter(item => !item.TypeCodes.includes(ItemType.ClassSpecific) || item.TypeCodes.includes(CharacterClassToItemType(options.characterClass)));
        }

        if (options.name.length) {
            results = results.filter(item => item.DisplayName.toLowerCase().includes(options.name.toLowerCase()));
        }

        if (options.code.length) {
            results = results.filter(item => item.Code.toLowerCase() == options.code.toLowerCase());
        }

        results = this.SortItems(results, options.category);

        return results;
    }
    //#endregion

    //#region Item Property Methods
    GetPropertyByCode(code: string) {
        return this.properties.find(property => property.Code == code);
    }
    //#endregion

    //#region Unique Item Methods
    GetUniqueItemsByBaseType(uniqueItems: UniqueItem[], include: ItemType) {
        return uniqueItems.filter(unique => unique.BaseItem?.TypeCodes.includes(include));
    }

    GetUniqueItemByName(name: string) {
        // return this.uniques.find(unique => unique.Name == name);
        return this.uniques.findLast(unique => unique.Name == name);
    }

    public SortUniqueMisc(uniques: UniqueItem[]) {
        // return this.SortItems(uniques, Category.UniqueMiscellaneous) as UniqueItem[];
        console.log(uniques);
    }

    public SortUniqueArmor(uniques: UniqueItem[]) {
        // return this.SortItems(uniques, Category.UniqueArmor) as UniqueItem[];
        console.log(uniques);
    }

    public SortUniqueWeapons(uniques: UniqueItem[]) {
        // return this.SortItems(uniques, Category.UniqueWeapons) as UniqueItem[];
        console.log(uniques);
    }
    //#endregion

    //#region Factory Methods
    private recurseItemTypes(codeList: ItemType[], types: any[], codeToFind: ItemType): any {
        const codeToAdd = types.find(itemType => itemType.Code == codeToFind);
    
        if (codeToAdd && !codeList.includes(codeToAdd.Code)) {
            codeList.push(codeToAdd.Code);
    
            if (codeToAdd.Equiv1) {
                this.recurseItemTypes(codeList, types, codeToAdd.Equiv1);
            }
    
            if (codeToAdd.Equiv2) {
                this.recurseItemTypes(codeList, types, codeToAdd.Equiv2);
            }
        }
    
        return codeToAdd;
    }

    NewItem(itemData: ItemData): Item {
        const Code = itemData.code;
        const Type = itemData.type as ItemType;
        const Type2 = itemData.type2 as ItemType;
        const TypeCodes: ItemType[] = [];
        const itemType = this.recurseItemTypes(TypeCodes, ItemTypes, Type);
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
    
    NewModifiedBaseItem(baseItem: Item, _properties: ItemProperty[], qLvl?: number, reqLvl?: number): ModifiedBaseItem {
        const QualityLevel = qLvl || baseItem.QualityLevel;
        const RequiredLevel = reqLvl || baseItem.RequiredLevel;

        return {
            QualityLevel,
            RequiredLevel
        }
    }

    NewStat(propertyData: PropertyData, i: number): Stat | undefined {
        const Code = propertyData[`stat${i}` as keyof PropertyData];

        let DescriptionFunction = 0;
        let DescriptionValue = 0;
        let Description1 = "";
        let Description2 = "";
        let DescriptionPriority = 0;

        const itemStat = ItemStatJson.find((item_stat: ItemStatCostData) => item_stat.Stat === Code);

        if (itemStat) {
            DescriptionFunction = ToNumber(itemStat.descfunc);
            DescriptionValue = ToNumber(itemStat.descval);

            if (itemStat.descstrpos.length) {
                Description1 = strings[itemStat.descstrpos as keyof typeof strings];
            }
            
            if (itemStat.descstr2.length) {
                Description2 = strings[itemStat.descstr2 as keyof typeof strings];
            }

            DescriptionPriority = ToNumber(itemStat.descpriority);
        }

        const Function = ToNumber(propertyData[`func${i}` as keyof PropertyData]);
        const Set = propertyData[`set${i}` as keyof PropertyData];
        const Value =propertyData[`val${i}` as keyof PropertyData];

        if (Code.length) {
            return {
                Code,
                DescriptionFunction,
                DescriptionValue,
                Description1,
                Description2,
                DescriptionPriority,
                Function,
                Set,
                Value
            }
        }
    }

    NewProperty(propertyData: PropertyData): Property {
        const Code = propertyData.code;
        const IsActive = Boolean(propertyData["*done"]);
        const Description = propertyData["*desc"];
        const DescriptionParameter = propertyData["*param"];
        const DescriptionMin = propertyData["*min"];
        const DescriptionMax = propertyData["*max"];
        const Notes = propertyData["*notes"];

        const Stats: Stat[] = [];
        for (let i = 1; i < 8; i++) {
            const stat = this.NewStat(propertyData, i);

            if (stat) {
                Stats.push(stat);
            }
        }

        return {
            Code,
            IsActive,
            Description,
            DescriptionParameter,
            DescriptionMin,
            DescriptionMax,
            Notes,
            Stats
        }
    }

    NewItemProperty(property: Property, stat: Stat | null, min: number, max: number, parameter: string,): ItemProperty {
        const Property = property.Code;
        const Min = min;
        const Max = max;
        const Parameter = parameter;

        let Stat = property.Code;
        let Function = 7;
        let DescriptionPriority = 255;
        let DescriptionFunction = 4;
        let DescriptionValue = 1;
        let FormattedDescription: string | null = stat ? stat.Code : property.Code;

        if (stat) {
            Stat = stat.Code;
            Function = stat.Function;
            DescriptionPriority = stat.DescriptionPriority;
            DescriptionFunction = stat.DescriptionFunction;
            DescriptionValue = stat.DescriptionValue;
            FormattedDescription = FormatStatDescription(
                stat.DescriptionFunction,
                stat.DescriptionValue,
                stat.Description1,
                stat.Description2,
                stat.Function,
                min,
                max,
                parameter
            );
        } else {
            // Special case for properties that do not use stats, like Enhanced Damage
            FormattedDescription = FormatSpecialPropertyDescription(property.Code, min, max, parameter);
        }

        return {
            Property,
            Stat,
            Function,
            Min,
            Max,
            Parameter,
            FormattedDescription,
            DescriptionPriority,
            DescriptionFunction,
            DescriptionValue
        }
    }

    NewUniqueItem(uniqueItemData: UniqueItemData): UniqueItem {
        const propertiedItemType = PropertiedItemType.Unique;
        const BaseItem = this.GetItemByCode(uniqueItemData.code);
        const Name = strings[uniqueItemData.index as keyof typeof strings];
        const CarryOne = Boolean(Number(uniqueItemData.carry1));
        const QualityLevelUnique = Number(uniqueItemData.lvl);
        const RequiredLevelUnique = Number(uniqueItemData['lvl req']);
        const Properties: ItemProperty[] = [];

        for (let i = 1; i < 13; i++) {
            // ItemProperty flattens Property.Stats
            const property = this.GetPropertyByCode(uniqueItemData[`prop${i}` as keyof UniqueItemData]);
            
            if (property) {
                if (property.Stats.length) {
                    for (const stat of property.Stats) {
                        Properties.push(this.NewItemProperty(
                            property,
                            stat,
                            ToNumber(uniqueItemData[`min${i}` as keyof UniqueItemData]),
                            ToNumber(uniqueItemData[`max${i}` as keyof UniqueItemData]),
                            uniqueItemData[`par${i}` as keyof UniqueItemData]
                        ));
                    }
                } else {
                    // Special case for properties that have no stats, like Enhanced Damage
                    Properties.push(this.NewItemProperty(
                        property,
                        null,
                        ToNumber(uniqueItemData[`min${i}` as keyof UniqueItemData]),
                        ToNumber(uniqueItemData[`max${i}` as keyof UniqueItemData]),
                        uniqueItemData[`par${i}` as keyof UniqueItemData]
                    ));
                }
            }
        }

        let ModifiedItem = undefined;
        if (BaseItem) {
            ModifiedItem = this.NewModifiedBaseItem(BaseItem, Properties, QualityLevelUnique, RequiredLevelUnique);
        }
    
        return {
            PropertiedItemType: propertiedItemType,
            BaseItem,
            Name,
            QualityLevelUnique,
            RequiredLevelUnique,
            CarryOne,
            Properties,
            ModifiedItem
        }
    }
    //#endregion
}

export const ItemCatalogContext = createContext(new ItemCatalog());
