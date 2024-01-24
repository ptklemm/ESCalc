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

import { ItemTypeData } from './ItemTypeData';
import { ItemData } from './ItemData';
import { ItemStatCostData } from './ItemStatCostData';
import { PropertyData } from './PropertyData';
import { UniqueItemData } from './UniqueItemData';

import { ItemType } from './ItemType';
import { 
    Stat, 
    Property, 
    ItemProperty,
    ItemPropertyDescription,
    NewItemPropertyDescription
} from './Property';
import { ItemKind, Item, BodyLocation, GemType, ItemTier } from './Item';
import { CharacterClass } from './Character';
import { SlotType, SlotTypeToBodyLocations } from './Inventory';
import { toNumber } from './utils';

export enum Category {
    Empty = "",
    Miscellaneous = "Miscellaneous",
    Armor = "Armor",
    Weapons = "Weapons",
    UniqueRings = "UniqueRings",
    UniqueAmulets = "UniqueAmulets",
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
    {label: "Unique Armor", value: Category.UniqueArmor},
    {label: "Unique Weapons", value: Category.UniqueWeapons},
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
    private uniques: Item[];

    constructor() {
        this.miscellaneous = [];
        this.armor = [];
        this.weapons = [];
        this.properties = [];
        this.uniques = [];

        // ToDo: Figure out why Typescript thinks this is an object
        (MiscellaneousJson as ItemData[]).forEach((itemData: ItemData) => {
            this.miscellaneous.push(this.createItem(ItemKind.BaseItem, itemData));
        });

        ArmorJson.forEach((itemData: ItemData) => {
            this.armor.push(this.createItem(ItemKind.BaseItem, itemData));
        });

        WeaponJson.forEach((itemData: ItemData) => {
            this.weapons.push(this.createItem(ItemKind.BaseItem, itemData));
        });

        PropertyJson.forEach((propertyData: PropertyData) => {
            this.properties.push(this.createProperty(propertyData));
        });

        UniqueItemJson.forEach((uniqueItemData: UniqueItemData) => {
            const uniqueItem = this.createUniqueItem(uniqueItemData);
            if (uniqueItem) this.uniques.push(uniqueItem);
        });
    }

    get AllItems() {return [ ...this.miscellaneous, ...this.armor, ...this.weapons, ...this.uniques ]}

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
    get UniqueItems() {return this.uniques}

