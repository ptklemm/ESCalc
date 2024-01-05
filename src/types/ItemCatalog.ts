import _ from 'lodash';
import { createContext } from 'react';

import MiscellaneousJson from '../data/json/Miscellaneous.json';
import ArmorJson from '../data/json/Armor.json';
import WeaponJson from '../data/json/Weapons.json';
import PropertyJson from '../data/json/Properties.json';
// import UniqueItemJson from '../data/json/UniqueItems.json';

import { ItemData } from './ItemData';
import { PropertyData } from './PropertyData';
// import { UniqueItemData } from './UniqueItemData';

import { Item, NewItem } from './Item';
import { SlotType, SlotTypeToBodyLocations } from './Inventory';
import { Property } from './Property';
import { ItemType } from './ItemType';

import { CharacterClass } from './Character';

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
    // private items: Item[];
    private miscellaneous: Item[];
    private armor: Item[];
    private weapons: Item[];
    private properties: Property[];
    // private uniques: UniqueItem[];

    constructor() {
        // this.items = [];
        this.miscellaneous = [];
        this.armor = [];
        this.weapons = [];
        this.properties = [];
        // this.uniques = [];

        // ToDo: Figure out why Typescript thinks this is an object
        (MiscellaneousJson as ItemData[]).forEach((itemData: ItemData) => {
            this.miscellaneous.push(NewItem(itemData));
        });

        ArmorJson.forEach((itemData: ItemData) => {
            this.armor.push(NewItem(itemData));
        });

        WeaponJson.forEach((itemData: ItemData) => {
            this.weapons.push(NewItem(itemData));
        });

        PropertyJson.forEach((data: PropertyData) => {
            this.properties.push(new Property(data));
        });

        // UniqueItemJson.forEach((data: UniqueItemData) => {
        //     this.uniques.push(new UniqueItem(this, data));
        // });
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

    //#region Magic Property Methods
    GetPropertyByCode(code: string) {
        return this.properties.find(property => property.Code == code);
    }
    //#endregion

    //#region Unique Item Methods
    // GetUniqueItemsByBaseType(uniqueItems: UniqueItem[], include: ItemType) {
    //     return uniqueItems.filter(unique => unique.BaseItem?.TypeCodes.includes(include));
    // }

    // GetUniqueItemByName(name: string) {
    //     return this.uniques.find(unique => unique.Name == name);
    // }

    // public SortUniqueMisc(uniques: UniqueItem[]) {
    //     // return this.SortItems(uniques, Category.UniqueMiscellaneous) as UniqueItem[];
    //     console.log(uniques);
    // }

    // public SortUniqueArmor(uniques: UniqueItem[]) {
    //     // return this.SortItems(uniques, Category.UniqueArmor) as UniqueItem[];
    //     console.log(uniques);
    // }

    // public SortUniqueWeapons(uniques: UniqueItem[]) {
    //     // return this.SortItems(uniques, Category.UniqueWeapons) as UniqueItem[];
    //     console.log(uniques);
    // }
    //#endregion
}

export const ItemCatalogContext = createContext(new ItemCatalog());