    get UniqueRings() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Ring, ItemType.ClassSpecific))}
    get UniqueAmazonianLoops() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AmazonianLoop))}
    get UniqueAssassinsSpirals() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AssassinsJewel))}
    get UniqueBarbaricHoops() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.BarbaricKnuckle))}
    get UniqueDruidsSeals() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.DruidsSeal))}
    get UniqueNecromancersStones() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.NecromancersStone))}
    get UniquePaladicHaloes() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.PaladicHalo))}
    get UniqueSorcerersBands() { return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.SorcerersBand))}

    get UniqueAmulets() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Amulet, ItemType.ClassSpecific))}
    get UniqueAmazonianPins() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AmazonianPin))}
    get UniqueAssassinsChokers() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AssassinsChoker))}
    get UniqueTotemicPebbles() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.PrimalCharm))}
    get UniqueDruidicNecklaces() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.DruidicNecklace))}
    get UniqueDeathsLockets() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.DeathsLocket))}
    get UniqueHolyPendants() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.HolyPendant))}
    get UniqueSorcerersTalismans() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.SorcerersTalisman))}

    get UniqueArmor() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AnyArmor))}
    get UniqueHelms() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Helm, [ItemType.Circlet, ItemType.Pelt, ItemType.PrimalHelm]))}
    get UniqueCirclets() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Circlet))}
    get UniquePelts() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Pelt))}
    get UniquePrimalHelms() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.PrimalHelm))}
    get UniqueBodyArmor() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Armor, Robes))}
    get UniqueRobes() {return this.SortArmor(this.GetItemsByTypeGroup(this.uniques, Robes))}
    get UniqueShields() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Shield))}
    get UniqueShrunkenHeads() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.VoodooHeads))}
    get UniqueAuricShields() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.AuricShields))}
    get UniqueGloves() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Gloves))}
    get UniqueBelts() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Belt))}
    get UniqueBoots() {return this.SortArmor(this.GetItemsByType(this.uniques, ItemType.Boots))}

    get UniqueWeapons() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Weapon))}
    get UniqueAxes() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Axe))}
    get UniqueBows() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Bow))}
    get UniqueCrossbows() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Crossbow))}
    get UniqueDaggers() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Knife))}
    get UniqueJavelins() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Javelin))}
    get UniqueKnuckles() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Knuckle))}
    get UniqueMaces() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, Maces))}
    get UniquePolearms() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Polearm))}
    get UniqueScepters() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Scepter))}
    get UniqueSpears() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Spear))}
    get UniqueStaves() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Staff, SorceressWeapons))}
    get UniqueSwords() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Sword))}
    get UniqueThrowingWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, ThrowingWeapons))}
    get UniqueWands() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.Wand))}
    get UniqueAmazonWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, AmazonWeapons))}
    get UniqueAssassinWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, AssassinWeapons))}
    get UniqueBarbarianWeapons() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.BarbarianJavs))}
    get UniqueDruidWeapons() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.DruidClub))}
    get UniqueNecromancerWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, NecromancerWeapons))}
    get UniquePaladinWeapons() {return this.SortWeapons(this.GetItemsByType(this.uniques, ItemType.PaladinSword))}
    get UniqueSorceressWeapons() {return this.SortWeapons(this.GetItemsByTypeGroup(this.uniques, SorceressWeapons))}
    //#endregion

    SearchForItems(options: ItemSearchOptions) {
        let results: Item[] = [];

        results = this.GetItemsByCategory(options.category);

        if (options.slotType.length) {
            results = results.filter(item => SlotTypeToBodyLocations(options.slotType).some(loc => item.bodyLocations.includes(loc)));
        }

        if (options.characterClass.length) {
            results = results.filter(item => !item.typeCodes.includes(ItemType.ClassSpecific) || item.typeCodes.includes(CharacterClassToItemType(options.characterClass)));
        }

        if (options.name.length) {
            results = results.filter(item => item.name.toLowerCase().includes(options.name.toLowerCase()));
        }

        if (options.code.length) {
            results = results.filter(item => item.code.toLowerCase() == options.code.toLowerCase());
        }

        results = this.SortItems(results, options.category);

        return results;
    }

    searchItemsByNameOrCode(searchVal: string) {
        return this.AllItems.filter(item => item.name?.toLowerCase().includes(searchVal.toLowerCase()) || item.code?.toLowerCase().includes(searchVal.toLowerCase()));
    }

    searchItemsByPropertyCode(propertyCode: string) {
        return this.AllItems.filter(item => item.properties.find(property => property.code === propertyCode));
    }

    GetItemsByCategory(category: Category) {
        switch (category) {
            case Category.UniqueArmor:
                return this.UniqueArmor;
            case Category.UniqueWeapons:
                return this.UniqueWeapons;
            case Category.Armor:
                return this.Armor;
            case Category.Weapons:
                return this.Weapons;
            case Category.Empty:
            default:
                return this.AllItems;
        }
    }

    private SortItems(items: Item[], category: Category) {
        switch (category) {
            case Category.Miscellaneous:
                return _(items).sortBy(item => item.qualityLevel).value();
            case Category.Armor:
            case Category.Weapons:
            case Category.UniqueArmor:
            case Category.UniqueWeapons:
                return _(items).sortBy(item => item.qualityLevel).sortBy(item => item.tier).uniqBy(item => item.name).value();
            default:
                return items;
        }
    }

    //#region Item Methods
    SortMisc(misc: Item[]) {
        return this.SortItems(misc, Category.Miscellaneous);
    }

    SortArmor(armor: Item[]) {
        return this.SortItems(armor, Category.Armor);
    }

    SortWeapons(weapons: Item[]) {
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
            result = this.FilterItems(items, (item) => include.every(val => item.typeCodes.includes(val)));
        } else {
            result = this.FilterItems(items, (item) => item.typeCodes.includes(include));
        }

        if (exclude) {
            if (exclude instanceof Array) {
                result = result.filter(item => exclude.every(val => !item.typeCodes.includes(val)));
            } else {
                result = result.filter(item => !item.typeCodes.includes(exclude));
            }
        }

        return result;
    }

    GetItemsByTypeGroup(items: Item[], include: ItemType[]) {
        return this.FilterItems(items, item => include.includes(item.type));
    }

    GetMiscByCode(code: string) {
        return this.miscellaneous.find(item => item.code == code);
    }

    GetArmorByCode(code: string) {
        return this.armor.find(item => item.code == code);
    }

    GetWeaponByCode(code: string) {
        return this.weapons.find(item => item.code == code);
    }

    GetItemByCode(code: string) {
        return this.AllItems.findLast(item => item.code === code);
    }
    //#endregion

    //#region Item Property Methods
    GetPropertyByCode(code: string) {
        return this.properties.find(property => property.code == code);
    }
    //#endregion

    //#region Factory Methods
    private recurseItemTypes(codeList: ItemType[], types: ItemTypeData[], codeToFind: ItemType) {
        const codeToAdd = types.find(itemType => itemType.Code == codeToFind);
    
        if (codeToAdd && !codeList.includes(codeToAdd.Code as ItemType)) {
            codeList.push(codeToAdd.Code as ItemType);
    
            if (codeToAdd.Equiv1) {
                this.recurseItemTypes(codeList, types, codeToAdd.Equiv1 as ItemType);
            }
    
            if (codeToAdd.Equiv2) {
                this.recurseItemTypes(codeList, types, codeToAdd.Equiv2 as ItemType);
            }
        }
    
        return codeToAdd;
    }

    createItem(itemKind: ItemKind, itemData: ItemData): Item {
        // Metadata
        const kind = itemKind;
        const code = itemData.code;
        const name = strings[itemData.namestr as keyof typeof strings] || itemData.name;
        const baseName = name;
        const type = itemData.type as ItemType;
        const type2 = itemData.type2 as ItemType;
        const typeCodes: ItemType[] = [];
        const itemType = this.recurseItemTypes(typeCodes, ItemTypes, type);
        const isModified = false;
        // Base Stats
        const carryOne = false;
        const qualityLevel = toNumber(itemData.level);
        const requiredLevel = toNumber(itemData.levelreq);
        const isIndestructible = Boolean(toNumber(itemData.nodurability));
        const isWearable = Boolean(toNumber(itemType?.Body));
        const bodyLocations: BodyLocation[] = [];
        if (isWearable) {
            bodyLocations.push(itemType!.BodyLoc1 as BodyLocation);
            bodyLocations.push(itemType!.BodyLoc2 as BodyLocation);
        }
        const autoPrefix = itemData['auto prefix'];
        const staffMods = itemType?.StaffMods;
        const classRestriction = itemType?.Class;
        const speed = toNumber(itemData.speed);
        const damageMin = toNumber(itemData.mindam);
        const damageMax = toNumber(itemData.maxdam);
        const isInsertable = Boolean(toNumber(itemType?.Gem as string)); 
        const isSocketable = Boolean(toNumber(itemData.hasinv));
        const maxSockets = toNumber(itemData.gemsockets);
        const socketType = GemType[toNumber(itemData.gemapplytype) as keyof typeof GemType];
        // Equipment Properties
        const codeNormal = itemData.normcode;
        const codeExceptional = itemData.ubercode;
        const codeElite = itemData.ultracode;
        let tier: ItemTier;
        switch (code) {
            case codeExceptional:
                tier = ItemTier.Exceptional;
                break;
            case codeElite:
                tier = ItemTier.Elite;
                break;
            case codeNormal:
            default:
                tier = ItemTier.Normal;
                break;
        }
        const magicLevel = toNumber(itemData['magic lvl']);
        const durability = toNumber(itemData.durability);
        const requiredStrength = toNumber(itemData.reqstr);
        const strengthBonus = toNumber(itemData.StrBonus);
        const dexterityBonus = toNumber(itemData.DexBonus);
        // Armor Properties
        const defenseMin = toNumber(itemData.minac);
        const defenseMax = toNumber(itemData.maxac);
        const chanceToBlock = toNumber(itemData.block);
        // Weapon Properties
        const requiredDexterity = toNumber(itemData.reqdex);
        const weaponClass1H = itemData.wclass;
        const weaponClass2H = itemData['2handedwclass'];
        const is2H = Boolean(toNumber(itemData['2handed']));
        const isDualWieldable = Boolean(toNumber(itemData['1or2handed']));
        const damageMin2H = toNumber(itemData['2handmindam']);
        const damageMax2H = toNumber(itemData['2handmaxdam']);
        const range = toNumber(itemData.rangeadder);

        return {
            kind,
            code,
            name,
            baseName,
            type,
            type2,
            typeCodes,
            carryOne,
            qualityLevel,
            requiredLevel,
            isIndestructible,
            isWearable,
            bodyLocations,
            autoPrefix,
            staffMods,
            classRestriction,
            speed,
            damageMin,
            damageMax,
            isInsertable,
            isSocketable,
            maxSockets,
            socketType,
            codeNormal,
            codeExceptional,
            codeElite,
            tier,
            magicLevel,
            durability,
            requiredStrength,
            strengthBonus,
            dexterityBonus,
            defenseMin,
            defenseMax,
            chanceToBlock,
            requiredDexterity,
            weaponClass1H,
            weaponClass2H,
            is2H,
            isDualWieldable,
            damageMin2H,
            damageMax2H,
            range,
            properties: [],
            isModified
        }
    }

    createUniqueItem(uniqueItemData: UniqueItemData): Item | undefined {
        // const baseItem = this.GetItemByCode(uniqueItemData.code);
        const baseItem = this.AllItems.find(item => item.code === uniqueItemData.code);

        if (!baseItem)
            return;

        const name = strings[uniqueItemData.index as keyof typeof strings];
        const baseName = baseItem.name;
        const carryOne = Boolean(Number(uniqueItemData.carry1));
        const qualityLevel = toNumber(uniqueItemData.lvl);
        const requiredLevel = toNumber(uniqueItemData['lvl req']);
        const properties: ItemProperty[] = [];

        for (let i = 1; i < 13; i++) {
            const property = this.GetPropertyByCode(uniqueItemData[`prop${i}` as keyof UniqueItemData]);
            
            if (property) {
                properties.push(this.createItemProperty(
                    property,
                    toNumber(uniqueItemData[`min${i}` as keyof UniqueItemData]),
                    toNumber(uniqueItemData[`max${i}` as keyof UniqueItemData]),
                    uniqueItemData[`par${i}` as keyof UniqueItemData]
                ));
            }
        }

        return { 
            ...baseItem, 
            kind: ItemKind.UniqueItem,
            name,
            baseName,
            carryOne, 
            qualityLevel, 
            requiredLevel, 
            properties 
        }
    }

    createItemProperty(property: Property, min: number, max: number, parameter: string): ItemProperty {
        const code = property.code;
        const func = 7;
        const statCodes: string[] = [];
        const descriptions: ItemPropertyDescription[] = [];

        if (property.stats.length) {
            for (const stat of property.stats) {
                statCodes.push(stat.code);
                const description = NewItemPropertyDescription(property, stat, min, max, parameter);
                if (description.text) {
                    descriptions.push(description);
                }
            }
        } else {
            // Special case for properties with no child stats (i.e. Enhanced Damage)
            const description = NewItemPropertyDescription(property, null, min, max, parameter);
            if (description.text) {
                descriptions.push(description);
            }
        }

        return {
            code,
            function: func,
            min,
            max,
            parameter,
            statCodes,
            descriptions
        }
    }

    createProperty(propertyData: PropertyData): Property {
        const code = propertyData.code;
        const isActive = Boolean(propertyData["*done"]);
        const description = propertyData["*desc"];
        const descriptionParameter = propertyData["*param"];
        const descriptionMin = propertyData["*min"];
        const descriptionMax = propertyData["*max"];
        const notes = propertyData["*notes"];

        const stats: Stat[] = [];
        for (let i = 1; i < 8; i++) {
            const stat = this.createStat(propertyData, i);

            if (stat) {
                stats.push(stat);
            }
        }

        return {
            code,
            isActive,
            description,
            descriptionParameter,
            descriptionMin,
            descriptionMax,
            notes,
            stats
        }
    }
    
    createStat(propertyData: PropertyData, i: number): Stat | undefined {
        const code = propertyData[`stat${i}` as keyof PropertyData];

        let descriptionFunction = 0;
        let descriptionValue = 0;
        let description1 = "";
        let description2 = "";
        let descriptionPriority = 0;

        const itemStat = ItemStatJson.find((item_stat: ItemStatCostData) => item_stat.Stat === code);

        if (itemStat) {
            descriptionFunction = toNumber(itemStat.descfunc);
            descriptionValue = toNumber(itemStat.descval);

            if (itemStat.descstrpos.length) {
                description1 = strings[itemStat.descstrpos as keyof typeof strings];
            }
            
            if (itemStat.descstr2.length) {
                description2 = strings[itemStat.descstr2 as keyof typeof strings];
            }

            descriptionPriority = toNumber(itemStat.descpriority);
        }

        const func = toNumber(propertyData[`func${i}` as keyof PropertyData]);
        const set = propertyData[`set${i}` as keyof PropertyData];
        const value =propertyData[`val${i}` as keyof PropertyData];

        if (code.length) {
            return {
                code,
                descriptionFunction,
                descriptionValue,
                description1,
                description2,
                descriptionPriority,
                function: func,
                set,
                value
            }
        }
    }
    //#endregion
}

export const ItemCatalogContext = createContext(new ItemCatalog());
